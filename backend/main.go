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
	allowOrigins := []string{"http://localhost:3000", "https://localhost:8080"}
	router.Use(middleware.CorsMiddleware(allowOrigins))

	router.POST("/items", controllers.CreateItems)
	router.GET("/items/stock/view", controllers.GetAllItems)
	router.DELETE("/items/:id", controllers.DeleteItems)

	router.POST("")
	router.Run(PORT)
}
