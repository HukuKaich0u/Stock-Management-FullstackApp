package models

import "gorm.io/gorm"

type Item struct {
	gorm.Model
	ItemName string `json:"itemname"`
	Kind     string `json:"kind"`
	StockNum uint   `json:"stocknum"`
	IsNeeded bool   `json:"isneeded"`
}

type InputItem struct {
	ItemName string `json:"itemname" binding:"required"`
	Kind     string `json:"kind" binding:"required"`
	StockNum uint   `json:"stocknum" binding:"required"`
	IsNeeded bool   `json:"isneeded" binding:"required"`
}
