package render

func ToScreenCoordinates(x, y int) (int, int) {
	if Tilewidth == 0 || Tileheight == 0 {
		panic("tilewidth or tileheight not set yet!")
	}
	screenX := (x - y) * Tilewidth / 2
	screenY := (x + y) * Tileheight / 2
	return screenX + OffsetX, screenY
}

func ToGameCoordinates(screenX, screenY int) (int, int) {
	if Tilewidth == 0 || Tileheight == 0 {
		panic("tilewidth or tileheight not set yet!")
	}
	//adjust for offset
	screenX -= OffsetX
	//for some reason our draw algorithm shifts tiles 1/2 to the right
	screenX -= Tilewidth / 2
	x := int(float64(screenX)/float64(Tilewidth) + float64(screenY)/float64(Tileheight))
	y := int(float64(screenY)/float64(Tileheight) - float64(screenX)/float64(Tilewidth))
	return x, y
}
