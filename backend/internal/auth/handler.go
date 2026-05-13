package auth

import (
	"devcollab/configs"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	user, err := RegisterUser(c.Request.Context(), req)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") || strings.Contains(err.Error(), "unique constraints") {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}

		log.Printf("Registration Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered Successfully. Please check your email for the verification code.",
		"user":    user,
	})
}

func Verify(c *gin.Context) {
	var req VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	if err := VerifyOtp(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email Successfully verified"})

}

func Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	res, err := LoginUser(c.Request.Context(), req)
	if err != nil {
		log.Printf("Login Error: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inavlid request format"})
		return
	}

	err := RequestPasswordReset(c.Request.Context(), req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "If an account with this email exists, a password reset code has been sent."})

}

func ResetPasswordHandler(c *gin.Context) {
	var req ResetPasswordResponse
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	err := ResetPassword(c.Request.Context(), req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password Successfully Reset. You can log in."})

}

func RefreshToken(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	res, err := RefreshTokens(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func Logout(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format"})
		return
	}

	err := LogoutUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully Logged Out"})
}

func GoogleLoginRedirect(c *gin.Context) {
	url := configs.GoogleOAuthConfig.AuthCodeURL("random-state-string")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GithubLoginRedirect(c *gin.Context) {
	url := configs.GithubOAuthConfig.AuthCodeURL("random-state-string")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error:": "Code Not found in the URL"})
		return
	}

	token, err := configs.GoogleOAuthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token from google oauth"})
		return
	}

	clients := configs.GoogleOAuthConfig.Client(c.Request.Context(), token)
	resp, err := clients.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Fetch user profile"})
		return
	}
	defer resp.Body.Close()

	var googleUser GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Decode the google user data"})
		return
	}

	loginData, err := ProcessOAuthLogin(c.Request.Context(), googleUser.Email, googleUser.GivenName, googleUser.FamilyName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	frontendURL := fmt.Sprintf("http://localhost:3000/auth/oauth-success?access_token=%s&refresh_token=%s",
		loginData.Token,
		loginData.RefreshToken,
	)

	c.Redirect(http.StatusTemporaryRedirect, frontendURL)
}


func GithubCallback(c *gin.Context){
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found in URL"})
		return
	}

	token, err := configs.GithubOAuthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token from github oauth"})
		return
	}

	client :=  configs.GithubOAuthConfig.Client(c.Request.Context(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info from github"})
		return
	}
	defer resp.Body.Close()

	var githubUser GithubUserInfo
	json.NewDecoder(resp.Body).Decode(&githubUser)

	if githubUser.Email == "" {
		emailResp, err := client.Get("https://api.github.com/user/emails")
		if err == nil {
			defer emailResp.Body.Close()
			var emails []GithubEmail
			json.NewDecoder(emailResp.Body).Decode(&emails)

			for _, e := range emails {
				if e.Primary && e.Verified {
					githubUser.Email = e.Email
					break
				}
			}
		}
	}
	if githubUser.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "GitHub email is required but hidden"})
		return
	}

	firstName := githubUser.Login
	lastName := ""
	if githubUser.Name != "" {
		nameParts := strings.SplitN(githubUser.Name, " ", 2)
		firstName = nameParts[0]
		if len(nameParts) > 1 {
			lastName = nameParts[1]
		}
	}

	loginData, err := ProcessOAuthLogin(c.Request.Context(), githubUser.Email, firstName, lastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	frontendURL := fmt.Sprintf("http://localhost:3000/auth/oauth-success?access_token=%s&refresh_token=%s", 
		loginData.Token,
		loginData.RefreshToken,
	)

	c.Redirect(http.StatusTemporaryRedirect, frontendURL)
}