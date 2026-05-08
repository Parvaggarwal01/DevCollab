package org

import (
	"context"
	"devcollab/pkg/utils"
	"errors"
	"log"
	"time"
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

func InviteUserToOrg(ctx context.Context, inviterID string, orgID string, req InviteUserRequest) error {
	role, err:= GetMemberRole(ctx, orgID, inviterID)
	if err != nil {
		return errors.New("Unauthorized: You are not a member of this organization")
	}
	if role != "owner" && role != "admin" {
		return errors.New("Unauthorized: Only Owner and admin can invite users")
	}

	org, err := GetOrganizationByID(ctx, orgID)
	if err != nil {
		return errors.New("Organization not found")
	}

	token, err := utils.GenerateMagicToken();
	if err != nil {
		return errors.New("Failed to Generate Secure Token")
	}

	expiresAt := time.Now().Add(72 * time.Hour)
	err = CreateInvitation(ctx, orgID, inviterID, req.Email, req.Role, token, expiresAt)
	if err != nil {
		log.Printf("DB Error creating invite:  %v", err)
		return errors.New("Failed to Save invitation")
	}

	err = utils.SendInvitationEmail(req.Email, org.Name, token)
	if err != nil {
		log.Printf("Email Error: %v", err)
		return errors.New("Failed to send invitation email")
	}

	return nil
}