import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="app">
      <div className="container">
        <h1>Subnautica Map</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Interactive mapping tool for Subnautica - maintaining the game's atmosphere
          </p>
        </div>
        <p className="read-the-docs">
          Bootstrap complete. Ready for development.
        </p>
      </div>
    </main>
  )
}

export default App
