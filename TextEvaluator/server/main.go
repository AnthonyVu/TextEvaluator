package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"code.sajari.com/docconv"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

//https://stackoverflow.com/questions/40684307/how-can-i-receive-an-uploaded-file-using-a-golang-net-http-server
func evaluateFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint hit: homePage")
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	var buf bytes.Buffer
	// in your case file would be fileupload
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
		fmt.Println(res)

	} else if name[1] == "doc" {
		res, _, err := docconv.ConvertDoc(file)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(res)
	} else if name[1] == "txt" {
		io.Copy(&buf, file)
		contents := buf.String()
		fmt.Println(contents)
		buf.Reset()
	} else if name[1] == "pdf" {
		res, _, err := docconv.ConvertPDF(file)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(res)
	} else if name[1] == "html" {
		res, _, err := docconv.ConvertHTML(file, false)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(res)
	} else {
		fmt.Printf("invalid file type: %s", name[1])
	}
	return
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
