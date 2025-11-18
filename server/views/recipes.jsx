import react, { useEffect } from "react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RecipeForm() {
  //collect data from the form
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [user, setUser] = useState();
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/user', {
      method:"GET",
      headers: {"Content-Type": "application/json"},
    })
    .then((res) => res.json())
    .then((data) => {
      setUser(data.username)
    })
  })

  async function handleSubmit(event) {
    console.log(user);
    //build recipe object 
    const recipe = {
      title,
      ingredients,
      instructions,
      image
    };
    //api call
    fetch("http://localhost:8000/recipe", {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(recipe)
    })
    .then(res => res.json())
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Recipe</h2>
      <label>Title:<input required={true}
          value={title}
          onChange={(changed) => setTitle(changed.target.value)}/>
      </label>
      <label>Ingredients:
        <textarea required={true}
          value={ingredients}
          onChange={(changed) => setIngredients(changed.target.value)}/>
      </label>
      <label>Instructions:
        <textarea required={true}
          value={instructions}
          onChange={(changed) => setInstructions(changed.target.value)}/>
      </label>
      <label>Image Link:
        <input value={image} 
        onChange={(changed) => setImage(changed.target.value)}/>
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

export function Recipes() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/recipes", {
      method:"GET"
    })
    .then((res) => res.json())
    .then((data) => {
      setRecipes(data.recipes);
      console.log(recipes)
      console.log(data);
    }).catch((err) => {console.log(err)})
  }, [])

  return (<div>
    <h2>Recipes:</h2>
    {recipes.map(recipe => (<Recipe key={recipe.id} recipe={recipe} />))}
    <p>end of recipes</p>
  </div>);
}

export function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState();

  //get the users recipes they've posted
  useEffect(()=>{
    //get user
    fetch('http://localhost:8000/user', {
      method:"GET",
      headers: {"Content-Type": "application/json"},
    })
    .then((res) => res.json())
    .then((data) => {
      setUser(data.username)
    })
    //get users recipes
    fetch("http://localhost:8000/user-recipes", {
      method:"GET"
    })
    .then((res) => res.json())
    .then((data) => {
      setRecipes(data.recipes);
      console.log(recipes)
      console.log(data);
      console.log(working_recipes);
    }).catch((err) => {console.log(err)})
  }, [])

  return (<div>
    <h2>Your Recipes:</h2>
    {recipes.map(recipe => (<Recipe key={recipe.id} recipe={recipe} />))}
    <p>end of recipes</p>
  </div>);
}

export default function Recipe({recipe}) {
  // style can be put into a css file
  return (<div style={{whiteSpace: "pre-wrap" }}> 
    <h3>{recipe?.meal_name} - {recipe?.poster_name}</h3>
    <p>{recipe?.meal_ingredients}</p>
    <p>{recipe?.meal_instructions}</p> 
    <img src={recipe?.meal_image}/>
  </div>)
} 
