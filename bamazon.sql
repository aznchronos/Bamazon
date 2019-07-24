drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int not null auto_increment,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price float(14, 2) null,
    stock_quantity int not null,
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values
("Potatoes 1lbs", "Grocery", 2.99, 99),
("Blinksys 5 Port 1GBPS Network Switch", "Computer", 37.85, 150),
("Bamazon Echo (2nd Generation", "Bamazon Devices & Accessories", 149.99, 125),
("BP-Link Modem", "Computer", 79.99, 75),
("Bead Bool Blu-Ray", "Movies & TV", 24.99, 333),
("Bamaha 76-Key Portable Keyboard", "Musical Instruments", 249.99, 50),
("Shrek 5: The Shrekening Blu-Ray", "Movies & TV", 19.99, 45),
("Carrots", "Grocery", 1.99, 80),
("Bamsung B10+ 256gb", "Cell Phones & Accessories", 750.00, 63),
("Bark Souls 3", "Video Games", 29.99, 13),
("Shrek 6: The Shrekinator Blu-Ray", "Movies & TV", 19.99, 17),
("Bastlevania: The Remake", "Video Games", 29.99, 69);

select * from products;

alter table products
add column product_sales int not null After stock_quantity;

create table departments (
	department_id int not null auto_increment,
    department_name varchar(50) null,
    over_head_costs float(14,2) not null,
    primary key (department_id)
)

-- select * from products
-- where stock_quantity < 30;