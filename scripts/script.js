const gameBoardEl = document.getElementById('game-board');

const createPlayer = (name, id) => {
  let playerName = name;
  let mark = '';
  const score = 0;
  const moves = [];

  const setPlayerMark = () => {
    if (id === 0) {
      mark = 'X';
    } else {
      mark = 'O';
    }
  };
  setPlayerMark();

  const setPlayerName = () => {
    if (playerName === '' || playerName === ' ') {
      playerName = `Player ${mark}`;
    }
  };
  setPlayerName();

  return {
    playerName,
    id,
    mark,
    score,
    moves,
  };
};

// module to control the Game
const gameController = (() => {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let playerOne;
  let playerTwo;

  const createDefaultPlayers = () => {
    playerOne = createPlayer('X', 0);
    playerTwo = createPlayer('O', 1);
  };
  createDefaultPlayers();

  let roundsCounter = 1;
  let movesCounter = 1;

  const increaseMovesCounter = () => {
    movesCounter++;
  };

  const changeFirstMove = () => {
    if (roundsCounter % 2) {
      movesCounter = 1;
    } else {
      movesCounter = 0;
    }
  };

  const checkActivePlayer = () => {
    if (movesCounter % 2) {
      return playerOne;
    }
    return playerTwo;
  };

  // check if a tie is occurred
  const checkTie = () => {
    let isBoardFull = true;
    const cells = document.querySelectorAll('.game-board-cell');
    Array.from(cells).forEach((cell) => {
      if (cell.textContent === '') {
        isBoardFull = false;
      }
    });
    return isBoardFull;
  };

  // save player moves to object's property
  const savePlayerMoves = (player, move) => {
    player.moves.push(move);
  };

  const players = [playerOne, playerTwo];

  let isRoundFinished = false;

  // check if someone already has a winning combinations
  const findWinner = (player) => {
    const pMoves = player.moves;
    const checker = (arr, target) => target.every((cell) => arr.includes(cell));
    for (let i = 0; i < winCombinations.length; i++) {
      if (checker(pMoves, winCombinations[i])) {
        isRoundFinished = true;
        roundsCounter++;
        console.log(`Player ${player.playerName} Wins`);
      }
    }
    if (checkTie()) {
      isRoundFinished = true;
      roundsCounter++;
      console.log("It's a tie!");
    }
  };

  const getRoundStatus = () => {
    return isRoundFinished;
  };

  // cleans all cells to start new round (rounds score is untouched)
  const restartRound = () => {
    players.forEach((player) => {
      player.moves = [];
    });
    changeFirstMove();
    isRoundFinished = false;
  };

  // cleans all cells and the score board
  const restartGame = () => {
    restartRound();
    players.forEach((player) => {
      player.score = 0;
    });
    movesCounter = 1;
    roundsCounter = 1;
  };

  return {
    findWinner,
    restartGame,
    restartRound,
    getRoundStatus,
    savePlayerMoves,
    checkActivePlayer,
    increaseMovesCounter,
  };
})();

// module to control the interface of the Game

const checkCell = (e) => {
  const { target } = e;
  const cellIndex = Number(target.getAttribute('data-index'));
  const activePlayer = gameController.checkActivePlayer();

  if (
    cellIndex !== null &&
    target.textContent === '' &&
    !gameController.getRoundStatus()
  ) {
    target.textContent = activePlayer.mark;
    gameController.savePlayerMoves(activePlayer, cellIndex);
    gameController.increaseMovesCounter();
    gameController.findWinner(activePlayer);
  }
};

gameBoardEl.addEventListener('click', checkCell);
