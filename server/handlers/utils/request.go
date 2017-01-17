package utils

import (
	"encoding/json"
	"fmt"
	"github.com/emc-advanced-dev/pkg/errors"
)

func ParseRequest(msg string, returnObject interface{}) error {
	if err := json.Unmarshal([]byte(msg), returnObject); err != nil {
		return errors.New(msg+" did not unmarshal to "+fmt.Sprintf("%v", returnObject), err)
	}
	return nil
}
