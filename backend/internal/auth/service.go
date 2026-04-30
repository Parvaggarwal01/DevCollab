package auth

import (
	"context"
	"errors"
	"devcollab/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(ctx context.Context, req RegisterRequest) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	return CreateUser(ctx, req.Email, string(hashedPassword))
}

func LoginUser(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	user, err := GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
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
		User: *user,
	}, nil
}