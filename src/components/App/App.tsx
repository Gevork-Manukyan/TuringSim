import "./App.css";
import Canvas from "../Canvas/Canvas";
import Navbar from "../Navbar/Navbar";

function App() {
  return <>
  <header id="header"><Navbar /></header>
  <main id="main">
    <section id="toolBar">toolbar</section>
    <Canvas />
  </main>
  <footer id="footer">footer</footer>
  </>;
}

export default App;
