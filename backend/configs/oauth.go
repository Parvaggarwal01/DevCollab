package configs

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

var GoogleOAuthConfig *oauth2.Config
var GithubOAuthConfig *oauth2.Config

func InitOAuth() {
	GoogleOAuthConfig = &oauth2.Config{
		ClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL: "http://localhost:8080/api/auth/google/callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	GithubOAuthConfig = &oauth2.Config{
		ClientID: os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL: "http://localhost:8080/api/auth/github/callback",
		Scopes: []string{"read:user", "user:email"},
		Endpoint: github.Endpoint,
	}
}