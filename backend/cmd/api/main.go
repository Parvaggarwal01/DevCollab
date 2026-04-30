package main

import (
	"log"
	"net/http"

	"devcollab/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("NO .env found")
	}

	database.Connect()

	defer database.Close()

	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "DevCollab API is Running!",
		})
	})

	log.Println("Server is starting on port 8080...")
	router.Run(":8080")
}