package org

import (
	"context"
	"devcollab/database"
	"time"
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

func GetOrganizationsByUserID(ctx context.Context, userID string) ([]UserOrgResponse, error) {
	query := `
				SELECT
								o.id, o.name, o.created_at, o.updated_at,
								om.role, om.joined_at
				FROM organizations o
				JOIN organization_members om ON o.id = om.org_id
				WHERE om.user_id = $1
				ORDER BY o.created_at DESC
	`

	rows, err := database.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orgs = make([]UserOrgResponse, 0)

	for rows.Next() {
		var org UserOrgResponse
		err := rows.Scan(
			&org.Organization.ID,
			&org.Organization.Name,
			&org.Organization.CreatedAt,
			&org.Organization.UpdatedAt,
			&org.Role,
			&org.JoinedAt,
		)
		if err != nil {
			return nil, err
		}

		orgs = append(orgs, org)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return orgs, nil
}

func GetMemberRole(ctx context.Context, orgID string, userID string) (string, error) {
	var role string
	query := `SELECT role from organization_members WHERE org_id = $1 AND user_id = $2`
	err := database.Pool.QueryRow(ctx, query, orgID, userID).Scan(&role)
	return role, err
}

func GetOrganizationByID(ctx context.Context, orgID string) (*Organization, error) {
	var org Organization
	query := `SELECT id, name, created_at, updated_at from organizations WHERE id = $1`
	err := database.Pool.QueryRow(ctx, query, orgID).Scan(&org.ID, &org.Name, &org.CreatedAt, &org.UpdatedAt)
	return &org, err
}

func CreateInvitation(ctx context.Context, orgID, inviterID, email, role, token string, expiresAt time.Time) error {
	query := `
				INSERT INTO organization_invitations (org_id, inviter_id, email, role, token, expires_at, status)
				VALUES ($1, $2, $3, $4, $5, $6, 'pending')
				ON CONFLICT (org_id, email)
				DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at, status = 'pending', role = EXCLUDED.role
	`

	_, err := database.Pool.Exec(ctx, query, orgID, inviterID, email, role, token, expiresAt)
	return err
}