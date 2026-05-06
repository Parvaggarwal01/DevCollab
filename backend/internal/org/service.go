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

func GetUserOrganizations(ctx context.Context, userID string) ([]UserOrgResponse, error) {
	orgs, err := GetOrganizationsByUserID(ctx, userID)
	if err != nil {
		return nil, errors.New("Failed to Fetch organizations")
	}

	return orgs, nil
}
