package models

type Item struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"descritpion"`
	Stock       uint   `json:"stock"`
}
