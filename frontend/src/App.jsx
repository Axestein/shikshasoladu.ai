import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home1 from "../src/page/Alluser/Home1";
import Home from "./page/Home";
import Deaf from "./page/Deaf/Deaf";
import Blind from "./page/Blind/Blind";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deaf" element={<Deaf />} />
        <Route path="/blind" element={<Blind />} />
        <Route path="/home" element={<Home />} />
        <Route path="/allusers" element={<Home1 />} />
      </Routes>
    </Router>
  );
}