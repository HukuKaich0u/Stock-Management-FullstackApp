package main

import (
	"backend/controllers"
	"backend/database"
	"backend/middleware"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()
	PORT := os.Getenv("PORT")
	router := gin.Default()
	allowOrigins := []string{"http://localhost:3000/user/register", "https://localhost:8080/user/register"}
	router.Use(middleware.CorsMiddleware(allowOrigins))

	{
		userRoutes := router.Group("/user")
		userRoutes.POST("/register", controllers.RegisterUser)
	}

	router.POST("")
	router.Run(PORT)
}
