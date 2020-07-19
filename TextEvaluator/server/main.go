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
	} else if name[1] == "html" {
		res, _, err := docconv.ConvertHTML(file, false)
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
}

func applyProse(text string) evaluatedData {
	doc, err := prose.NewDocument(text)
	if err != nil {
		log.Fatal(err)
	}
	data := evaluatedData{make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int)}
	// Iterate over the doc's tokens:
	for _, tok := range doc.Tokens() {
		if tok.Tag == "NN" || tok.Tag == "NNP" || tok.Tag == "NNS" || tok.Tag == "POS" || tok.Tag == "PRP" || tok.Tag == "PRP$" {
			if _, ok := data.Nouns[tok.Text]; ok {
				data.Nouns[tok.Text]++
			} else {
				data.Nouns[tok.Text] = 1
			}
		} else if tok.Tag == "JJ" || tok.Tag == "JJR" || tok.Tag == "JJS" {
			if _, ok := data.Adjectives[tok.Text]; ok {
				data.Adjectives[tok.Text]++
			} else {
				data.Adjectives[tok.Text] = 1
			}
		} else if tok.Tag == "MD" || tok.Tag == "VB" || tok.Tag == "VBD" || tok.Tag == "VBG" || tok.Tag == "VBN" || tok.Tag == "VBP" || tok.Tag == "VBZ" {
			if _, ok := data.Verbs[tok.Text]; ok {
				data.Verbs[tok.Text]++
			} else {
				data.Verbs[tok.Text] = 1
			}
		} else if tok.Tag == "RB" || tok.Tag == "RBR" || tok.Tag == "RBS" || tok.Tag == "RP" {
			if _, ok := data.Adverbs[tok.Text]; ok {
				data.Adverbs[tok.Text]++
			} else {
				data.Adverbs[tok.Text] = 1
			}
		} else {
			continue
		}
	}
	return data
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
