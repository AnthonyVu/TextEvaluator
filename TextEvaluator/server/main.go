package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func evaluateFile(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome")
	fmt.Println("Endpoint hit: homePage")
}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", evaluateFile)
	log.Fatal(http.ListenAndServe(":1234", myRouter))
}

func main() {
	handleRequests()
}
