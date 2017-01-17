package enums

type Result int

type results struct {
	SUCCESS Result
	ERROR   Result
}

var Results = results{
	SUCCESS: 0,
	ERROR:   1,
}
