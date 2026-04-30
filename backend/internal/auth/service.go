package auth

import (
	"context"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(ctx context.Context, req RegisterRequest) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	return CreateUser(ctx, req.Email, string(hashedPassword))
}