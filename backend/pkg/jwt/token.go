package jwt

import (
	"devcollab/configs"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID string) (string, error) {
	secretKey := configs.Env.JwtSecret

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour * 25).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ValidateAccessToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return configs.Env.JwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("Invalid or expired token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("Invalid Token Claim")
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("user ID not found in token")
	}

	return userID, nil
}
