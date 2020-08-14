package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os/exec"
	"strings"
	"sync"
	"time"

	"code.sajari.com/docconv"
	"github.com/gorilla/mux"
	"github.com/jdkato/prose"
	"github.com/rs/cors"
)

// https://golang.org/pkg/mime/multipart/
type FileHeader struct {
	Filename string
	Header   textproto.MIMEHeader
	Size     int64 // Go 1.9
	// contains filtered or unexported fields
}

// http://sanatgersappa.blogspot.com/2013/03/handling-multiple-file-uploads-in-go.html
func evaluateFile(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	fmt.Println("Endpoint hit: homePage")
	err := r.ParseMultipartForm(32 * 1 << 20) // 32 MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	dataToProcess := evaluatedData{make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int, 5)}
	//get a ref to the parsed multipart form
	m := r.MultipartForm
	files := m.File["file"]
	var buf bytes.Buffer
	ch := make(chan evaluatedData, 5) // max of 5 goroutines
	wg := sync.WaitGroup{}
	for i := range files {
		//for each fileheader, get a handle to the actual file
		file, err := files[i].Open()
		defer file.Close()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		name := strings.Split(files[i].Filename, ".")
		dataToProcess.Filenames[files[i].Filename] = i
		wg.Add(1)
		go func(*multipart.FileHeader, []string) {
			defer wg.Done()
			if name[1] == "docx" {
				res, _, err := docconv.ConvertDocx(file)
				if err != nil {
					log.Fatal(err)
				}
				ch <- applyProse(res)
			} else if name[1] == "doc" {
				res, _, err := docconv.ConvertDoc(file)
				if err != nil {
					log.Fatal(err)
				}
				ch <- applyProse(res)
			} else if name[1] == "txt" {
				io.Copy(&buf, file)
				contents := buf.String()
				ch <- applyProse(contents)
				buf.Reset()
			} else if name[1] == "pdf" {
				res, _, err := docconv.ConvertPDF(file)
				if err != nil {
					log.Fatal(err)
				}
				ch <- applyProse(res)
			} else {
				fmt.Printf("invalid file type: %s", name[1])
			}
		}(files[i], name)
	}
	wg.Wait()
	close(ch)
	for f := range ch {
		dataToProcess.merge(f)
	}

	//https://www.golangprograms.com/golang-writing-struct-to-json-file.html
	// write result out to file
	file, _ := json.MarshalIndent(dataToProcess, "", " ")
	_ = ioutil.WriteFile("data.json", file, 0644)

	// read result in python and sort the map write to another file
	// https://stackoverflow.com/questions/41415337/running-external-python-in-golang-catching-continuous-exec-command-stdout
	cmd := exec.Command("python", "script.py")
	output, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(output))

	// read result from file
	// https://www.golangprograms.com/golang-read-json-file-into-struct.html
	result, _ := ioutil.ReadFile("result.json")
	// send to client
	fmt.Println()
	w.Write(result)
	end := time.Now()
	dur := end.Sub(start)
	fmt.Println(dur)
	return
}

func (orig evaluatedData) merge(ed evaluatedData) {
	mergeMaps(orig.Adjectives, ed.Adjectives)
	mergeMaps(orig.Adverbs, ed.Adverbs)
	mergeMaps(orig.Merged, ed.Merged)
	mergeMaps(orig.Nouns, ed.Nouns)
	mergeMaps(orig.Verbs, ed.Verbs)
}

type evaluatedData struct {
	Nouns      map[string]int `json:"nouns"`      //NN, NNP, NNS, POS, PRP, PRP$
	Adjectives map[string]int `json:"adjectives"` //JJ, JJR, JJS
	Verbs      map[string]int `json:"verbs"`      // MD, VB, VBD, VBG, VBN, VBP, VBZ
	Adverbs    map[string]int `json:"adverbs"`    //RB, RBR, RBS, RP
	Merged     map[string]int `json:"merged"`
	Filenames  map[string]int `json:"filenames`
}

func applyProse(text string) evaluatedData {
	doc, err := prose.NewDocument(text)
	if err != nil {
		log.Fatal(err)
	}
	data := evaluatedData{make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int), make(map[string]int)}
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
