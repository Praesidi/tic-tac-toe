const gameBoardEl = document.getElementById('game-board');
const restartBtn = document.getElementById('modal-restart-btn');
const continueBtn = document.getElementById('modal-continue-btn');

// factory function to create a player object
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

// module to control the Game's logic
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

  const playerOne = createPlayer('X', 0);
  const playerTwo = createPlayer('O', 1);
  const players = [playerOne, playerTwo];

  let roundsCounter = 0;
  let movesCounter = 0;

  const increaseMovesCounter = () => {
    movesCounter++;
    // console.log(movesCounter);
  };

  const increaseRoundsCounter = () => {
    roundsCounter++;
  };

  // each round player who starts a game changes
  // FIXME: change params
  const changeFirstMove = () => {
    if (!(roundsCounter % 2)) {
      movesCounter = 0;
    } else {
      movesCounter = 1;
    }
  };

  // checks whose turn to make a move
  // FIXME:
  const checkActivePlayer = () => {
    if (!(movesCounter % 2)) {
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

  let isRoundFinished = false;

  // check if someone already has a winning combinations
  // переписать так, чтобы возвращал id победителя или ничью????
  const findWinner = (player) => {
    const pMoves = player.moves;
    const checker = (arr, target) => target.every((cell) => arr.includes(cell));
    for (let i = 0; i < winCombinations.length; i++) {
      if (checker(pMoves, winCombinations[i])) {
        isRoundFinished = true;
        player.score += 1;
        // console.log(`Player ${player.playerName} Wins`);
        return 'win';
      }
    }
    if (checkTie()) {
      isRoundFinished = true;
      // console.log("It's a tie!");
      return 'tie';
    }
    return 0;
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
    movesCounter = 0;
    roundsCounter = 0;
  };

  return {
    findWinner,
    restartGame,
    restartRound,
    getRoundStatus,
    savePlayerMoves,
    checkActivePlayer,
    increaseMovesCounter,
    increaseRoundsCounter,
  };
})();

// module to control the interface of the Game
const interfaceController = (() => {
  const firstPlayerScoreBoardEl = document.getElementById('first-player');
  const secondPlayerScoreBoardEl = document.getElementById('second-player');
  const firstPlayerScoreEl = document.getElementById('first-player-score');
  const secondPlayerScoreEl = document.getElementById('second-player-score');
  const modalText = document.getElementById('winner-modal-text');
  const modal = document.querySelector('dialog');

  const updatePlayerScore = (player) => {
    if (player.id === 0) {
      firstPlayerScoreEl.textContent = `${player.score}`;
    } else {
      secondPlayerScoreEl.textContent = `${player.score}`;
    }
  };

  const showWinnerName = (player) => {
    modalText.textContent = `Player ${player.playerName} wins the round!`;
  };

  const showTie = () => {
    modalText.textContent = `It's a tie!`;
  };

  const clearGameBoard = () => {
    const cellsEl = Array.from(
      document.getElementsByClassName('game-board-cell')
    );
    cellsEl.forEach((cell) => {
      cell.textContent = '';
    });
  };

  const clearScoreBoard = () => {
    firstPlayerScoreEl.textContent = '0';
    secondPlayerScoreEl.textContent = '0';
  };

  // clears game board
  const restartRound = () => {
    clearGameBoard();
  };

  // clears game board and score boards
  const restartGame = () => {
    clearGameBoard();
    clearScoreBoard();
  };

  const showModal = () => {
    modal.show();
  };

  const closeModal = () => {
    modal.close();
  };

  // highlights active player's name
  // (player.id === 1) because we use id opposite to id of player who made last move
  const showActivePlayer = (player) => {
    if (player.id === 1) {
      firstPlayerScoreBoardEl.classList.add('active-player');
      secondPlayerScoreBoardEl.classList.remove('active-player');
    } else {
      firstPlayerScoreBoardEl.classList.remove('active-player');
      secondPlayerScoreBoardEl.classList.add('active-player');
    }
  };

  return {
    updatePlayerScore,
    showActivePlayer,
    showWinnerName,
    restartRound,
    restartGame,
    closeModal,
    showModal,
    showTie,
  };
})();

const handleGame = (player) => {
  gameController.increaseMovesCounter();
  interfaceController.showActivePlayer(player); // highlights player whose turn
  const status = gameController.findWinner(player);

  if (status === 'win') {
    interfaceController.showModal(player);
    interfaceController.showWinnerName(player);
    interfaceController.updatePlayerScore(player);
    gameController.increaseRoundsCounter();
  }
  if (status === 'tie') {
    interfaceController.showModal();
    interfaceController.showTie();
    gameController.increaseRoundsCounter();
  }
};

const checkCell = (e) => {
  const { target } = e;
  const cellIndex = Number(target.getAttribute('data-index'));
  const activePlayer = gameController.checkActivePlayer();
  console.log(activePlayer);

  // check is a cell available
  if (
    cellIndex !== null &&
    target.textContent === '' &&
    !gameController.getRoundStatus()
  ) {
    target.textContent = activePlayer.mark; // place mark
    gameController.savePlayerMoves(activePlayer, cellIndex); // saves moves

    handleGame(activePlayer);
  }
};

gameBoardEl.addEventListener('click', checkCell);

continueBtn.addEventListener('click', () => {
  gameController.restartRound();
  interfaceController.restartRound();
  interfaceController.closeModal();
});
restartBtn.addEventListener('click', () => {
  gameController.restartGame();
  interfaceController.restartGame();
  interfaceController.closeModal();
});
