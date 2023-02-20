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
