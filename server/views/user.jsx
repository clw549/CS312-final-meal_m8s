import react, { useEffect } from "react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {RecipeForm, UserRecipes} from "./recipes";

export function LoginPage()
{
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function HandleSubmit(event) {

    let user = {password:password, username:username};
    //api call to check if user exists
    fetch('http://localhost:8000/login', {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(user),
    }).then((response) => 
      response.json()
    ).then((json) => {
      console.log(json)

    })
    .then(navigate("/user"))
    .catch((err) => {console.log(err)})
  }
  return (<div><form onSubmit={HandleSubmit}>Login
      <label>Username:<input name="username" type="text" required="true" value={username} onChange={(changed) => {setUsername(changed.target.value)}}/></label>    
      <label>Password<input name="password" type="password" required="true" value={password} onChange={(changed) => {setPassword(changed.target.value)}}/></label>
      <button type="submit">Submit</button>
    </form></div>);
}

export function SignupPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  function HandleSubmit(event) {

    let user = {password:password, username:username};
    //api call to create a user
    fetch('http://localhost:8000/signup', {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(user),
    })
    .then((response) => console.log(response))
    .then(navigate("/user"))
    .catch((error) => console.log(error))
  }

  return (<div>
    <form onSubmit={HandleSubmit}>Signup
      <label>Username:<input type="text" name="username" required="true" value={username} onChange={(changed) => {setUsername(changed.target.value)}} /></label>
      <label>Password:<input type="password" name="password" required="true"
      value={password} onChange={(changed) => {setPassword(changed.target.value)}}/></label>
      <button type="submit">Submit</button>
    </form>
  </div>);
}

export function UserPage() {
  const [username, setUsername] = useState("")
  useEffect(() => {
    fetch('http://localhost:8000/user', {
      method:"GET",
      headers: {"Content-Type": "application/json"},
    })
    .then((res) => res.json())
    .then((data) => {
      setUsername(data.username)
    })
  })
  return (<div>
    <h1> {username} </h1>
    <RecipeForm />
    <UserRecipes />
  </div>)
}