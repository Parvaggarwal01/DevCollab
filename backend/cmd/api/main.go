package main

import (
	"log"
	"net/http"

	"devcollab/database"
	"devcollab/internal/auth"
	"devcollab/pkg/redis"

	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()

	defer database.Close()

	redis.Connect()

	router := gin.Default()

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
	}

	log.Println("Server is starting on port 8080...")
	router.Run(":8080")
}