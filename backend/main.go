package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using environment variables")
	}

	if err := ConnectDatabase(); err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	r := mux.NewRouter()

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	r.HandleFunc("/register", HandleRegister).Methods("POST", "OPTIONS")
	r.HandleFunc("/submit", HandleSubmit).Methods("POST", "OPTIONS")
	r.HandleFunc("/leaderboard", HandleLeaderboard).Methods("GET")
	r.HandleFunc("/ws/leaderboard", HandleLeaderboardWS)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("CTF backend running on http://localhost:%s\n", port)
	fmt.Println("Routes:")
	fmt.Println("  POST /register        — register team, get token")
	fmt.Println("  POST /submit          — submit a flag")
	fmt.Println("  GET  /leaderboard     — fetch leaderboard")
	fmt.Println("  WS   /ws/leaderboard  — live leaderboard updates")

	log.Fatal(http.ListenAndServe(":"+port, r))
}
