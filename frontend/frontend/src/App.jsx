import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invite from "./pages/Invite";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invite/:token" element={<Invite />} />
      </Routes>
    </BrowserRouter>
  );
}