import "./App.scss";
import Canvas from "../Canvas/Canvas";
import Navbar from "../Navbar/Navbar";
import Toolbar from "../Toolbar/Toolbar";
import { useRef } from "react";

function App() {

  const canvasRef = useRef<HTMLElement>(null)

  return <>
  <header id="header"><Navbar /></header>
  <main id="main">
    <Toolbar canvasRef={canvasRef} />
    <Canvas ref={canvasRef} />
  </main>
  <footer id="footer">footer</footer>
  </>;
}

export default App;
