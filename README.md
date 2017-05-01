# Minesweeper
The good old Minesweeper game implemented with Front-end web technologies

## Specification:

### Rules:
- Player wins when all fields except those containing a bomb are opened.
- Player loses when a bomb field is opened.
- Mines are marked with right click
- When empty field is revealed, every bound neighbor empty fields should open consequently.
- Random (with seeding) bomb arrangement.

### Features:
- Display time score
- Display number of available marks.
  - Decrement number of available marks on field mark.

- Choose from predefined game difficulty or custom grid size
  - Easy: 9 x 9
  - Medium: 16 x 16
  - Expert: 30 x 16
  - Custom Difficulty
    - Maximum rows: 24
    - Minimum rows: 9
    - Maximum columns: 30
    - Minimum columns: 9
    - Maximum bombs: Round ((rows * columns) * 0.6)
    - Minimum bombs: 10
- Replayable games Feature
	- When creating a game user can choose a specific bomb arrangement which can be played multiple times based upon some key (string)

- Hints Feature. A hint opens a field which doesn't contain a bomb
  - 3 Hints available

- Lives Feature.
  - 3 Lives available
- Players can play as guest or as registered users.
- Scoreboard for registered players. (for predefined game difficulty only)
  - Scores are sorted by Difficulty then by time.

### Technologies, tools and services using in development:
  - HTML, CSS, JS (ES6)
  - Git VCS
  - Bootstrap 4
  - Browserify
  - Gulp
  - Bower
  - Firebase (TODO)
  - Mocha + Chai (BDD attempt)
