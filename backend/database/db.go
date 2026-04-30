package database

import (
	"context"
	"fmt"
	"log"
	"os"
	// "time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set in .env file")
	}
	var err error

	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	Pool, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	err = Pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Database Ping Failed: %v\n", err)
	}

	fmt.Println("Successfully connect to CockroachDB")
}

func Close() {
	if Pool != nil {
		Pool.Close()
		fmt.Println("Database connection closed.")
	}
}