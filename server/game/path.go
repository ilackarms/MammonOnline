package game

type searchPoint struct {
	Position
	Checked bool
}

func findPath(zone *Zone, start, end Position) []Position {
	//zone.Tiles[0][0].Type.Walkable()
	////open := []searchPoint{searchPoint{start, true}}
	//open := []Position{start}
	//closed := []Position{}
	return nil
}

func getAdjacentWalkableTiles(zone *Zone, p Position, closed []Position) []Position {
	adjacentWalkables := []Position{}
	//w, h := zone.Size()
	//for x := p.X - 1; x <= p.X+1; x++ {
	//	for y := p.Y - 1; y <= p.Y+1; y++ {
	//		//oob
	//		if x < 0 || x >= w || y < 0 || y >= h {
	//			continue
	//		}
	//		//skip the point itself
	//		if x == p.X && y == p.Y {
	//			continue
	//		}
	//		if zone.Tiles[x][y].Type.Walkable() {
	//			newP := Position{
	//				X: x,
	//				Y: y,
	//			}
	//
	//			adjacentWalkables = append(adjacentWalkables)
	//		}
	//	}
	//}
	return adjacentWalkables
}
