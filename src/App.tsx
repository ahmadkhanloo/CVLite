import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Library } from "./pages/Library";
import { EditorPage } from "./pages/Editor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/edit/:id" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
