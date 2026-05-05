package redis

import (
	"context"
	"crypto/tls"
	"devcollab/configs"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

var Client *redis.Client

func Connect() {
	redisURL := configs.Env.RedisUrl
	if redisURL == "" {
		log.Fatal("REDIS_URL is not set")
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Failed to Parse REDIS URL : %v", err)
	}

	opt.TLSConfig = &tls.Config{}
	Client = redis.NewClient(opt)

	_, err = Client.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}
	fmt.Println("Succesfully connected to Redis!")
}
