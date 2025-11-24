drop database if exists mealm8s;
CREATE database if not exists mealm8s;
use mealm8s;

drop table if exists none;

drop user "server"@"localhost";
create user "server"@"localhost" identified with caching_sha2_password by "D3l1siouS";
grant SELECT, INSERT, DELETE, UPDATE on *.* TO "server"@"localhost";

CREATE TABLE IF NOT EXISTS Users (
user_id INT primary key serial default value,
user_name varchar(255) unique,
user_password varchar(255) not null,
user_image varchar(255),
user_bio varchar(255)
);
insert into users (user_name, user_password) values ("greg", "greg1"), ("gumbo", "yummy");


CREATE TABLE IF NOT EXISTS Meals (
id INT Primary key serial default value,
meal_name VARCHAR(255) not null,
meal_image VARCHAR(255),
meal_ingredients VARCHAR(1023) not null,
meal_instructions VARCHAR(1023) not null,
meal_date date,
poster_id int Not NULL,
poster_name VARCHAR(255) REFERENCES users(user_name), 
FOREIGN KEY (poster_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS Rating (
id INT PRIMARY KEY SERIAL DEFAULT VALUE,
score INT,
rating VARCHAR(255),
user_id INT references users(user_id),
meal_id INT,
foreign key (meal_id) references meals(id)
);
CREATE TABLE IF NOT EXISTS favorites (
user_id int not null references users(user_id),
meal_id int not null references meals(meal_id),
fave_id int primary key serial default value
);
insert into rating (meal_id) values (2);

select * from meals;
select * from rating;
select * from users;
select * from favorites;

SELECT * FROM meals as m left join rating as r on r.meal_id = m.id ORDER BY m.id asc;

SELECT * FROM meals AS m WHERE m.meal_name LIKE "?%";

SELECT * FROM favorites as f join (SELECT * FROM meals) as m on m.id = f.meal_id WHERE f.user_id = 5;