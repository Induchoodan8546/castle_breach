# castle_breach
a story-driven Capture-the-Flag (CTF) competition game designed to transform a traditional cybersecurity challenge into an interactive adventure experience.

# Rescue the Princess — Gamified Capture-the-Flag Adventure
Instead of solving isolated questions, participants explore a mysterious castle, discover hidden clues, solve encoded puzzles, and capture flags while racing against time to rescue an imprisoned princess.

The game blends storytelling, exploration, and problem-solving to create an engaging competition experience for tech events and learning environments.

# 🎮 Game Concept

Participants take the role of a hero entering a dangerous castle where the princess has been imprisoned.

To rescue her, players must:

Explore different areas of the castle

Inspect objects for hidden clues

Decode encrypted messages

Solve puzzles to capture flags

Progress through checkpoints

Reach the final tower before the timer expires

Each solved puzzle unlocks the next part of the castle.

# 🧭 Game Progression

The adventure is divided into four checkpoints, each increasing in difficulty.

Start Mission
   ↓
Castle Gate
   ↓
Hall of Paths
   ↓
Monster Chamber
   ↓
Final Tower
   ↓
Princess Rescued

Players must complete each checkpoint to advance to the next stage.

# 🏰 Checkpoints
1️⃣ Castle Gate (Easy)

Players arrive at the entrance of the castle.

The gate is locked with an ancient magical code hidden within clues scattered around the scene.

Participants must decode the message to reveal the first flag.

Example puzzle:

ZmxhZ3tnYXRlX29wZW59

Correct flag:

flag{gate_open}

Once solved, the castle gate opens and players enter the castle.

2️⃣ Hall of Paths (Medium)

Inside the castle, the hall splits into three mysterious hallways.

Each hallway has a coded message written above its entrance.

Players must decode the messages and determine which hallway leads deeper into the castle.

Example inscriptions:

Hallway A
QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD

Hallway B
KHOOR SULQFHVV

Hallway C
SGVsbG8gS2luZ2RvbQ==

Correct path:

Hallway B

Flag obtained:

flag{correct_path}

Choosing the wrong hallway triggers a trap and sends the player back to try again.

3️⃣ Monster Chamber (Hard)

A monster guards the path leading to the inner tower.

Players must break the magical protection spell by solving a cryptographic puzzle.

Example challenge:

5f4dcc3b5aa765d61d8327deb882cf99

Solution:

password

Flag:

flag{monster_defeated}

Once the monster is defeated, the path to the final tower opens.

4️⃣ Final Tower (Very Hard)

The final tower holds the imprisoned princess.

To unlock the prison cell, players must solve five advanced challenges.

These challenges may involve:

hidden information inside files

encoded messages

logic puzzles

layered decoding challenges

Each solved challenge unlocks one part of the prison cell.

When all five locks are opened, the princess is rescued.

Final flag:

flag{princess_rescued}
# ⏱ Competition Rules

Each team has a 30-minute time limit to complete the game.

Performance is evaluated based on:

Number of flags captured

Total time taken

Example leaderboard:

Rank	Team	Flags	Time
1	Team Alpha	4/4	12:30
2	Team Bravo	4/4	15:20
3	Team Charlie	3/4	Timeout

If multiple teams capture the same number of flags, the shortest completion time wins.

# 🎯 Purpose of the Project

Castle Breach was designed to create a more engaging alternative to traditional CTF competitions.

Instead of answering standalone questions, participants experience:

a story-driven adventure

interactive puzzle solving

exploration-based challenges

a competitive race against time

The goal is to make cybersecurity challenges fun, immersive, and memorable.

# 👤 Author

# Induchoodan

