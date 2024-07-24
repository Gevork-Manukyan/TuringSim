import "./App.scss";
import Canvas from "../Canvas/Canvas";
import Navbar from "../Navbar/Navbar";
import Toolbar from "../Toolbar/Toolbar";

function App() {
  return <>
  <header id="header"><Navbar /></header>
  <main id="main">
    <Toolbar />
    <Canvas />
  </main>
  <footer id="footer">footer</footer>
  </>;
}

export default App;
