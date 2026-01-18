import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Todos from "./components/Todos";
import UsersDelete from "./components/UsersDelete";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/delete" element={<UsersDelete />} />
      <Route path="/todos"element={<Todos /> } />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
