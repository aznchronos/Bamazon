drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int not null,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price float(14, 2) null,
    stock_quantity int not null,
    primary key (item_id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity)
values
(1, "Potatoes 1lbs", "Grocery", 2.99, 99),
(2, "Blinksys 5 Port 1GBPS Network Switch", "Computer", 37.85, 150),
(3, "Bamazon Echo (2nd Generation", "Bamazon Devices & Accessories", 149.99, 125),
(4, "BP-Link Modem", "Computer", 79.99, 75),
(5, "Bead Bool Blu-Ray", "Movies & TV", 24.99, 333),
(6, "Bamaha 76-Key Portable Keyboard", "Musical Instruments", 249.99, 50),
(7, "Shrek 5: The Shrekening Blu-Ray", "Movies & TV", 19.99, 45),
(8, "Carrots", "Grocery", 1.99, 80),
(9, "Bamsung B10+ 256gb", "Cell Phones & Accessories", 750.00, 63),
(10, "Bark Souls 3", "Video Games", 29.99, 13),
(11, "Shrek 6: The Shrekinator Blu-Ray", "Movies & TV", 19.99, 17),
(12, "Bastlevania: The Remake", "Video Games", 29.99, 69);

select * from products;

update products
set product_name = "1lbs Potatoes"
where "Potatoes 1lbs";