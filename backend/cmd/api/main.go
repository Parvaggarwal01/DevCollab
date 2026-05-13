package main

import (
	"log"
	"net/http"

	"devcollab/configs"
	"devcollab/database"
	"devcollab/internal/auth"
	"devcollab/internal/org"
	"devcollab/pkg/redis"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()

	defer database.Close()

	redis.Connect()

	router := gin.Default()

	configs.InitOAuth()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "DevCollab API is Running!",
		})
	})

	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", auth.Register)
		authGroup.POST("/verifyotp", auth.Verify)
		authGroup.POST("/login", auth.Login)
		authGroup.GET("/google/login", auth.GoogleLoginRedirect)
		authGroup.GET("/github/login", auth.GithubLoginRedirect)
		authGroup.GET("/google/callback", auth.GoogleCallback)
		authGroup.GET("/github/callback", auth.GithubCallback)
		authGroup.POST("/forgot-password", auth.ForgotPassword)
		authGroup.POST("/reset-password", auth.ResetPasswordHandler)
		authGroup.POST("/refresh", auth.RefreshToken)
	}



	apiGroup := router.Group("/api")
	apiGroup.Use(auth.Protect())
	{
		apiGroup.GET("/me", func(c *gin.Context) {
			userID, _ := c.Get("userID")

			c.JSON(http.StatusOK, gin.H{
				"message": "You are securely authenticated!",
				"user_id": userID,
			})
		})
		apiGroup.POST("/auth/logout", auth.Logout)
		apiGroup.POST("/orgs", org.CreateOrg)
		apiGroup.GET("/orgs", org.GetUserOrgs)
		apiGroup.POST("/orgs/:id/invite", org.InviteUser)
		apiGroup.POST("/orgs/join", org.JoinOrg)
	}

	log.Println("Server is starting on port 8080...")
	router.Run(":8080")
}
