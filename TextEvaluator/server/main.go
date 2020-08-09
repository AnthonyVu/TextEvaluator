package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"code.sajari.com/docconv"
	"github.com/gorilla/mux"
	"github.com/jdkato/prose"
	"github.com/rs/cors"
)

//https://stackoverflow.com/questions/40684307/how-can-i-receive-an-uploaded-file-using-a-golang-net-http-server
func evaluateFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint hit: homePage")
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	var buf bytes.Buffer
	file, header, err := r.FormFile("file")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	name := strings.Split(header.Filename, ".")
	fmt.Printf("File name: %s\n", name[0])
	fmt.Println(name[1])
	if name[1] == "docx" {
		res, _, err := docconv.ConvertDocx(file)
		if err != nil {
			log.Fatal(err)
		}
		data, _ := json.Marshal(applyProse(res))
		w.Write(data)
	} else if name[1] == "doc" {
		res, _, err := docconv.ConvertDoc(file)
		if err != nil {
			log.Fatal(err)
		}
		data, _ := json.Marshal(applyProse(res))
		w.Write(data)
	} else if name[1] == "txt" {
		io.Copy(&buf, file)
		contents := buf.String()
		data, _ := json.Marshal(applyProse(contents))
		w.Write(data)
		buf.Reset()
	} else if name[1] == "pdf" {
		res, _, err := docconv.ConvertPDF(file)
		if err != nil {
			log.Fatal(err)
		}
		data, _ := json.Marshal(applyProse(res))
		w.Write(data)
	} else {
		fmt.Printf("invalid file type: %s", name[1])
	}
	return
}

type evaluatedData struct {
	Nouns      map[string]int `json:"nouns"`      //NN, NNP, NNS, POS, PRP, PRP$
	Adjectives map[string]int `json:"adjectives"` //JJ, JJR, JJS
	Verbs      map[string]int `json:"verbs"`      // MD, VB, VBD, VBG, VBN, VBP, VBZ
	Adverbs    map[string]int `json:"adverbs"`    //RB, RBR, RBS, RP
	Merged     map[string]int `json:"merged"`
}

func applyProse(text string) evaluatedData {
	doc, err := prose.NewDocument(text)
	if err != nil {
		log.Fatal(err)
	}
	data := evaluatedData{make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int)}
	// https://stackoverflow.com/questions/31961882/how-to-check-if-there-is-a-special-character-in-string-or-if-a-character-is-a-sp
	f := func(r rune) bool {
		return r < 'A' || r > 'z'
	}
	// Iterate over the doc's tokens:
	for _, tok := range doc.Tokens() {
		text := strings.ToLower(tok.Text)
		tag := tok.Tag
		if len(text) > 1 && strings.IndexFunc(text, f) == -1 {
			if tag == "NN" || tag == "NNS" || tag == "PRP" || tag == "PRP$" {
				if _, ok := data.Nouns[text]; ok {
					data.Nouns[text]++
				} else {
					data.Nouns[text] = 1
				}
			} else if tag == "JJ" || tag == "JJR" || tag == "JJS" {
				if _, ok := data.Adjectives[text]; ok {
					data.Adjectives[text]++
				} else {
					data.Adjectives[text] = 1
				}
			} else if tag == "VB" || tag == "VBD" || tag == "VBG" || tag == "VBN" || tag == "VBP" {
				if _, ok := data.Verbs[text]; ok {
					data.Verbs[text]++
				} else {
					data.Verbs[text] = 1
				}
			} else if tag == "RB" || tag == "RBR" || tag == "RBS" || tag == "RP" {
				if _, ok := data.Adverbs[text]; ok {
					data.Adverbs[text]++
				} else {
					data.Adverbs[text] = 1
				}
			}
		}
	}
	mergeMaps(data.Merged, data.Nouns)
	mergeMaps(data.Merged, data.Verbs)
	mergeMaps(data.Merged, data.Adjectives)
	mergeMaps(data.Merged, data.Adverbs)
	return data
}

func mergeMaps(first map[string]int, second map[string]int) {
	for k, v := range second {
		if _, ok := first[k]; ok {
			first[k] += v
		} else {
			first[k] = v
		}
	}
}

func handleRequests() {
	fmt.Println("server connected successfully")
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", evaluateFile).Methods("POST")
	handler := cors.Default().Handler(myRouter)
	log.Fatal(http.ListenAndServe(":1234", handler))
}

func main() {
	handleRequests()
}
