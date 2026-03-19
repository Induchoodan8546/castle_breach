package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
)

func respondJSON(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, code int, msg string) {
	respondJSON(w, code, map[string]string{"error": msg})
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" {
		respondError(w, http.StatusBadRequest, "name is required")
		return
	}

	team, err := CreateTeam(body.Name)
	if err != nil {
		respondError(w, http.StatusConflict, "team name already taken")
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"token": team.Token,
	})
}

func HandleSubmit(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Token     string `json:"token"`
		TimeTaken int    `json:"time_taken"`
		Flag      string `json:"flag"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if body.Token == "" || body.Flag == "" || body.TimeTaken <= 0 {
		respondError(w, http.StatusBadRequest, "token, flag, and time_taken (>0) are required")
		return
	}

	team, err := GetTeamByToken(body.Token)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			respondError(w, http.StatusUnauthorized, "invalid token")
		} else {
			respondError(w, http.StatusInternalServerError, "server error")
		}
		return
	}

	if err := SubmitFlag(team.ID, body.Flag, body.TimeTaken); err != nil {
		respondError(w, http.StatusConflict, "flag already submitted by this team")
		return
	}

	go BroadcastLeaderboard()

	respondJSON(w, http.StatusOK, map[string]string{
		"message": "flag submitted successfully",
	})
}

func HandleLeaderboard(w http.ResponseWriter, r *http.Request) {
	entries, err := GetLeaderboard()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to fetch leaderboard")
		return
	}
	respondJSON(w, http.StatusOK, entries)
}
