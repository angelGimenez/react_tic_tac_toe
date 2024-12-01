/* eslint-disable react/prop-types */
import './styles.css'
import {useState} from "react"
import confetti from "canvas-confetti"

export default function Game() {
  const [history, setHistory] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : [Array(9).fill(null)]
  })
  const [currentMove, setCurrentMove] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? 0
  })
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Ir al movimiento #' + move
    } else {
      description = 'Ir al inicio del juego'
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    window.localStorage.setItem('board', JSON.stringify(nextHistory))
    window.localStorage.setItem('turn', JSON.stringify(nextHistory.length - 1))
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button style={{margin: "10px 0"}} onClick={resetGame}>Resetear el juego</button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({xIsNext, squares, onPlay}) {

  const winner = calculateWinner(squares)
  let status
  
  if (winner) {
    status = "Ganador: " + winner
    confetti()
  } else if (squares.every((square) => square !== null)) {
    status = "Empate"
  } else {
    status = "Siguiente jugador: " + (xIsNext ? "X" : "O")
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }

    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }

    onPlay(nextSquares)
  }

  return (
  <>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => {handleClick(0)}} />
      <Square value={squares[1]} onSquareClick={() => {handleClick(1)}} />
      <Square value={squares[2]} onSquareClick={() => {handleClick(2)}} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => {handleClick(3)}} />
      <Square value={squares[4]} onSquareClick={() => {handleClick(4)}} />
      <Square value={squares[5]} onSquareClick={() => {handleClick(5)}} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => {handleClick(6)}} />
      <Square value={squares[7]} onSquareClick={() => {handleClick(7)}} />
      <Square value={squares[8]} onSquareClick={() => {handleClick(8)}} />
    </div>
  </>
  )
}

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}