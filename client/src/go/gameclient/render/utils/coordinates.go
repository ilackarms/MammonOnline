package utils

func ToScreenCoordinates(x, y, tilewidth, tileheight int) (int, int) {
	screenX := (x - y) * tilewidth / 2
	screenY := (x + y) * tileheight / 2
	return screenX, screenY
}

func ToGameCoordinates(screenX, screenY, tilewidth, tileheight int) (int, int) {
	x := screenX/tilewidth + screenY/tileheight
	y := -1*screenX/tilewidth + screenY/tileheight + 1
	return x, y
}
