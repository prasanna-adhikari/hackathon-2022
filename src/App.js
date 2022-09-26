import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import TaskDetail from "./pages/Landing/TaskDetail";
import ByDate from "./pages/Landing/ByDate";
import Test from "./pages/Landing/test";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/board" element={<ByDate />} />
        <Route path="/test/:id" element={<Test />} />
      </Routes>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
