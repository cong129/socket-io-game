const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const knex = require('./data/index');
const FPS = 60;
const PORT = process.env.PORT || 4000;
const allowedOrigin =
  process.env.RENDER_EXTERNAL_HOSTNAME || 'http://localhost:5173';

app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname + '/dist'));
app.get('/history', async (req, res) => {
  const data = await knex.select('*').from('game_result');
  console.log('req coming?');
  res.json(data);
});

class GameState {
  constructor() {
    this.players = [];
    this.positions = [];
    this.colors = [];
  }

  getPlayerIndexByName(name) {
    return this.players.findIndex((n) => n === name);
  }

  addPlayer(name, color) {
    this.players.push(name);
    this.colors.push(color);
    this.positions.push({ x: 50, y: 50 });
  }

  movePlayer(x, y, name) {
    const index = this.getPlayerIndexByName(name);
    if (index >= 0) {
      this.positions[index] = { x: x, y: y };
    }
  }

  removePlayer(name) {
    const index = this.getPlayerIndexByName(name);
    if (index >= 0) {
      this.positions.splice(index, 1);
      this.colors.splice(index, 1);
      this.players.splice(index, 1);
    }
  }
}

const game = new GameState();
let gameFlag = true;
let numOfPlayers = false;
let incomingResultNum = 0;
const gameResult = {
  time: '',
  player0: '',
  player0_area: 0,
  player1: '',
  player1_area: 0,
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
  },
});

io.on('connection', (socket) => {
  let name;
  socket.on('joinGame', (args) => {
    name = args.name;
    game.addPlayer(args.name, args.color);
  });

  socket.on('playerMove', (args) => {
    game.movePlayer(args.x, args.y, name);
  });

  socket.on('sendResult', async (args) => {
    incomingResultNum++;
    gameResult['player0'] = args.player0.player_name;
    gameResult['player0_area'] += args.player0.area;
    gameResult['player1'] = args.player1.player_name;
    gameResult['player1_area'] += args.player1.area;

    if (incomingResultNum === 2) {
      gameFlag = false;
      gameResult.time = new Date();
      const winner =
        gameResult.player0_area > gameResult.player1_area
          ? gameResult.player0
          : gameResult.player1;
      const loser =
        gameResult.player0_area > gameResult.player1_area
          ? gameResult.player1
          : gameResult.player0;
      gameResult['winner'] = winner;
      gameResult['loser'] = loser;
      console.log(gameResult);
      io.emit('Winner', gameResult);
      await knex('game_result').insert(gameResult);
    }
  });

  socket.on('disconnect', () => {
    game.removePlayer(name);
  });
});

let pastState = false;
setInterval(() => {
  numOfPlayers = game.players.length >= 2 ? true : false;
  if (gameFlag) {
    if (!numOfPlayers) {
      io.emit('waitingOpponent', game);
    } else if ((pastState === false) & (numOfPlayers === true)) {
      io.emit('gameStart');
    } else {
      console.log('start!');
      io.emit('gameState', game);
    }
    pastState = numOfPlayers;
  }
}, 1000 / FPS);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
