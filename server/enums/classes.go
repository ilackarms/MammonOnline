package enums

type Class int

type classes struct {
	ROGUE    Class
	SORCERER Class
	WARRIOR  Class
}

var Classes classes = classes{
	ROGUE:    0,
	SORCERER: 1,
	WARRIOR:  2,
}
