package models

import "gorm.io/gorm"

type Item struct {
	gorm.Model
	Name     string `json:"name"`
	StockNum uint   `json:"stocknum"`
	Restock  bool   `json:"restock"`
}

type InputItem struct {
	Name     string `json:"name"`
	StockNum uint   `json:"stocknum" binding:"required"`
	Restock  bool   `json:"restock"`
}
