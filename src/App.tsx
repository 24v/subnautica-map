import './App.css'
import MapCanvas from './components/MapCanvas'
import { useState, useEffect } from 'react'

function App() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      // Use most of the viewport, leaving space for header
      const width = Math.max(800, window.innerWidth - 40);
      const height = Math.max(600, window.innerHeight - 120);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <main className="app">
      <div className="container">
        <h1 className="subnautica-title">Subnautica Map</h1>
        
        <div className="map-container">
          <MapCanvas width={dimensions.width} height={dimensions.height} />
        </div>
      </div>
    </main>
  )
}

export default App
