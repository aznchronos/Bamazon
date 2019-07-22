var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

start();

function start(){
    connection.query("Select * from products", function (err, res){
        console.log("=======================================================\n");
        for(var i = 0; i < res.length; i++){
            if(res[i].item_id < 10){
                console.log("||  " + res[i].item_id + " || " + res[i].product_name + "  $" + res[i].price);    
            } else{
                console.log("|| " + res[i].item_id + " || " + res[i].product_name + "  $" + res[i].price);
            }
        }
        console.log("=======================================================\n");
        
    });
    action();
}

function action(){
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "Would you like to Purchase an item from our store?",
            choices: ["Yes", "No"]
        }
    ]).then(function(res){
        if(res.action == "Yes"){
            inquirer.prompt([
                {
                    name: "id",
                    type: "number",
                    message: "Please input the ID of the item that you wish to purchase"
                }
            ]).then(function(res){
                connection.query(
                    "Select * from products where ?",
                    {
                        item_id: res.id
                    },
                    function(err,res){
                        // if (err) throw err;
                        // console.log("This was the response " + res);
                        if (res === null){
                            console.log("There was an error in this program");
                            connection.end();
                        } else {
                            console.log(res[0].item_id);
                        }
                    }
                )
            })
        } else if (res.action == "No"){
            console.log("Thank you for your visit");
            connection.end();
        }
    })
}