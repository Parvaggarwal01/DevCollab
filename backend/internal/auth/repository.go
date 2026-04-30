package auth

import (
	"context"
	"devcollab/database"
)

func CreateUser(ctx context.Context, email string, hashedPassword string) (*User, error) {
	query := `
					INSERT INTO users (email, password_hash)
					VALUES ($1, $2)
					RETURNING id, email, created_at, updated_at
	`

	var user User

	err := database.Pool.QueryRow(ctx, query, email, hashedPassword).Scan(
		&user.ID,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil

}