package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"os"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

type Team struct {
	ID       int64  `json:"id"`
	TeamName string `json:"team_name"`
	Token    string `json:"token,omitempty"`
}

type FlagCapture struct {
	FlagName  string `json:"flag_name"`
	TimeTaken int    `json:"time_taken"`
}

type LeaderboardEntry struct {
	Rank          int           `json:"rank"`
	TeamName      string        `json:"team_name"`
	FlagsCaptured int           `json:"flags_captured"`
	TotalTime     int           `json:"total_time_seconds"`
	Flags         []FlagCapture `json:"flags"`
}

func ConnectDatabase() error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./ctf.db"
	}

	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return err
	}

	if err = DB.Ping(); err != nil {
		return err
	}

	return createTables()
}

func createTables() error {
	_, err := DB.Exec(`
		CREATE TABLE IF NOT EXISTS teams (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			team_name  TEXT NOT NULL UNIQUE,
			token      TEXT NOT NULL UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("create teams table: %w", err)
	}

	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS flag_submissions (
			id           INTEGER PRIMARY KEY AUTOINCREMENT,
			team_id      INTEGER NOT NULL,
			flag_name    TEXT NOT NULL,
			time_taken   INTEGER NOT NULL,
			submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (team_id) REFERENCES teams(id),
			UNIQUE(team_id, flag_name)
		)
	`)
	if err != nil {
		return fmt.Errorf("create flag_submissions table: %w", err)
	}

	return nil
}

func generateToken() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func CreateTeam(name string) (*Team, error) {
	token, err := generateToken()
	if err != nil {
		return nil, err
	}

	res, err := DB.Exec(`INSERT INTO teams (team_name, token) VALUES (?, ?)`, name, token)
	if err != nil {
		return nil, err
	}

	id, _ := res.LastInsertId()
	return &Team{ID: id, TeamName: name, Token: token}, nil
}

func GetTeamByToken(token string) (*Team, error) {
	row := DB.QueryRow(`SELECT id, team_name, token FROM teams WHERE token = ?`, token)
	var t Team
	if err := row.Scan(&t.ID, &t.TeamName, &t.Token); err != nil {
		return nil, err
	}
	return &t, nil
}

func SubmitFlag(teamID int64, flagName string, timeTaken int) error {
	_, err := DB.Exec(
		`INSERT INTO flag_submissions (team_id, flag_name, time_taken) VALUES (?, ?, ?)`,
		teamID, flagName, timeTaken,
	)
	return err
}

func GetLeaderboard() ([]LeaderboardEntry, error) {
	rows, err := DB.Query(`
		SELECT t.id,
		       t.team_name,
		       COUNT(f.id)                 AS flags_captured,
		       COALESCE(SUM(f.time_taken), 0) AS total_time
		FROM   teams t
		LEFT JOIN flag_submissions f ON f.team_id = t.id
		GROUP BY t.id
		ORDER BY flags_captured DESC, total_time ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []LeaderboardEntry
	rank := 1
	for rows.Next() {
		var e LeaderboardEntry
		var teamID int64
		if err := rows.Scan(&teamID, &e.TeamName, &e.FlagsCaptured, &e.TotalTime); err != nil {
			return nil, err
		}
		e.Rank = rank
		rank++

		flagRows, err := DB.Query(`
			SELECT flag_name, time_taken FROM flag_submissions
			WHERE team_id = ?
			ORDER BY submitted_at
		`, teamID)
		if err == nil {
			for flagRows.Next() {
				var fc FlagCapture
				if err := flagRows.Scan(&fc.FlagName, &fc.TimeTaken); err == nil {
					e.Flags = append(e.Flags, fc)
				}
			}
			flagRows.Close()
		}

		entries = append(entries, e)
	}
	return entries, nil
}
