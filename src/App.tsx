import './App.css'
import MapCanvas from './components/MapCanvas'
import { useState, useEffect } from 'react'

function App() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <main className="app">
      <MapCanvas width={dimensions.width} height={dimensions.height} />
    </main>
  )
}

export default App
