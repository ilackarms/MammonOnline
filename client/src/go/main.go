package main

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/client/src/go/mammonclient"
)

func main() {
	js.Global.Set("Mammon", map[string]interface{}{
		"New": mammonclient.New,
	})
}
