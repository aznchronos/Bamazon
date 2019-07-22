drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int not null,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price float(14, 2) null,
    stock_quantity int not null
);

select * from products;