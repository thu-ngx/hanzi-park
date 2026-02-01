import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CharacterPage from "./pages/CharacterPage";
import MyCollectionPage from "./pages/MyCollectionPage";
import { Toaster } from "sonner";
import ProtectedRoute from "@/features/auth/guards/ProtectedRoute";
import GuestRoute from "@/features/auth/guards/GuestRoute";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Analytics />
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* guest-only routes (redirect to home if logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LogInPage />} />
          </Route>

          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:char" element={<CharacterPage />} />

          {/* protected routes (auth required) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/collection" element={<MyCollectionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
