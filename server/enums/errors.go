package enums

type ErrorCode int

type errorCodes struct {
	INVALID_REQUEST ErrorCode
	INVALID_LOGIN   ErrorCode
}

var ERROR_CODES errorCodes = errorCodes{
	INVALID_REQUEST: 0,
	INVALID_LOGIN:   1,
}
