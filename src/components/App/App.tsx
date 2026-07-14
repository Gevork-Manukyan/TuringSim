import "./App.scss";
import Canvas from "../Canvas/Canvas";
import Navbar from "../Navbar/Navbar";
import Toolbar from "../Toolbar/Toolbar";
import { useRef } from "react";

function App() {

  const canvasRef = useRef<HTMLElement>(null)

  return <div id="app-shell">
  <header id="header">
    <Navbar />
  </header>
  <main id="main">
    <Toolbar canvasRef={canvasRef} />
    <Canvas ref={canvasRef} />
  </main>
  </div>
}

export default App;
