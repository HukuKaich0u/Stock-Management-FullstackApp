package models

import "gorm.io/gorm"

type Item struct {
	gorm.Model
	ItemName string `json:"itemname"`
	StockNum uint   `json:"stocknum"`
	Restock  bool   `json:"restock"`
}

type InputItem struct {
	ItemName string `json:"itemname" binding:"required"`
	Kind     string `json:"kind" binding:"required"`
	StockNum uint   `json:"stocknum" binding:"required"`
	Restock  bool   `json:"restock" binding:"required"`
}
