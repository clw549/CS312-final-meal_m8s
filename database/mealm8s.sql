drop database if exists mealm8s;
CREATE database if not exists mealm8s;
use mealm8s;

drop user "server"@"localhost";
create user "server"@"localhost" identified with caching_sha2_password by "D3l1siouS";
grant SELECT, INSERT, DELETE, UPDATE on *.* TO "server"@"localhost";

CREATE TABLE IF NOT EXISTS Users (
user_id INT primary key serial default value,
user_name varchar(255),
user_password varchar(255) not null
);
insert into users (user_name, user_password) values ("greg", "greg1"), ("gumbo", "yummy");

CREATE TABLE IF NOT EXISTS Meals (
id INT Primary key serial default value,
meal_name VARCHAR(255) not null,
meal_image VARCHAR(255),
meal_ingredients VARCHAR(1023) not null,
meal_instructions VARCHAR(1023) not null,
poster_id int,
poster_name VARCHAR(255) REFERENCES users(user_name), 
FOREIGN KEY (poster_id) REFERENCES users(user_id)
);
select * from meals;
select * from users;