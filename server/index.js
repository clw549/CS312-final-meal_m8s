import React from "react";
import express from "express";
import bodyParser from "body-parser";
import { LoginPage, SignupPage } from "./views/login.js";

const app = express();
const PORT = 8000;
const doctype = "<!DOCTYPE html>"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
  res.send(doctype + SignupPage() + LoginPage())
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});