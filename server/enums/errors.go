package enums

type ErrorCode int

type errorCodes struct {
	NIL             ErrorCode
	INVALID_REQUEST ErrorCode
	INVALID_LOGIN   ErrorCode
	INTERNAL_ERROR  ErrorCode
}

var ERROR_CODES errorCodes = errorCodes{
	NIL:             0,
	INVALID_REQUEST: 1,
	INVALID_LOGIN:   2,
	INTERNAL_ERROR:  3,
}
