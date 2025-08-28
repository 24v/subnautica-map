import './App.css'
import MapCanvas from './components/MapCanvas'

function App() {
  return (
    <main className="app">
      <div className="container">
        <h1>Subnautica Map</h1>
        <p>Interactive mapping tool for Subnautica - maintaining the game's atmosphere</p>
        
        <div className="map-container">
          <MapCanvas width={800} height={600} />
        </div>
        
        <p className="instructions">
          Canvas initialized with coordinate grid and Lifeboat 5 origin point.
        </p>
      </div>
    </main>
  )
}

export default App
