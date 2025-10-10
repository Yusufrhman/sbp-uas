// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/home/HomeScreen";
import QuestionScreen from "./pages/question/QuestionScreen";
import ResultScreen from "./pages/result/ResultScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/question" element={<QuestionScreen />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
