import react, { useEffect } from "react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {RecipeForm, UserRecipes} from "./recipes";

export function FavoritesPage() {
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8000/favorites", {
      method:"GET"
    })
    .then((res) => res.json())
    .then((data) => {
      setRecipes(data.favorites);
      console.log(data);
    })
  }, []);

  function handleDelete(event) {
    event.preventDefault()

    let favorite_id = parseInt(event.currentTarget.value);
    console.log(favorite_id);

    fetch("http://localhost:8000/favorites", {
      method:"DELETE",
      body:JSON.stringify({favorite_id}),
      headers: {"Content-Type": "application/json"}
    }).then(navigate("/favorites"))
  }

  return( <div class="col">
    <h2>Favorites:</h2>
    {recipes?.map(recipe => (
      <div key={recipe.favorite_id}>
      <h3>{recipe?.meal_name} - {recipe?.poster_name}</h3>
      <p>{recipe?.meal_ingredients}</p>
      <p>{recipe?.meal_instructions}</p> 
      <img src={recipe?.meal_image}/> 
      <button onClick={handleDelete} value={recipe.fave_id}>Remove</button>
      </div>
    ))}
    </div>
  )
}