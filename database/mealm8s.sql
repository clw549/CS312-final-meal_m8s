drop database if exists mealm8s;
CREATE database if not exists mealm8s;
use mealm8s;

CREATE TABLE IF NOT EXISTS Users (
user_id INT primary key serial default value,
user_name varchar(255)
);
insert into users (user_name) values ("greg"), ("gumbo");

CREATE TABLE IF NOT EXISTS Meals (
id INT Primary key serial default value,
meal_name VARCHAR(255),
meal_image VARCHAR(255),
poster_id int,
FOREIGN KEY (poster_id) REFERENCES users(user_id)
);
insert into Meals (meal_name, meal_image, poster_id) values (
"spaghetti",
"/",
1
);

select * from meals;
select * from users;

