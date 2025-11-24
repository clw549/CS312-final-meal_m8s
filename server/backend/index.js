import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = 8000;
const doctype = "<!DOCTYPE html>"

const pool = mysql.createPool({
  host:"localhost",
  user:"server",
  password:'D3l1siouS',
  database:"mealm8s",
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0,
  port:3306 
})

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "mealm8s-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure: true only if using HTTPS
  })
);

//signing up
app.post("/signup", async (req,res) =>{
  var user = req.body;
  console.log("signup:");
  console.log(user);
  var user_name = user.username;
  var password = user.password;
  try {
      await pool.query(`INSERT INTO users(user_name, user_password) VALUES ("${user_name}", "${password}")`)
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async(req,res) => {
  var user = req.body;
  console.log("login:");
  console.log(user);
  var username = user.username;
  var password = user.password;
  console.log(username)
  console.log(password)
  var success = false;
  try {
      var response = await pool.query('SELECT * FROM users where user_name=? AND user_password=?', [username, password]);
      console.log(response);
      let unsecure_user = response[0][0]
      console.log(unsecure_user);
      if (unsecure_user)
      {
        user = {username:unsecure_user.user_name, 
          id:unsecure_user.user_id,
          image:unsecure_user.user_image
        }
        success = true;
        session.username = user.username;
        session.user_id = user.id;
        session.user_image = user.image
        console.log(session.username);
      }
  } catch (err) {
    console.log(err);
  }
  console.log("login end");
  res.json(user);
})

//gets the current user session and sends it as json
app.get("/user", async (req,res) => {
  let id = session.user_id;
  console.log("User requested:");
  var user_db = await pool.query("SELECT * FROM users WHERE user_id = ?", [id]);
  console.log(user_db);
  let user = user_db[0][0].user_name;
  let image = user_db[0][0].user_image
  let bio = user_db[0][0].user_bio;
  let user_o = {user, image, id}
  console.log("user_o:");
  console.log(user_o);

  res.json({
    user:{username:user, id:id, image:image, bio:bio}
  });
  console.log("user end");
})

app.put("/user-image", async(req,res)=>{
  let user_id = session.user_id;
  let user_image = req.body.image;
  let user_bio = req.body.bio;
  console.log("putting image");
  console.log(user_image);

  try {
    pool.query("UPDATE users SET user_image = ?, user_bio = ? WHERE user_id = ?", 
      [user_image, user_bio, user_id]);
    session.user_image = user_image;
  } catch (err) {
    console.log(err);
  }
});

app.get("/recipes", async(req,res) => {
  // read query parameters
  const sortField = req.query.sort === 'id' ? 'id' : 'meal_name';
  const sortOrder = req.query.order === 'desc' ? 'desc' : 'asc';

  // fetch from the DB
  var recipes = await pool.query(
    `SELECT * FROM meals ORDER BY ${sortField} ${sortOrder}`
  );
  recipes = recipes[0];
  console.log(recipes)
  res.json({recipes});
});


//gets recipes off of user id
app.get("/user-recipes", async(req,res) => {
  var user = {id:session.user_id, username:session.username};
  var recipes = await pool.query("SELECT * FROM meals WHERE poster_id=?", [user.id]);
  console.log(recipes);

  recipes = recipes[0];
  console.log(recipes);

  res.json({recipes, user});
  console.log("end of user-recipes")
});

// creates a new recipe in the database
app.post("/recipe", async(req,res) => {
  var recipe = req.body;
  console.log(recipe);
  var {title, ingredients, instructions, image, date} = recipe;
  var user = {id:session.user_id, username:session.username};
  console.log(user)
  var success = "unsuccessful";

  try {
    success = await pool.query("INSERT INTO meals (meal_name, meal_ingredients, meal_instructions, meal_image, poster_id, poster_name, meal_date) VALUES (?, ?, ?, ?, ?, ?, ?);", [title, ingredients, instructions, image, user.id, user.username, date]);
    console.log(success)
    var meal_id = success[0].insertId;

  } catch (err) {
    console.log(err);
  }
  console.log(success);
  console.log("end of POST recipe")
})

// recipe update (TODO TESTING)
app.put("/recipes/:id", async (req, res) => {
  const id = req.params.id;
  const { meal_name, meal_ingredients, meal_instructions, meal_image } = req.body;

  try {
    // Update recipe
    await pool.query(
      "UPDATE meals SET meal_name = ?, meal_ingredients = ?, meal_instructions = ?, meal_image = ? WHERE id = ?",
      [meal_name, meal_ingredients, meal_instructions, meal_image, id]
    );

    // Fetch updated recipe to return
    const [updated] = await pool.query("SELECT * FROM meals WHERE id = ?", [id]);

    return res.json(updated[0]);  // send updated recipe back
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error updating recipe" });
  }
});

/*
app.put("/recipes/:id", async(req,res) => {
  var id = req.params.id;
  var recipe = req.body;
  console.log(`Updating recipe with ID: ${id}`);
  console.log(recipe);
  var {title, ingredients, instructions, image} = recipe; 
  try {
    await pool.query("UPDATE meals SET meal_name = ?, meal_ingredients = ?, meal_instructions = ?, meal_image = ? WHERE meal_id = ?", [title, ingredients, instructions, image, id]);
    res.status(200).send({ message: "Recipe updated successfully" });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating recipe" });
  }
  res.json(updated)
});
*/

// recipe delete (TODO TESTING)
app.delete("/recipes/:id", async(req,res) => {
  var id = req.params.id;
  console.log(`Deleting recipe with ID: ${id}`);
  try {
    await pool.query("DELETE FROM meals WHERE id = ?", [id]);
    res.status(200).send({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error deleting recipe" });
  } 
});

app.post("/rating", async(req,res) => {
  var {score, rating, meal_id} = req.body;
  var user_id = session.user_id;
  console.log("posting recipe")

  console.log(req.body)
  console.log("user id:")
  console.log(user_id)

  try {
    var success = await pool.query('INSERT INTO rating (score, rating, user_id, meal_id) values (?, ?, ?, ?);',
      [score, 
        rating, 
        user_id,
        meal_id
      ]);

  }catch (err) {
    console.log(err);
  }
});

app.get("/rating/:meal_id", async(req,res) => {
  var meal_id = req.params.meal_id;
  console.log(req.params);
  console.log(meal_id);

  try {
    //get the rating from db
    var rating = await pool.query("select * from rating where meal_id = ?", [meal_id]);
    console.log(rating)
    rating = rating[0];
    var average = 0, count = 0;
    for (var index in rating) {
      count +=1;
      average += rating[index].score;
    }
    average = average/count;
    console.log(average)
    //send rating to frontend
    res.json({average:average});
  } catch (err){
    console.log(err)
  }
});

app.post("/favorite", async(req,res) => {
  let meal_id = req.body.id;
  let user_id = session.user_id;
  try {
    pool.query("INSERT INTO favorites (meal_id, user_id) VALUES (?, ?)", [
      meal_id,
      user_id
    ])
  } catch (err) {
    console.log(err);
  }
});

app.get("/favorites", async (req,res)=>{
  let user_id = session.user_id;
  try {
    var favorites = await pool.query("SELECT * FROM favorites as f join (SELECT * FROM meals) as m on m.id = f.meal_id WHERE f.user_id = ?;", 
      [
        user_id
      ]
    );
    favorites = favorites[0];
    console.log(favorites)
    res.json({favorites:favorites});
  }catch (err) {
    console.log(err);
  }
});

app.delete("/favorites", async(req,res) => {
  console.log(req.body);

  let favorite_id = req.body.favorite_id;

  try {
    var query_res = await pool.query("DELETE FROM favorites WHERE fave_id = ?;", [favorite_id])
    console.log(query_res)

  }catch (err) {
    console.log(err);
  }
});

// create the server
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});

