package enums

type Stat int

type stats struct {
	STRENGTH     Stat
	DEXTERITY    Stat
	INTELLIGENCE Stat
}

var Stats stats = stats{
	STRENGTH:     0,
	DEXTERITY:    1,
	INTELLIGENCE: 2,
}
