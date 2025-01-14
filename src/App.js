import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Board from "./pages/board";
import CreatePost from "./pages/createPost";
import DetailPost from "./pages/detailPost";
import EditPost from "./pages/editPost";
import EditUser from "./pages/editUser";
import EditUserPassword from "./pages/editUserPassword";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
 
  return (
    <div className="root-container">
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/board" element={<Board />}/>
      <Route path="/create-post" element={<CreatePost />}/>
      <Route path="/post" element={<DetailPost/>}/>
      <Route path="/edit-post" element={<EditPost/>}/>
      <Route path="/edit-user" element={<EditUser/>}/>
      <Route path="/edit-user-password" element={<EditUserPassword/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
