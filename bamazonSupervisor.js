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

createTable();
start();

function start(){
    inquirer.prompt([
        {
            name: "init",
            type: "list",
            message: "Hello Mr. Supervisor, what would you like to do today?",
            choices: ["View Product by Sales by Department", "Create a New Department"]
        }
    ]).then(function(res){
        if(res.init == "View Product by Sales by Department"){
            inquirer.prompt([
                {
                    name: "which",
                    type: "list",
                    message: "Which Department Will You Look Into Today?",
                    choices: departmentList
                }
            ]).then(function(res2){
                connection.query(
                    "Select * from products set department_name where ?"),
                    [
                        {
                            department_name: res2.which
                        }
                    ]
            }),function(err, res){
                data.splice(0, data.length)
                for(var i = 0; i < res.length; i++){
                    data.push({ id: res[i].item_id, desc: res[i].product_name, price: res[i].price, stock: res[i].stock_quantity, department: res[i].department_name });
                }
            }
        } else if(res.init == "Create a New Department"){

        }
    })
}

function createTable() {
    data.splice(0, data.length);
    connection.query("Select * from products", function (err, res) {
        
        for (var i = 0; i < res.length; i++) {
            data.push({ id: res[i].item_id, desc: res[i].product_name, price: res[i].price, stock: res[i].stock_quantity, department: res[i].department_name });
            departmentList.push(res[i].department_name);
            console.log("This is the department list: " +departmentList)
        }
    });
    return data;
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