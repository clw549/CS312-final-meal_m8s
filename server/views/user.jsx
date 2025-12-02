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
  const navigate = useNavigate();

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
    .then(navigate("/login"))
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
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [user, setUser] = useState({})
  useEffect(() => {
    fetch('http://localhost:8000/user', {
      method:"GET",
      headers: {"Content-Type": "application/json"},
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setUsername(data.user.username)
      setUser(data.user)
      console.print(user)
    })
  }, [])
  return (
  <div class="row">
    <UserProfile user={user} />
    <div class="col">
      <RecipeForm />
      <UserRecipes />
    </div>
  </div>
  )
}

function UserProfile({user}) {
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  function HandleSubmit(event) {
    event.preventDefault();
    let sendJson = {image:image, bio:bio}
    fetch("http://localhost:8000/user-image", {
      method:"PUT",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(sendJson),
    })
    .then(navigate("/user"))
    .catch((error) => {console.log(error)})
  }

  async function handleDeleteAccount() {
  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/delete-account", {
      method: "DELETE",
    });

    const data = await res.json();

    window.location.href = "/login";
  } catch (err) {
    console.log("SERVER DELETE ACCOUNT ERROR:", err);
    alert("Server error deleting account.");
  }
}

  return (<div class="col">
    <h1>{user.username}</h1>
    <p>{user.bio}</p>
    <img src={user?.image}/>
    <form onSubmit={HandleSubmit} class="col">
      <label>Change Profile Picture:
      <input name="user_image" type="text" value={image}
      onChange={(changed) => {setImage(changed.target.value)}}></input>
      </label>
      <label>Bio:
        <textarea value={bio}
      onChange={(changed) => {setBio(changed.target.value)}}></textarea></label>
      <button type="submit">Submit</button>
    </form>
    <button onClick={handleDeleteAccount}>
      Delete Account
    </button>
  </div>);
}