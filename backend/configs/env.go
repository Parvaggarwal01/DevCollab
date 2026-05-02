package configs

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

type env struct {
	SmtpHost     string
	SmtpPassword string
	SmtpUser     string
	SmtpPort     string

	DatabaseUrl string
	RedisUrl    string

	JwtSecret []byte
}

var Env *env
var envOnce sync.Once

func init() {
	envOnce.Do(func() {
		err := godotenv.Load()
		if err != nil {
			log.Println("NO .env found")
		}

		Env = &env{
			SmtpHost:     os.Getenv("SMTP_HOST"),
			SmtpPassword: os.Getenv("SMTP_PASSWORD"),
			SmtpUser:     os.Getenv("SMTP_USER"),
			SmtpPort:     os.Getenv("SMTP_PORT"),

			DatabaseUrl: os.Getenv("DATABASE_URL"),
			RedisUrl:    os.Getenv("REDIS_URL"),

			JwtSecret: []byte(os.Getenv("JWT_SECRET")),
		}
	})
}
