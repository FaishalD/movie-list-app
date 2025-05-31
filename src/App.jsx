import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MovieTracker from "./pages/MovieTRacker";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieTracker />} />
    </Routes>
  );
}

export default App;
