import About from "./About";
import "./App.css";
import MainPage from "./MainPage";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
