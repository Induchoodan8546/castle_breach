package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Hub struct {
	mu      sync.RWMutex
	clients map[*websocket.Conn]struct{}
}

var leaderboardHub = &Hub{
	clients: make(map[*websocket.Conn]struct{}),
}

func (h *Hub) add(conn *websocket.Conn) {
	h.mu.Lock()
	h.clients[conn] = struct{}{}
	h.mu.Unlock()
}

func (h *Hub) remove(conn *websocket.Conn) {
	h.mu.Lock()
	delete(h.clients, conn)
	h.mu.Unlock()
	conn.Close()
}

func (h *Hub) broadcast(data interface{}) {
	msg, err := json.Marshal(data)
	if err != nil {
		log.Printf("broadcast marshal error: %v", err)
		return
	}
	h.mu.RLock()
	defer h.mu.RUnlock()
	for conn := range h.clients {
		if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Printf("ws write error: %v", err)
		}
	}
}

func BroadcastLeaderboard() {
	entries, err := GetLeaderboard()
	if err != nil {
		log.Printf("leaderboard fetch error: %v", err)
		return
	}
	leaderboardHub.broadcast(entries)
}

func HandleLeaderboardWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade error: %v", err)
		return
	}
	leaderboardHub.add(conn)
	defer leaderboardHub.remove(conn)

	if entries, err := GetLeaderboard(); err == nil {
		msg, _ := json.Marshal(entries)
		conn.WriteMessage(websocket.TextMessage, msg)
	}

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
}
