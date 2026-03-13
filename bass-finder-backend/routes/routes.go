package routes

import (
	"bass-finder-backend/models"
	"bass-finder-backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Register 注册
func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
			Nickname string `json:"nickname"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			utils.Error(c, "参数错误")
			return
		}

		// 检查用户名是否已存在
		var count int64
		db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
		if count > 0 {
			utils.Error(c, "用户名已存在")
			return
		}

		// 加密密码
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			utils.Error(c, "注册失败")
			return
		}

		// 创建用户
		nickname := req.Nickname
		if nickname == "" {
			nickname = req.Username
		}

		user := models.User{
			Username: req.Username,
			Password: string(hash),
			Nickname: nickname,
			Score:    10, // 注册送10积分
		}

		if err := db.Create(&user).Error; err != nil {
			utils.Error(c, "注册失败")
			return
		}

		// 生成Token
		token, err := utils.GenerateToken(user.ID, user.Username)
		if err != nil {
			utils.Error(c, "生成Token失败")
			return
		}

		utils.Success(c, "注册成功", gin.H{
			"token": token,
			"user": gin.H{
				"id":       user.ID,
				"username": user.Username,
				"nickname": user.Nickname,
				"score":    user.Score,
			},
		})
	}
}

// Login 登录
func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			utils.Error(c, "参数错误")
			return
		}

		// 查找用户
		var user models.User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			utils.Error(c, "用户名或密码错误")
			return
		}

		// 验证密码
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			utils.Error(c, "用户名或密码错误")
			return
		}

		// 生成Token
		token, err := utils.GenerateToken(user.ID, user.Username)
		if err != nil {
			utils.Error(c, "生成Token失败")
			return
		}

		utils.Success(c, "登录成功", gin.H{
			"token": token,
			"user": gin.H{
				"id":           user.ID,
				"username":     user.Username,
				"nickname":     user.Nickname,
				"avatar":       user.Avatar,
				"score":        user.Score,
				"total_check_in": user.TotalCheckIn,
			},
		})
	}
}

// GetUserInfo 获取用户信息
func GetUserInfo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			utils.Error(c, "用户不存在")
			return
		}

		utils.Success(c, "获取成功", gin.H{
			"id":           user.ID,
			"username":     user.Username,
			"nickname":     user.Nickname,
			"avatar":       user.Avatar,
			"phone":        user.Phone,
			"score":        user.Score,
			"total_check_in": user.TotalCheckIn,
			"created_at":   user.CreatedAt,
		})
	}
}

// UpdateUserInfo 更新用户信息
func UpdateUserInfo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)

		var req struct {
			Nickname string `json:"nickname"`
			Avatar   string `json:"avatar"`
			Phone    string `json:"phone"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			utils.Error(c, "参数错误")
			return
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			utils.Error(c, "用户不存在")
			return
		}

		updates := make(map[string]interface{})
		if req.Nickname != "" {
			updates["nickname"] = req.Nickname
		}
		if req.Avatar != "" {
			updates["avatar"] = req.Avatar
		}
		if req.Phone != "" {
			updates["phone"] = req.Phone
		}

		if err := db.Model(&user).Updates(updates).Error; err != nil {
			utils.Error(c, "更新失败")
			return
		}

		utils.Success(c, "更新成功", gin.H{
			"id":       user.ID,
			"nickname": user.Nickname,
			"avatar":   user.Avatar,
			"phone":    user.Phone,
		})
	}
}

// CheckIn 签到
func CheckIn(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		today := time.Now().Format("2006-01-02")

		// 检查今天是否已签到
		var existingCheckIn models.CheckIn
		err := db.Where("user_id = ? AND check_in_date = ?", userID, today).First(&existingCheckIn).Error
		if err == nil {
			utils.Error(c, "今日已签到")
			return
		}

		// 获取昨天是否签到（计算连续签到）
		yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
		var yesterdayCheckIn models.CheckIn
		yesterdaySigned := db.Where("user_id = ? AND check_in_date = ?", userID, yesterday).First(&yesterdayCheckIn).Error == nil

		// 计算签到积分
		scoreEarned := 5
		bonusScore := 0
		streak := 1

		if yesterdaySigned {
			// 获取连续签到天数
			var streakCount int64
			db.Model(&models.CheckIn{}).Where("user_id = ? AND check_in_date >= ?", 
				userID, 
				time.Now().AddDate(0, 0, -30).Format("2006-01-02"),
			).Count(&streakCount)
			streak = int(streakCount) + 1

			// 每7天翻倍
			if streak%7 == 0 {
				bonusScore = 10
				scoreEarned = 10
			}
		}

		// 创建签到记录
		checkIn := models.CheckIn{
			UserID:      userID,
			CheckInDate: time.Now(),
			ScoreEarned: scoreEarned,
			BonusScore:  bonusScore,
		}

		if err := db.Create(&checkIn).Error; err != nil {
			utils.Error(c, "签到失败")
			return
		}

		// 更新用户积分和签到次数
		db.Model(&models.User{}).Where("id = ?", userID).Updates(map[string]interface{}{
			"score":         gorm.Expr("score + ?", scoreEarned),
			"total_check_in": gorm.Expr("total_check_in + 1"),
		})

		utils.Success(c, "签到成功", gin.H{
			"score_earned":  scoreEarned,
			"bonus_score":  bonusScore,
			"streak":       streak,
			"total_score":  scoreEarned + bonusScore,
			"check_in_date": today,
		})
	}
}

// GetCheckInStats 获取签到统计
func GetCheckInStats(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			utils.Error(c, "用户不存在")
			return
		}

		// 获取最近30天签到记录
		var checkIns []models.CheckIn
		db.Where("user_id = ? AND check_in_date >= ?", userID, time.Now().AddDate(0, 0, -30).Format("2006-01-02")).
			Order("check_in_date DESC").
			Find(&checkIns)

		// 计算连续签到
		currentStreak := 0
		checkInMap := make(map[string]bool)
		for _, ci := range checkIns {
			checkInMap[ci.CheckInDate.Format("2006-01-02")] = true
		}

		for i := 0; i < 30; i++ {
			date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
			if checkInMap[date] {
				currentStreak++
			} else if i > 0 {
				break
			}
		}

		// 获取总积分
		var totalScore int64
		db.Model(&models.CheckIn{}).Where("user_id = ?", userID).Select("COALESCE(SUM(score_earned + bonus_score), 0)").Scan(&totalScore)

		utils.Success(c, "获取成功", gin.H{
			"total_days":      user.TotalCheckIn,
			"current_streak": currentStreak,
			"total_score":    user.Score,
			"recent_check_ins": checkIns,
		})
	}
}

// GetFavorites 获取收藏列表
func GetFavorites(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)

		var favorites []models.Favorite
		if err := db.Where("user_id = ?", userID).Order("created_at DESC").Find(&favorites).Error; err != nil {
			utils.Error(c, "获取失败")
			return
		}

		utils.Success(c, "获取成功", favorites)
	}
}

// AddFavorite 添加收藏
func AddFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)

		var req struct {
			SpotName string  `json:"spot_name" binding:"required"`
			Lng      float64 `json:"lng" binding:"required"`
			Lat      float64 `json:"lat" binding:"required"`
			Note     string  `json:"note"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			utils.Error(c, "参数错误")
			return
		}

		favorite := models.Favorite{
			UserID:   userID,
			SpotName: req.SpotName,
			Lng:      req.Lng,
			Lat:      req.Lat,
			Note:     req.Note,
		}

		if err := db.Create(&favorite).Error; err != nil {
			utils.Error(c, "添加失败")
			return
		}

		// 收藏成功 +2 积分
		db.Model(&models.User{}).Where("id = ?", userID).Update("score", gorm.Expr("score + 2"))

		utils.Success(c, "添加成功", favorite)
	}
}

// DeleteFavorite 删除收藏
func DeleteFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		favoriteID := c.Param("id")

		var favorite models.Favorite
		if err := db.Where("id = ? AND user_id = ?", favoriteID, userID).First(&favorite).Error; err != nil {
			utils.Error(c, "收藏不存在")
			return
		}

		if err := db.Delete(&favorite).Error; err != nil {
			utils.Error(c, "删除失败")
			return
		}

		utils.Success(c, "删除成功", nil)
	}
}
