package auth

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req);
	err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return;
	}

	user, err := RegisterUser(c.Request.Context(), req)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") || strings.Contains(err.Error(), "unique constraints") {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return;
		}

		log.Printf("Registration Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered Successfully",
		"user": user,
	})
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