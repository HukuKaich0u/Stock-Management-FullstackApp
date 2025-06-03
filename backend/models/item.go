package models

import "gorm.io/gorm"

type Item struct {
	gorm.Model
	ItemName string `json:"itemname"`
	ItemKind string `json:"itemkind"`
	ItemNum  uint   `json:"itemnum"`
	IsNeeded bool   `json:"isneeded"`
}

type InputItem struct {
	ItemName string `json:"itemname" binding:"required"`
	ItemKind string `json:"itemkind" binding:"required"`
	ItemNum  uint   `json:"itemnum" binding:"required"`
	IsNeeded bool   `json:"isneeded"`
}
