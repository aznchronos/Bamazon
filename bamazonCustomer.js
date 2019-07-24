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

start();
stock();

function start() {
    viewTable();
    setTimeout(function () { action() }, 1000);
};

function action() {
    console.log("Would you like to Purchase an item from our store?");
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then(function (res) {
        if (res.action == "Yes") {
            search();
        } else if (res.action == "No") {
            console.log("Thank you for your visit");
            connection.end();
        }
    })
};

function search() {
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "Please input the ID of the item that you wish to purchase"
        }
    ]).then(function (res) {
        connection.query(
            "Select * from products where ?",
            {
                item_id: res.id
            },
            function (err, result) {
                // if (err) throw err;
                // console.log("This was the response " + res);
                if (result === null) {
                    console.log("There was an error in this program");
                    connection.end();
                } else {
                    console.log("\n")
                    console.log("Item ID: " + result[0].item_id);
                    console.log("Product Name: " + result[0].product_name);
                    console.log("Price: " + result[0].price + "\n");
                    inquirer.prompt([
                        {
                            name: "check",
                            type: "list",
                            message: "Is this what you were looking for?",
                            choices: ["Yes", "No"]
                        }
                    ]).then(function (res) {
                        if (res.check == "Yes") {
                            inquirer.prompt([
                                {
                                    name: "quantity",
                                    type: "number",
                                    message: "How many would you like to purchase?",
                                    // validate: function(value) {
                                    //     if(isNaN(value) === false) {
                                    //         return true;
                                    //     }
                                    //     return false;
                                    // }
                                }
                            ]).then(function (total) {
                                // console.log("this is the answer" + res.quantity)
                                if (total.quantity > 0) {
                                    // console.log("Price" + result[0].price);
                                    // console.log("Amount" + total.quantity)
                                    console.log("\nYour total comes to $" + ((result[0].price) * total.quantity).toFixed(2) + "\n");
                                    inquirer.prompt([
                                        {
                                            name: "dcheck",
                                            type: "list",
                                            message: "You wish to purchase " + total.quantity + " " + result[0].product_name + "(s), right?",
                                            choices: ["Yes", "No"]
                                        }
                                    ]).then(function (res2) {
                                        if (res2.dcheck == "No") {
                                            inquirer.prompt([
                                                {
                                                    name: "continue",
                                                    type: "list",
                                                    message: "\nWould you like to start over?",
                                                    choices: ["Yes", "No"]
                                                }
                                            ]).then(function (dcheck2) {
                                                if (dcheck2.continue == "Yes") {
                                                    viewTable();
                                                    setTimeout(function () { search() }, 1000);
                                                } else if (dcheck2.continue == "No") {
                                                    console.log("Thanks for your time! Please come again")
                                                    connection.end()
                                                }
                                            })
                                        } if (res2.dcheck == "Yes") {
                                            var newstock = (result[0].stock_quantity - total.quantity);
                                            if (newstock > 0) {
                                                var newstock = (result[0].stock_quantity - total.quantity);
                                                // console.log("current stock total " + result[0].stock_quantity)
                                                console.log("Stock Left: " + newstock);
                                                connection.query("Update products set ? where ?",
                                                    [
                                                        {
                                                            stock_quantity: newstock
                                                        },
                                                        {
                                                            item_id: result[0].item_id
                                                        }
                                                    ]
                                                );
                                                inquirer.prompt([
                                                    {
                                                        name: "more",
                                                        type: "list",
                                                        message: "\nWould you like to purchase more items?",
                                                        choices: ["Yes", "No"]
                                                    }
                                                ]).then(function (final) {
                                                    if (final.more == "Yes") {
                                                        viewTable();
                                                        setTimeout(function () { search() }, 1000);
                                                    } else if (final.more == "No") {
                                                        console.log("Thanks for your time! Please come again")
                                                        connection.end()
                                                    }
                                                })
                                            } else if (newstock < 0){
                                                console.log("Sorry. It seems that we don't have enough items in stock for your order");
                                                inquirer.prompt([
                                                    {
                                                        name: "new",
                                                        type: "list",
                                                        message: "\nWould you like to purchase something else?",
                                                        choices: ["Yes", "No"]
                                                    }
                                                ]).then(function (apology) {
                                                    if (apology.new == "Yes") {
                                                        viewTable();
                                                        setTimeout(function () { search() }, 1000);
                                                    } else if (apology.new == "No") {
                                                        console.log("Thanks for your time! Please come again")
                                                        connection.end()
                                                    }
                                                })
                                            }
                                        }

                                    }
                                    )
                                } else if (res.quantity == 0) {
                                    console.log("I see you decided not to make a purchase. Please try our services again if you wish to make a purchase.");
                                    connection.end();
                                } else {
                                    console.log("Thanks for testing out my code :)")
                                    connection.end();
                                }
                            })
                        } else if (res.check == "No") {
                            viewTable();
                            setTimeout(function () { search() }, 1000);
                        }
                    })
                }
            }
        )
    })
}

// function amount() {

// }

function stock() {
    connection.query("Select * from products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            data.push({ id: res[i].item_id, desc: res[i].product_name, price: res[i].price });
        }
        viewTable();
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