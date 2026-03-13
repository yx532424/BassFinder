package main

import (
	"bass-finder-backend/config"
	"bass-finder-backend/models"
	"bass-finder-backend/routes"
	"bass-finder-backend/utils"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库
	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 自动迁移表
	err = db.AutoMigrate(
		&models.User{},
		&models.CheckIn{},
		&models.Favorite{},
	)
	if err != nil {
		log.Fatalf("表迁移失败: %v", err)
	}

	// 初始化 Gin
	r := gin.Default()

	// CORS 中间件
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 静态文件服务
	r.Static("/static", "./static")

	// 路由
	api := r.Group("/api")
	{
		// 公开路由
		api.POST("/register", routes.Register(db))
		api.POST("/login", routes.Login(db))

		// 需要认证的路由
		auth := api.Group("")
		auth.Use(utils.AuthMiddleware())
		{
			// 用户信息
			auth.GET("/user", routes.GetUserInfo(db))
			auth.PUT("/user", routes.UpdateUserInfo(db))

			// 签到
			auth.POST("/checkin", routes.CheckIn(db))
			auth.GET("/checkin/stats", routes.GetCheckInStats(db))

			// 收藏
			auth.GET("/favorites", routes.GetFavorites(db))
			auth.POST("/favorites", routes.AddFavorite(db))
			auth.DELETE("/favorites/:id", routes.DeleteFavorite(db))
		}
	}

	// 启动服务器
	s := &http.Server{
		Addr:           ":8080",
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("Bass Finder API 服务启动: http://47.103.194.43:8080")
	if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务启动失败: %v", err)
	}
}
