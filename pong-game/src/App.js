import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const BOARD_HEIGHT = 400;
const BOARD_WIDTH = 600;
const PADDLE_SPEED = 10;
const BALL_SPEED = 4;

function App() {
  const [ballPosition, setBallPosition] = useState({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 });
  const [ballDirection, setBallDirection] = useState({ x: BALL_SPEED, y: BALL_SPEED });
  const [leftPaddleY, setLeftPaddleY] = useState((BOARD_HEIGHT - PADDLE_HEIGHT) / 2);
  const [rightPaddleY, setRightPaddleY] = useState((BOARD_HEIGHT - PADDLE_HEIGHT) / 2);

  const gameBoardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          setLeftPaddleY((prevY) => Math.max(prevY - PADDLE_SPEED, 0));
          break;
        case 's':
          setLeftPaddleY((prevY) => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
          break;
        case 'ArrowUp':
          setRightPaddleY((prevY) => Math.max(prevY - PADDLE_SPEED, 0));
          break;
        case 'ArrowDown':
          setRightPaddleY((prevY) => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveBall();
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [ballPosition, ballDirection]);

  const moveBall = () => {
    let newX = ballPosition.x + ballDirection.x;
    let newY = ballPosition.y + ballDirection.y;

    if (newY <= 0 || newY >= BOARD_HEIGHT - BALL_SIZE) {
      setBallDirection((prevDirection) => ({ ...prevDirection, y: -prevDirection.y }));
    }

    if (
      (newX <= PADDLE_WIDTH &&
        newY >= leftPaddleY &&
        newY <= leftPaddleY + PADDLE_HEIGHT) ||
      (newX >= BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        newY >= rightPaddleY &&
        newY <= rightPaddleY + PADDLE_HEIGHT)
    ) {
      setBallDirection((prevDirection) => ({ ...prevDirection, x: -prevDirection.x }));
    }

    if (newX <= 0 || newX >= BOARD_WIDTH - BALL_SIZE) {
      // Reset ball to center after scoring
      setBallPosition({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 });
      setBallDirection({ x: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1), y: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1) });
    } else {
      setBallPosition({ x: newX, y: newY });
    }
  };

  return (
    <div ref={gameBoardRef} style={styles.gameBoard}>
      <div style={{ ...styles.paddle, top: leftPaddleY, left: 0 }} />
      <div style={{ ...styles.paddle, top: rightPaddleY, right: 0 }} />
      <div style={{ ...styles.ball, top: ballPosition.y, left: ballPosition.x }} />
    </div>
  );
}

const styles = {
  gameBoard: {
    position: 'relative',
    width: `${BOARD_WIDTH}px`,
    height: `${BOARD_HEIGHT}px`,
    backgroundColor: 'black',
    margin: '50px auto',
    border: '2px solid white',
  },
  paddle: {
    position: 'absolute',
    width: `${PADDLE_WIDTH}px`,
    height: `${PADDLE_HEIGHT}px`,
    backgroundColor: 'white',
  },
  ball: {
    position: 'absolute',
    width: `${BALL_SIZE}px`,
    height: `${BALL_SIZE}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
  },
};

export default App;