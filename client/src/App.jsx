import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="about" element={<About/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="sign-in" element={<SignUp/>} />
        <Route path="sign-out" element={<SignOut/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
