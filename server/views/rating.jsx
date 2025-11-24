import react, { useEffect } from "react"
import React, { useState } from "react";

export function Rating(meal_id) {
  const [score, setScore] = useState(0);
  const [rating_avg, setRatingAvg] = useState(0);

  meal_id = meal_id.meal_id;
  console.log(meal_id)


  useEffect(() => {
    fetch(`http://localhost:8000/rating/${meal_id}`, {method:"GET"})
    .then((data) => data.json())
    .then((rating_data) => {
      console.log(rating_data);
      setRatingAvg(rating_data.average)
    });
  }, []); // <- the [] prevent useEffect from triggering multiple times

  //forces max and min range
  function ratingChanged(changed){
    if(changed.target.value > 5)
    {
      setScore(5);
    }
    else if (changed.target.value < 0)
    {
      setScore(0);
    }
    else {
      setScore(changed.target.value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (score == null) setScore(0);
    var rating = {score, meal_id}
    console.log(rating);
    fetch("http://localhost:8000/rating", {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify(rating)
    })
  }

  return (
    <div>
      <label>Ratings: </label> {rating_avg}/5
      <form onSubmit={handleSubmit}>
        <label>Rate:<input type="number" value={score}
        onChange={ratingChanged}/>/5 </label>
        <label>Explain?<textarea ></textarea></label>
      </form>
    </div>
  )
}