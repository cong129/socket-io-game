import React, { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import { io, Socket } from 'socket.io-client';

const GameBoard = (props) => {
  // REACT STUFF
  let x;
  let y;
  const PLAYER_DIAMETER = 50;
  const SCREEN_HEIGHT = 600;
  const SCREEN_WIDTH = 700;
  const socket = useRef();
  const MAX_TIME = 600;
  let inFlag = false; //useEffectが２回読まれるの防ぐ
  let gameFlag = useRef(false); //ゲームが始まる時を検知するためのフラグ
  let gameStartFlag = useRef(false); //ゲームを開始するためのフラグ。trueになるとえが書き始め
  let timer = useRef(0); //
  // let [gameResult, setGameResult] = useState(); //
  let gameResult = useRef();
  let gameState = { players: [], colors: [], positions: [] };

  function setGame() {
    if (inFlag !== true) {
      socket.current = io('http://localhost:4000');

      socket.current?.emit('joinGame', {
        name: props.name,
        color: props.color,
      });

      socket.current?.on('waitingOpponent', () => {
        console.log('waiting!');
      });

      socket.current?.on('gameStart', () => {
        console.log('start!');
        gameStartFlag.current = true;
      });

      socket.current?.on('gameState', (args) => {
        gameState = args;
      });

      socket.current?.on('Winner', (args) => {
        gameStartFlag.current = false;
        console.log(args);
        gameResult.current = args;
        console.log(gameResult.current);
      });
      inFlag = true;
    }
  }

  useEffect(setGame, []);

  // P5 JS Stuff
  const setup = (p5, canvasParentRef) => {
    const canvas = p5
      .createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT)
      .parent(canvasParentRef);
    canvas.mouseMoved(() => {
      x = p5.mouseX;
      y = p5.mouseY;
      socket.current?.emit('playerMove', { x: x, y: y });
    });
  };

  const draw = (p5) => {
    if (timer.current < MAX_TIME) {
      if (!gameStartFlag.current) {
        p5.clear();
        p5.fill(255);
        p5.textSize(32);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text('Waiting Opponent!', p5.width / 2, p5.height / 2);
      } else if ((gameStartFlag.current === true) & (gameFlag == false)) {
        p5.clear();
      } else {
        p5.noStroke();
        p5.fill(props.color);
        p5.ellipse(
          x - PLAYER_DIAMETER / 2,
          y - PLAYER_DIAMETER / 2,
          PLAYER_DIAMETER,
          PLAYER_DIAMETER
        );
        for (let i = 0; i < gameState.players.length; i++) {
          //skip over self
          if (gameState.players[i] === props.name) {
            continue;
          }
          p5.noStroke();
          p5.fill(gameState.colors[i]);
          p5.ellipse(
            gameState.positions[i].x,
            gameState.positions[i].y,
            PLAYER_DIAMETER,
            PLAYER_DIAMETER
          );
        }
        console.log('drawing');
        timer.current += 1;
        // setTimer(timer.current + 1);
      }
    } else if (timer.current === MAX_TIME) {
      console.log('in');
      // } else if ((gameEndFlag.current === true) & (gameFlag.current === true)) {
      p5.loadPixels();

      const calculateColorArea = (targetColor) => {
        let colorArea = 0;

        for (let i = 0; i < p5.width * p5.height * 4; i += 4) {
          const r = p5.pixels[i];
          const g = p5.pixels[i + 1];
          const b = p5.pixels[i + 2];

          // 주어진 색상과 일치하는 경우 면적 계산
          if (
            r === parseInt(targetColor.slice(1, 3), 16) &&
            g === parseInt(targetColor.slice(3, 5), 16) &&
            b === parseInt(targetColor.slice(5, 7), 16)
          ) {
            colorArea++;
          }
        }
        p5.updatePixels();
        timer.current += 1;
        return colorArea;
      };
      const result = {};
      for (let j = 0; j < gameState.colors.length; j++) {
        result[`player${j}`] = {};
        result[`player${j}`]['player_name'] = gameState.players[j];
        result[`player${j}`]['area'] = calculateColorArea(gameState.colors[j]);
      }
      socket.current?.emit('sendResult', result);
    } else if ((timer.current > MAX_TIME) & !gameStartFlag.current) {
      console.log('finished');
      console.log('');
      p5.fill(255);
      p5.textSize(75);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(
        `Winner : \n${gameResult.current.winner}`,
        p5.width / 2,
        p5.height / 2
      );
      // p5.text(`Winner : ${gameResult.winner}`, p5.width / 2, p5.height / 2);

      p5.fill(200);
      p5.textSize(35);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(
        `loser : \n${gameResult.current.loser}`,
        p5.width / 2,
        (p5.height * 3) / 4
      );
      // p5.text(`loser : ${gameResult.loser}`, p5.width / 2, (p5.height * 3) / 4);
    } else {
      console.log('waiting Server for result', gameStartFlag.current);
    }
    gameFlag = gameStartFlag.current;
  };

  return (
    <div>
      <Sketch setup={setup} draw={draw} />;
    </div>
  );
};

export default GameBoard;
