import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignupPage, LoginPage, UserPage } from '../views/login'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="signup"> Signup</Link> | 
          <Link to="login"> Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<div/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
