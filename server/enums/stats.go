package enums

type Stat int

type stats struct {
	STRENGTH     Stat
	DEXTERITY    Stat
	INTELLIGENCE Stat
}

var STATS stats = stats{
	STRENGTH:     0,
	DEXTERITY:    1,
	INTELLIGENCE: 2,
}
