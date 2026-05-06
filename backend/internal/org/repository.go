package org

import (
	"context"
	"devcollab/database"
)

func CreateOrganization(ctx context.Context, userID string, name string) (*Organization, error) {
	tx, err := database.Pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var org Organization
	orgQuery := `
						INSERT INTO organizations (name)
						VALUES ($1)
						RETURNING id, name, created_at, updated_at
	`

	err = tx.QueryRow(ctx, orgQuery, name).Scan(
		&org.ID,
		&org.Name,
		&org.CreatedAt,
		&org.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	memberQuery := `
							INSERT INTO organization_members (org_id, user_id, role)
							VALUES ($1, $2, 'owner')
	`

	_, err = tx.Exec(ctx, memberQuery, org.ID, userID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return &org, nil

}
