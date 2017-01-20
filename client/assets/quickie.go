package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Atlas struct {
	Image string `json:"image"`
	Data  string `json:"data"`
}

type Assets struct {
	Images  map[string]string `json:"images"`
	Datas   map[string]string `json:"datas"`
	Audios  map[string]string `json:"audios"`
	Atlases map[string]Atlas  `json:"atlases"`
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}

// Define a type named "intslice" as a slice of ints
type strslice []string

// Now, for our new type, implement the two methods of
// the flag.Value interface...
// The first method is String() string
func (s *strslice) String() string {
	return fmt.Sprintf("%s", *s)
}

// The second method is Set(value string) error
func (i *strslice) Set(value string) error {
	*i = append(*i, value)
	return nil
}

var ignores strslice

func main() {
	root := flag.String("p", ".", "path to search recursively")
	flag.Var(&ignores, "i", "ignore paths with this substring")
	flag.Parse()
	writeFile(findAssets(*root))
}

func findAssets(root string) Assets {
	assets := Assets{
		Images:  make(map[string]string),
		Datas:   make(map[string]string),
		Audios:  make(map[string]string),
		Atlases: make(map[string]Atlas),
	}
	must(filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		must(err)
		for _, ignore := range ignores {
			if strings.Contains(path, ignore) {
				return nil
			}
		}
		extension := filepath.Ext(path)
		key := strings.TrimSuffix(info.Name(), extension)
		switch extension {
		case ".bmp", ".png", ".jpg":
			if dataPath, ok := assets.Datas[key]; ok {
				delete(assets.Datas, key)
				assets.Atlases[key] = Atlas{
					Image: path,
					Data:  dataPath,
				}
			} else {
				assets.Images[key] = path
			}
			break
		case ".json":
			if imagePath, ok := assets.Images[key]; ok {
				delete(assets.Images, key)
				assets.Atlases[key] = Atlas{
					Image: imagePath,
					Data:  path,
				}
			} else {
				assets.Datas[key] = path
			}
			break
		case ".ogg", ".wav", ".mp3", ".mp4", ".flac":
			assets.Audios[key] = path
			break
		}
		return nil
	}))
	return assets
}

func writeFile(assets Assets) {
	data, err := json.Marshal(assets)
	must(err)
	fmt.Printf("%s", data)
}
