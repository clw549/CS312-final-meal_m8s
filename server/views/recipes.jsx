import react, { useEffect } from "react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RecipeForm() {
  //collect data from the form
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  async function handleSubmit(event) {
    console.log(user);
    //build recipe object 
    const recipe = {
      title,
      ingredients,
      instructions
    };
    //api call
    fetch("http://localhost:8000/recipe", {
      method:"POST",
      headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Recipe</h2>

      <label>
        Title:
        <input 
          value={title}
          onChange={(changed) => setTitle(changed.target.value)}
        />
      </label>

      <label>
        Ingredients:
        <textarea
          value={ingredients}
          onChange={(changed) => setIngredients(changed.target.value)}
        />
      </label>

      <label>
        Instructions:
        <textarea
          value={instructions}
          onChange={(changed) => setInstructions(changed.target.value)}
        />
      </label>

      <button type="submit">Create</button>
    </form>
  );
}

export function UserRecipes() {
  var recipes;
  const [recipe_html, recipe_htmlSet] = useState();
  useEffect(()=>{
    fetch("http://localhost:8000/user-recipies", {
      method:"GET",
      headers: {"Content-Type": "application/json"}
    })
    .then((res) => res.json())
    .then((data) => {
      recipes = data.recipes;
      user = data.user;
      var working_recipes;
      for (recipe in recipes){
        working_recipes += Recipe(recipe);
      }
      recipe_htmlSet(working_recipes);
    })
  })

  return (<div>
    <h1>Your Recipes:</h1>
    {recipe_html}
    <p>end of recipes</p>
  </div>);
}

export default function Recipe({recipe}) {

  return (<div>
    <h3>{recipe.title} - {recipe.poster_name}</h3>
    <p>{recipe.ingredients}</p>
    <p>{recipe.instructions}</p>
  </div>)
} 
