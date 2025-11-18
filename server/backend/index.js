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
        user = {username:unsecure_user.user_name, id:unsecure_user.user_id}
        success = true;
        session.username = user.username;
        session.user_id = user.id;
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
  let user = session.username;
  let id = session.user_id;
  console.log("User requested:");
  console.log(user);

  res.json({
    user:{username:user, id:id}
  });
  console.log("user end");
})

app.get("/recipes", async(req,res) => {
  var recipes = await pool.query("SELECT * FROM meals");
  recipes = recipes[0];
  console.log(recipes)
  res.json({recipes});
})

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
  var {title, ingredients, instructions, image} = recipe;
  var user = {id:session.user_id, username:session.username};
  console.log(user)
  var success = "unsuccessful";


  try {
    success = await pool.query("INSERT INTO meals (meal_name, meal_ingredients, meal_instructions, meal_image, poster_id, poster_name) VALUES (?, ?, ?, ?, ?, ?);", [title, ingredients, instructions, image, user.id, user.username]);
  } catch (err) {
    console.log(err);
  }
  console.log(success);
  console.log("end of POST recipe")
})

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
