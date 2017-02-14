package gameclient_test

import (
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Mammon", func() {
	It("Works", func() {
		Expect(mammonclient.New2(rawJSON)).NotTo(BeNil())
	})
})

var rawJSON = `
{
  "objects": {
    "bb740c49-8e93-4d5a-85b3-75e6afc275bb": {
      "uid": "bb740c49-8e93-4d5a-85b3-75e6afc275bb",
      "type": 0,
      "position": {
        "x": 10,
        "y": 10
      },
      "zone_name": "world",
      "action": 0,
      "attributes": {
        "str": 35,
        "dex": 35,
        "int": 35
      },
      "skills": {
        "10": 33,
        "16": 33,
        "3": 34
      },
      "class": 1,
      "portrait": "Sorc1",
      "name": "fafafafa",
      "logged_in": true
    }
  },
  "zones": {
    "world": {
      "name": "world",
      "tiles": [
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 1,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {
              "bb740c49-8e93-4d5a-85b3-75e6afc275bb": {
                "uid": "bb740c49-8e93-4d5a-85b3-75e6afc275bb",
                "type": 0,
                "position": {
                  "x": 10,
                  "y": 10
                },
                "zone_name": "world",
                "action": 0,
                "attributes": {
                  "str": 35,
                  "dex": 35,
                  "int": 35
                },
                "skills": {
                  "10": 33,
                  "16": 33,
                  "3": 34
                },
                "class": 1,
                "portrait": "Sorc1",
                "name": "fafafafa",
                "logged_in": true
              }
            }
          },
          {
            "type": 2,
            "objects": {}
          }
        ],
        [
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          }
        ],
        [
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ],
        [
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 2,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          },
          {
            "type": 3,
            "objects": {}
          }
        ]
      ]
    }
  }
}

`
