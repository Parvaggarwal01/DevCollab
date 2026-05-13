package auth

import (
	"context"
	"crypto/subtle"
	"devcollab/pkg/jwt"
	"devcollab/pkg/redis"
	"devcollab/pkg/utils"
	"errors"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(ctx context.Context, req RegisterRequest) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	otp := utils.GenerateOTP()

	user, err := CreateUser(ctx, req.FirstName, req.LastName, req.Email, string(hashedPassword))
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

	token, refreshToken, err := jwt.GenerateToken(user.ID)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	redisKey := "refresh_token:" + user.ID
	err = redis.Client.Set(ctx, redisKey, refreshToken, 7*24*time.Hour).Err()
	if err != nil {
		log.Printf("Redis Error: Failed to Store Token on Redis %s", err)
		return nil, errors.New("Failed to Save Session")
	}
	return &LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         *user,
	}, nil
}

func RefreshTokens(ctx context.Context, req RefreshRequest) (*RefreshResponse, error) {
	userID, err := jwt.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, errors.New("Unauthorized: Invalid or Expired token")
	}

	redisKey := "refresh_token:" + userID
	savedToken, err := redis.Client.Get(ctx, redisKey).Result()
	if err != nil || savedToken != req.RefreshToken {
		return nil, errors.New("Unauthorized: Token revoked")
	}

	newAccessToken, newRefreshToken, err := jwt.GenerateToken(userID)
	if err != nil {
		return nil, errors.New("Failed to generate new tokens")
	}

	err = redis.Client.Set(ctx, redisKey, newRefreshToken, 7*24*time.Hour).Err()
	if err != nil {
		return nil, errors.New("Failed to update new sessions")
	}

	return &RefreshResponse{
		Token:        newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil
}

func RequestPasswordReset(ctx context.Context, req ForgotPasswordRequest) error {
	user, err := GetUserByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil
	}

	if !user.IsVerified {
		return errors.New("Please Verify Your Email Address")
	}

	otp := utils.GenerateOTP()

	if otp == "" {
		return errors.New("failed to Generate OTP")
	}

	redisKey := "reset_otp:" + req.Email
	err = redis.Client.Set(ctx, redisKey, otp, 15*time.Minute).Err()
	if err != nil {
		log.Printf("Redis Error: Failed to Save reset OTP for %s: %v", req.Email, err)
		return errors.New("Internal Server Error")
	}

	err = utils.SendPasswordResetEmail(req.Email, otp)
	if err != nil {
		log.Printf("Email Error: Failed to Send Reset Email %s: %v", req.Email, err)
		return errors.New("failed to send email")
	}

	return nil
}

func ResetPassword(ctx context.Context, req ResetPasswordResponse) error {
	redisKey := "reset_otp:" + req.Email
	savedOTP, err := redis.Client.Get(ctx, redisKey).Result()
	if err != nil {
		return errors.New("Invalid or Expired OTP")
	}

	if savedOTP != req.OTP {
		return errors.New("Incorrect OTP")
	}

	user, err := GetUserByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return errors.New("User not found")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)

	if err != nil {
		return errors.New("Failed to Secure New Password")
	}

	err = UpdateUserPassword(ctx, req.Email, string(hashedPassword))

	if err != nil {
		return errors.New("Failed to Update Password")
	}

	redis.Client.Del(ctx, redisKey)
	redis.Client.Del(ctx, "refresh_token:"+user.ID)

	return nil
}

func LogoutUser(ctx context.Context, userID string) error {
	redisKey := "refresh_token:" + userID

	err := redis.Client.Del(ctx, redisKey).Err()

	if err != nil {
		return errors.New("Failed to Logout user")
	}

	return nil
}

func ProcessOAuthLogin(ctx context.Context, email, firstName, lastName string) (*LoginResponse, error) {
	user, err := GetOrCreateOAuthUser(ctx, email, firstName, lastName);
	
	if err != nil {
		return nil, errors.New("Failed to Get or Create User")
	}

	accessToken, refreshToken, err := jwt.GenerateToken(user.ID)

	if err != nil {
		return nil, errors.New("Failed to create Access Token and Refresh Token")
	}

	redisKey := "refresh_token:" + user.ID
	// Invalidate old session
	redis.Client.Del(ctx, redisKey)

	// Store new session
	err = redis.Client.Set(ctx, redisKey, refreshToken, 7*24*time.Hour).Err()
	if err != nil {
		log.Printf("Redis Error: Failed to Store OAuth Token on Redis %s", err)
		return nil, errors.New("Failed to Save Session")
	}

	return &LoginResponse{
		Token: accessToken,
		RefreshToken: refreshToken,
		User: *user,
	}, nil
}