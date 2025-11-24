import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignupPage, LoginPage, UserPage } from '../views/user'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Recipes } from '../views/recipes'
import { FavoritesPage } from '../views/favorites'

function App() {
  return (
    <master class="master">
    <h1>Meal M8s</h1>
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="signup"> Signup</Link> | 
        <Link to="login"> Login</Link> |
        <Link to="user"> Profile</Link> | 
        <Link to="favorites"> Favorites</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  </master>
  )
}

export default App
