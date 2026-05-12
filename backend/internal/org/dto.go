package org

import "time"

type Organization struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OrgMember struct {
	OrdID    string    `json:"org_id"`
	UserID   string    `json:"user_id"`
	Role     string    `json:"role"`
	JoinedAt time.Time `json:"joined_at"`
}

type OrgInvitation struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"org_id"`
	InviterID string    `json:"inviter_id"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	Token     string    `json:"-"`
	Status    string    `json:"status"`
	ExpiredAt time.Time `json:"expired_at"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateOrgRequest struct {
	Name string `json:"name" binding:"required,min=2,max=50"`
}

type InviteUserRequest struct {
	Email string `json:"email" binding:"required,email"`
	Role  string `json:"role" binding:"required,oneof=admin member"`
}

type CreateOrgResponse struct {
	Organization Organization `json:"organization"`
	Role         string       `json:"role"`
}

type UserOrgResponse struct {
	Organization Organization `json:"organization"`
	Role         string       `json:"role"`
	JoinedAt     time.Time    `json:"joined_at"`
}

type JoinOrgrequest struct {
	Token string `json:"token" binding:"required"`
}
