import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotesHub from "./pages/NotesHub";
import AdminPanel from "./pages/AdminPanel";
import Moderation from "./pages/Moderation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/chat" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notes" element={<NotesHub />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/moderation" element={<Moderation />} />
      </Routes>
    </Router>
  );
}

export default App;