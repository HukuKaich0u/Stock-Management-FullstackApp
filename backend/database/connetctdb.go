package database

import (
	"backend/models"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error: %v", err)
		return
	}

	host := os.Getenv("HOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	portStr := os.Getenv("DBPORT")
	sslmode := os.Getenv("SSLMODE")
	TimeZone := os.Getenv("TIMEZONE")

	port, err := strconv.Atoi(portStr)
	if err != nil {
		log.Fatal("データベースポート番号の取得に失敗")
		return
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s", host, user, password, dbname, port, sslmode, TimeZone)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("データベース接続に失敗")
		return
	}
	log.Println("データベース接続に成功")

	if err := db.AutoMigrate(&models.User{}, &models.Item{}); err != nil {
		log.Fatal("マイグレーションに失敗")
		return
	}
	log.Println("マイグレーションに成功")

	DB = db
}
