package models

import (
	"time"
)

// User 用户
type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Username     string    `json:"username" gorm:"uniqueIndex;size:50;not null"`
	Password     string    `json:"-" gorm:"not null"`
	Nickname     string    `json:"nickname" gorm:"size:50"`
	Avatar       string    `json:"avatar" gorm:"size:255"`
	Phone        string    `json:"phone" gorm:"size:20"`
	Score        int       `json:"score" gorm:"default:0"`
	TotalCheckIn int       `json:"total_check_in" gorm:"default:0"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CheckIn 签到记录
type CheckIn struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	UserID       uint      `json:"user_id" gorm:"index;not null"`
	CheckInDate  time.Time `json:"check_in_date" gorm:"type:date;not null"`
	ScoreEarned  int       `json:"score_earned" gorm:"default:5"`
	BonusScore   int       `json:"bonus_score" gorm:"default:0"`
	CreatedAt    time.Time `json:"created_at"`
}

// Favorite 收藏钓点
type Favorite struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"index;not null"`
	SpotName  string    `json:"spot_name" gorm:"size:100;not null"`
	Lng       float64   `json:"lng" gorm:"type:decimal(10,6)"`
	Lat       float64   `json:"lat" gorm:"type:decimal(10,6)"`
	Note      string    `json:"note" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at"`
}

// CheckInStats 签到统计
type CheckInStats struct {
	TotalDays     int `json:"total_days"`
	CurrentStreak int `json:"current_streak"`
	LongestStreak int `json:"longest_streak"`
	TotalScore    int `json:"total_score"`
}
