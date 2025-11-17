import React, { useState } from "react";
import { pool, app } from "../index.js";

export default function RecipeForm() {
  //collect data from the form
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  async function handleSubmit(event) {
    event.preventDefault(); // stops the page from refreshing
    const user = session.user
    console.log(user);
    //build recipe object 
    const recipe = {
      title,
      ingredients,
      instructions,
    };
    try {
      var success = await pool.query("INSERT INTO meals (meal_name, meal_ingredients, meal_instructions, meal_image, poster_id) VLAUES (?, ?, ?, ?, ?)" [title, ingredients, instructions, "", user.id])
      //log recipe
      if (success[0]) {
        console.log("Recipe Created:", recipe);
      }
      else {
        throw "Issue creating recipe ?", success.toString()
      }
    } catch (err) {
      console.log(err);
    }
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

export default function UserRecipies() {

  return (<div>
    <h1>Your Recipes:</h1>
    <p>todo</p>
  </div>);
}
