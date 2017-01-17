package enums

type Class int

type classes struct {
	ROGUE    Class
	SORCERER Class
	WARRIOR  Class
}

var CLASSES classes = classes{
	ROGUE:    0,
	SORCERER: 1,
	WARRIOR:  2,
}
