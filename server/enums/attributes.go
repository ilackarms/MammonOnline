package enums

type Attribute int

type attributes struct {
	STRENGTH     Attribute
	DEXTERITY    Attribute
	INTELLIGENCE Attribute
}

var ATTRIBUTES = attributes{
	STRENGTH:     0,
	DEXTERITY:    1,
	INTELLIGENCE: 2,
}
