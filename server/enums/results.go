package enums

type Result int

type results struct {
	SUCCESS Result
	FAILURE Result
}

var RESULTS = results{
	SUCCESS: 0,
	FAILURE: 1,
}
