import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { Library } from "./pages/Library";
import { EditorPage } from "./pages/Editor";
import { useAuth } from "./store/auth";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuth((s) => s.checkAuth);
  const loaded = useAuth((s) => s.loaded);
  useEffect(() => { if (!loaded) void checkAuth(); }, [checkAuth, loaded]);
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/library" element={<Library />} />
          <Route path="/edit/:id" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}
