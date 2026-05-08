package auth

import (
	"context"
	"devcollab/database"
)

func CreateUser(ctx context.Context, firstName, lastName, email string, hashedPassword string) (*User, error) {
	query := `
					INSERT INTO users (first_name, last_name, email, password_hash)
					VALUES ($1, $2, $3, $4)
					RETURNING id, first_name, last_name, email, is_verified, created_at, updated_at
	`

	var user User

	err := database.Pool.QueryRow(ctx, query, email, hashedPassword).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil

}

func UpdateUserVerification(ctx context.Context, email string) error {
	query := `
					UPDATE users
					SET is_verified = true, updated_at = NOW()
					WHERE email = $1
	`
	_, err := database.Pool.Exec(ctx, query, email)
	return err
}

func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	query := `
					SELECT id, email, password_hash, is_verified, created_at, updated_at
					FROM users
					WHERE email = $1
	`

	var user User
	err := database.Pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func UpdateUserPassword(ctx context.Context, email string, newHashedPassword string) error {
	query := `
					UPDATE users
					SET password_hash = $2, updated_at = NOW()
					WHERE email = $1
	`
	_, err := database.Pool.Exec(ctx, query, email, newHashedPassword)
	return err
}
