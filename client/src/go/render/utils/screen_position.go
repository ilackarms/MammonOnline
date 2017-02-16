package utils

func GetScreenPosition(x, y, tilewidth, tileheight int) (int, int) {
	screenX := (x - y) * tilewidth / 2
	screenY := (x + y) * tileheight / 2
	return screenX, screenY
}
