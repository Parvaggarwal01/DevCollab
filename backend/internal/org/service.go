package org

import (
	"context"
	"errors"
)

func CreateNewOrg(ctx context.Context, userID string, req CreateOrgRequest) (*CreateOrgResponse, error) {
	org, err := CreateOrganization(ctx, userID, req.Name)
	if err != nil {
		return nil, errors.New("Failed to Create Organization")
	}

	return &CreateOrgResponse{
		Organization: *org,
		Role:         "owner",
	}, nil
}
