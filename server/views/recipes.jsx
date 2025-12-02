import react, { useEffect } from "react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Rating} from "./rating.jsx";

export function RecipeForm() {
  //collect data from the form
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/user', {
      method:"GET",
      headers: {"Content-Type": "application/json"},
    })
    .then((res) => res.json())
    .then((data) => {
      setUser(data.user.username)
      console.log(data);
      console.log(user);
    })
  }, [])

  function handleSubmit(event) {
    event.preventDefault();
    console.log(user);
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log("handle submit");

    //build recipe object 
    const recipe = {
      title,
      ingredients,
      instructions,
      image,
      date
    };
    //api call
    fetch("http://localhost:8000/recipe", {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(recipe)
    })
    .then(res => res.json())
    .then(() => {
      window.location.reload();
    })
  }


  return (
    <form onSubmit={handleSubmit} class="col">
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
  const [sortField, setSortField] = useState('meal_name');
  const [order, setOrder] = useState('asc');

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {
    // if searching, call the search api
    async function fetchData() {
      try {
        if (submittedSearch && submittedSearch.trim() !== "") {
          const resp = await fetch(
            `http://localhost:8000/search?q=${submittedSearch.trim()}`
          );
          const data = await resp.json();
          setRecipes(data.recipes || []);
        } 
        else {
          // default recipes route (sorted)
          const resp = await fetch(
            `http://localhost:8000/recipes?sort=${sortField}&order=${order}`
          );
          const data = await resp.json();
          setRecipes(data.recipes || []);
        }
      } 
      catch (err) {
        console.error("Fetch error:", err);
        setRecipes([]);
      }
    }

    fetchData();
  }, [submittedSearch, sortField, order]);

  function handleFavorite (event) {
    event.preventDefault();
    let id = event.currentTarget.value;

    fetch("http://localhost:8000/favorite", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify({id:id})
    })
  }

  function handleSearchKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      setSubmittedSearch(searchTerm);
    }
  }

  return (
  <div class="col">
    <h2>Recipes: {recipes.length}</h2>
    <input
      type="text"
      placeholder="Search recipes (press Enter)..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearchKey}
      style={{
        marginBottom: "20px",
        padding: "6px",
        fontSize: "16px",
        width: "250px",
    }}
    />
    <label>Sort by: </label>
    <select value={sortField} onChange={e => setSortField(e.target.value)}>
      <option value="meal_name">Name</option>
      <option value="id">Date</option>
    </select>

    <select value={order} onChange={e => setOrder(e.target.value)}>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>

    {recipes.map(recipe => ( 
      <div key={recipe.id} recipe={recipe} class="col">
        <Rating meal_id={recipe.id} />
        <h3>{recipe.meal_name} - {recipe.poster_name}</h3>
        <p><h4>Ingredients:</h4>{recipe.meal_ingredients}</p>
        <p><h4>Instructions:</h4>{recipe.meal_instructions}</p>
        <img src={recipe.meal_image} style={{maxWidth: "300px"}}/>
        <button onClick={handleFavorite} name="id" value={recipe.id}>Favorite</button>
      </div>
      ))}
  </div>
  );
}

export function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({
    meal_name: "",
    meal_ingredients: "",
    meal_instructions: "",
    meal_image: ""
  });


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
    }).catch((err) => {console.log(err)})
  }, [])

  const handleDelete = id => {
  console.log(`Deleting recipe with ID: ${id}`);
  fetch(`http://localhost:8000/recipes/${id}`, { method: 'DELETE' })
    .then(() => {
      // Remove the deleted recipe from state
      setRecipes(prev => prev.filter(r => r.id !== id));
    })
    .catch(err => console.error(err));
  };

  const startEdit = (recipe) => {
    console.log(`Editing recipe: ${recipe}`);
    // set current recipe to the one being edited
    setCurrentRecipe(recipe);
    setIsEditing(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:8000/recipes/${currentRecipe.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_name: currentRecipe.meal_name,
        meal_ingredients: currentRecipe.meal_ingredients,
        meal_instructions: currentRecipe.meal_instructions,
        meal_image: currentRecipe.meal_image
      }),
    });

    const updated = await res.json();

    setRecipes(prev =>
      prev.map(recipes => (recipes.id === updated.id ? updated : recipes))
    );

    setIsEditing(false);
  };

  return (<div class="col">
    <h2>Your Recipes: {recipes.length}</h2>
    {recipes.map(recipe => (
      <div key={recipe.id} recipe={recipe}>
        <h3>{recipe.meal_name}</h3>
        <p>{recipe.meal_ingredients}</p>
        <p>{recipe.meal_instructions}</p>
        <img src={recipe.meal_image} style={{maxWidth: "300px"}}/>
        <button onClick={() => startEdit(recipe)} className="editbtn">Edit</button>
        <button onClick={() => handleDelete(recipe.id)} className="deletebtn">Delete</button>
      </div> 
    ))}

    {isEditing && (
      <form onSubmit={handleUpdate} className="edit-form">
      <h2>Edit Recipe</h2>

      <label>Name</label>
      <input 
        value={currentRecipe.meal_name}
        onChange={(event) =>
          setCurrentRecipe({ ...currentRecipe, meal_name: event.target.value })
        }
      />

      <label>Ingredients</label>
      <textarea 
        value={currentRecipe.meal_ingredients}
        onChange={(event) =>
          setCurrentRecipe({ ...currentRecipe, meal_ingredients: event.target.value })
        }
      />

      <label>Instructions</label>
      <textarea 
        value={currentRecipe.meal_instructions}
        onChange={(event) =>
          setCurrentRecipe({ ...currentRecipe, meal_instructions: event.target.value })
        }
      />

      <label>Image</label>
      <input 
        value={currentRecipe.meal_image}
        onChange={(event) =>
          setCurrentRecipe({ ...currentRecipe, meal_image: event.target.value })
        }
      />

    <button type="submit">Save Changes</button>
    <button type="button" onClick={() => setIsEditing(false)}>
      Cancel
    </button>
  </form>
)}
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