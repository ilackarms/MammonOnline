package render

func ToScreenCoordinates(x, y int) (int, int) {
	if Tilewidth == 0 || Tileheight == 0 {
		panic("tilewidth or tileheight not set yet!")
	}
	screenX := (x - y) * Tilewidth / 2
	screenY := (x + y) * Tileheight / 2
	return screenX, screenY
}

func ToGameCoordinates(screenX, screenY int) (int, int) {
	if Tilewidth == 0 || Tileheight == 0 {
		panic("tilewidth or tileheight not set yet!")
	}
	screenX -= OffsetX
	x := screenX/Tilewidth + screenY/Tileheight
	y := -1*screenX/Tilewidth + screenY/Tileheight
	return x, y
}
