/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const gameBoardEl = document.getElementById('game-board');

const createPlayer = (name, id) => {
  let playerName = name;
  let mark = '';
  let score = 0;
  let moves = [];

  const setPlayerName = () => {
    if (playerName === '' || playerName === ' ') {
      playerName = `Player ${id}`;
    }
  };

  const setPlayerMark = () => {
    if (id === 0) {
      mark = 'X';
    } else {
      mark = 'O';
    }
  };

  setPlayerName();
  setPlayerMark();

  return {
    playerName,
    id,
    mark,
    score,
    moves,
  };
};

const playerOne = createPlayer('', 0);
const playerTwo = createPlayer('', 1);

// module to control the Game
const gameController = (() => {
  const _winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let activePlayer;
  let movesCounter = 1;

  const checkActivePlayer = () => {
    if (movesCounter % 2) {
      activePlayer = playerOne;
    } else {
      activePlayer = playerTwo;
    }
  };

  const findWinner = (player) => {};

  const savePlayerMoves = (player, move) => {
    player.moves.push(move);
    // console.log(player.id, player.moves);
  };

  const checkCell = (e) => {
    const { target } = e;
    const cellIndex = target.getAttribute('data-index');

    if (cellIndex !== null && target.textContent === '') {
      checkActivePlayer();
      target.textContent = activePlayer.mark;
      savePlayerMoves(activePlayer, cellIndex);
      movesCounter++;
    }
  };

  const _players = [playerOne, playerTwo];
  // cleans all cells to start new round (rounds score is untouched)
  const restartRound = () => {
    _players.forEach((player) => {
      player.moves = [];
    });
    movesCounter = 1;
  };

  // cleans all cells and the score board
  const restartGame = () => {
    restartRound();
    _players.forEach((_player) => {
      _player.score = 0;
    });
  };

  gameBoardEl.addEventListener('click', checkCell);

  return {
    restartGame,
    restartRound,
  };
})();
