package auth

import (
	"context"
	"crypto/subtle"
	"devcollab/pkg/jwt"
	"devcollab/pkg/redis"
	"devcollab/pkg/utils"
	"errors"
	"log"
	"time"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(ctx context.Context, req RegisterRequest) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	otp := utils.GenerateOTP()

	user, err := CreateUser(ctx, req.Email, string(hashedPassword))
	if err != nil {
		return nil, err
	}

	redisKey := "otp:" + req.Email
	err = redis.Client.Set(ctx, redisKey, otp, 15*time.Minute).Err()

	if err != nil {
		log.Printf("Failed to Store OTP in redis %x", err)
	}

	err = utils.SendOTPEmail(req.Email, otp)
	if err != nil {
		log.Printf("Failed to send email to %s: %v", req.Email, err)
	} else {
		log.Printf("Succesfully send OTP email to %s", req.Email)
	}

	return user, nil
}

func VerifyOtp(ctx context.Context, req VerifyOTPRequest) error {
	redisKey := "otp:" + req.Email

	savedOTP, err := redis.Client.Get(ctx, redisKey).Result()
	log.Print(savedOTP)
	if err != nil {
		log.Print(err)
		return errors.New("Inavlid or Expire OTP")
	}

	if subtle.ConstantTimeCompare([]byte(savedOTP), []byte(req.OTP)) == 0 {
		return errors.New("OTP is Incorrect")
	}
	err = UpdateUserVerification(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("failed to update user verification status in database: %w", err)
	}

	redis.Client.Del(ctx, redisKey)
	return nil
}

func LoginUser(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	user, err := GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}
	user = nil
	if user == nil {
		return nil, errors.New("User is nil")
	}

	if !user.IsVerified {
		return nil, errors.New("User is not verified")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, err := jwt.GenerateToken(user.ID)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}


	return &LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}
