import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/login" element={<LogInPage />}></Route>
          {/* protected routes */}
          {/* TODO: create protected route */}
          <Route path="/" element={<ChatAppPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
