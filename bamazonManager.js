var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

var data = [];
var data2 = [];
var departmentList = [];

start();
createTable();
createLowTable();

console.log("Hello Mr. Manager");

function start() {
    process.stdout.write('\033c')
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "\nList of Options:",
            choices: ["View Products for Sale", "View Low Inventory (Below 30)", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (res) {
        if (res.menu == "View Products for Sale") {
            viewTable();
            setTimeout(function () { MainMenu() }, 1000);
            // console.log("Got into 1")
        } else if (res.menu == "View Low Inventory (Below 30)") {
            viewTable2();
            setTimeout(function () { MainMenu() }, 1000);
            // console.log("Got into 2")
        } else if (res.menu == "Add to Inventory") {
            // console.log("Got into 3")
            AddToInventory();
        } else if (res.menu == "Add New Product") {
            // console.log("Got into 4")
            AddProduct();
        }
    })
};

function createTable() {
    data.splice(0, data.length);
    connection.query("Select * from products", function (err, res) {
        
        for (var i = 0; i < res.length; i++) {
            data.push({ id: res[i].item_id, desc: res[i].product_name, price: res[i].price, stock: res[i].stock_quantity, department: res[i].department_name });
            departmentList.push(res[i].department_name);
            // console.log("This is the department list: " +departmentList)
        }
    });
    return data;
};

function createLowTable() {
    data2.splice(0, data2.length);
    connection.query("Select * from products where stock_quantity < 30", function (err, res) {
        
        for (var i = 0; i < res.length; i++) {
            data2.push({ id: res[i].item_id, desc: res[i].product_name, price: res[i].price, stock: res[i].stock_quantity });
        }
    });
    return data2;
};

function viewTable() {
    process.stdout.write('\033c')
    var t = new Table;

    data.forEach(function (product) {
        t.cell('Product ID', product.id)
        t.cell('Description', product.desc)
        t.cell('Price, USD', product.price, Table.number(2))
        t.newRow()
    });
    console.log(t.toString());
    console.log("================================================================")
}

function viewTable2() {
    process.stdout.write('\033c')
    var t = new Table;
    // console.log("This is the data2: " + data2)
    if (data2.length < 1) {
        console.log("There are currently no low Inventory")
    } else {
        data2.forEach(function (product) {
            t.cell('Product ID', product.id)
            t.cell('Description', product.desc)
            t.cell('Price, USD', product.price, Table.number(2))
            t.newRow()
        });
        console.log(t.toString());
        console.log("================================================================")
    }
}

function AddToInventory(){
    viewTable();
    inquirer.prompt([
        {
            name: "choice",
            type: "number",
            message: "Which item are you adding to? (Enter Product ID)"
        },
        {
            name: "value",
            type: "number",
            message: "How many are you planning to add?"
        }
    ]).then(function(inv){
        // console.log("This is the inv" + inv.value);
        var temp = ((inv.choice) - 1);
        // console.log("This is the temp" + temp);
        inquirer.prompt([
            {  
                name: "check",
                type: "list",
                message: "\nYou are adding " + inv.value + " to " + data[temp].desc + "\nIs this correct?",
                choices: ["Yes", "No"]
            }
        ]).then(function(pass){
            if(pass.check == "Yes"){
                var newQuantity = (data[temp].stock += inv.value);
                console.log(newQuantity);
                connection.query(
                    "UPDATE products set ? where ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: inv.value
                        }
                    ]
                )
                createTable();
                setTimeout(function () { viewTable() }, 1000);
                inquirer.prompt([
                    {
                        name: "continue",
                        type: "list",
                        message: "Would you like to add more?",
                        choices: ["Yes", "No"]
                    }
                ]).then(function(more){
                    if(more.continue == "Yes"){
                        AddToInventory();
                    } else if(more.continue == "No"){
                        MainMenu();
                    }
                })
            } else if(pass.check == "No"){
                AddToInventory();
            }
        })
    })
}

function AddProduct(){
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What would you like to add? (Name of Product)"
        },
        {
            name: "productDepartment",
            type: "list",
            message: "Which department would this belong to?",
            choices: departmentList
        },
        {
            name: "productPrice",
            type: "number",
            message: "How much will you sell them for?"
        },
        {
            name: "productAmount",
            type: "number",
            message: "How many will you stock?"
        }
    ]).then(function (prod) {
        inquirer.prompt([
            {  
                name: "check",
                type: "list",
                message: "\nYou have input:" + "\nProduct Name: " + prod.productName + "\nDepartment: " + prod.productDepartment + "\nPrice: " + prod.productPrice + "\nStock: " + prod.productAmount + "\nIs this correct?",
                choices: ["Yes", "No"]
            }
        ]).then(function(check1){
            if(check1.check == "Yes"){
                connection.query(
                    "Insert Into products set ?",
                    {
                        product_name: prod.productName,
                        department_name: prod.productDepartment,
                        price: prod.productPrice,
                        stock_quantity: prod.productAmount,
                        product_sales: 0
                    }
                )
                createTable();
                setTimeout(function () { viewTable() }, 500);
                setTimeout(function() {inquirer.prompt([
                    {
                        name: "continue",
                        type: "list",
                        message: "Would you like to add more?",
                        choices: ["Yes", "No"]
                    }
                ]).then(function(check2){
                    if(check2.continue == "Yes"){
                        AddProduct();
                    } else if(check2.continue == "No"){
                        MainMenu();
                    }
                })}, 2000)
            } else if(check1.check == "No"){
                AddProduct();
            }
        })
    })
}

function MainMenu(){
    inquirer.prompt([
        {
            name: "main",
            type: "list",
            message: "Main Menu?",
            choices: ["Yes", "No"]
        }
    ]).then(function(check3){
        if(check3.main == "Yes"){
            start();
        } else if(check3.main == "No"){
            console.log("Have a nice day sir!");
            connection.end();
        }
    })
}