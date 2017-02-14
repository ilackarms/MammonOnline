package gameclient_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"testing"
)

func TestMammonclient(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Mammonclient Suite")
}
