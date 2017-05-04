var mysql = require('mysql');
var inquirer = require('inquirer');
var accounting = require('accounting');
var chalk = require('chalk');
var Bamazon = require('./BamazonTools');

// connect to mysql database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ramin62",
  database: "Bamazon_DS"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

// Allow user (manager) to choose from menu options.
var start = function() {
  console.log('');
	inquirer.prompt([
	  {
	    type: 'list',
	    name: 'menu',
	    message: 'What would you like to do?',
	    choices: [
	    	'1) View Products for Sale',
	    	'2) View Low Inventory',
	    	'3) Add to Inventory',
	    	'4) Add New Product'
	    ]
	  }
	]).then(function (answers) {
	  switch(answers.menu) {
	  	case '1) View Products for Sale': viewProducts(); break;
	  	case '2) View Low Inventory': viewLowInvent(); break;
	  	case '3) Add to Inventory': addInvent(); break;
	  	case '4) Add New Product': addProducts(); break;
	  }
	});
};

// Select columns you want to show.
var col = ['Item ID', 'Product Name', 'Price', 'Stock Quantity'];

// Query
var sendQuery = function(query,callback,params) {
	connection.query(query, params, function(err, res) {
    callback(res);
  });
}

// Prints the data and restarts after receiving data from query.
var printStart = function(res) {
	Bamazon.printData(res,col);
  // Reshow menu
	start();
}

// Function for handling view products option.
var viewProducts = function() {
	// Query for selecting all rows of certain columns
	var query = Bamazon.createQuery(col);
	sendQuery(query,printStart);
};

// Function for handling view low inventory option.
var viewLowInvent = function() {
	var query = Bamazon.createQuery(col);
	query += ' WHERE StockQuantity < 5';
	sendQuery(query,printStart);
};

// Function for handling view add inventory option.
var addInvent = function() {
	var inputQuantity;
	// Callback for after inquirer questions are asked
	var searchID = function(answers) {
  	var query = Bamazon.createQuery(col);
		query += ' WHERE ItemID = ?';
		inputQuantity = Number(answers.quantity);
		sendQuery(query,updateQuantity,answers.id);
  };
  
  // Calback after query of id is done.
	var updateQuantity = function(res) {
		var quantity = res[0]['Stock Quantity'] + inputQuantity;
		var query = 'UPDATE Products SET StockQuantity = ? WHERE ItemID = ?';
		var params = [quantity,res[0]['Item ID']];
		sendQuery(query,confirmed,params);
	};
	
	// Callback once stock quantity is updated.
	var confirmed = function(res) {
		console.log(chalk.bold.blue('\nCompleted adding stock to item!'));
		// Reshow menu
		start();
	}
	// Questions that call the functions listed above
	inquirer.prompt([{
    name: "id",
    type: "input",
    message: "What is the item ID of the product you would like to add stock?",
    validate: Bamazon.validate
  } , {
    name: "quantity",
    type: "input",
    message: "How many would you like to add?",
    validate: Bamazon.validate
  }]).then(searchID);
};

// Function for handling add products option.
var addProducts = function() {
	// Callback once answers are entered
	var insertQuery = function(answers) {
		var query = 'INSERT INTO Products (ProductName,DepartmentName,Price,StockQuantity) VALUES (?,?,?,?)';
		var formatPrice = accounting.formatMoney(answers.price, "", 2, "",".");
		var params = [answers.name, answers.deptname, formatPrice, Number(answers.quantity)];
		sendQuery(query,confirmed,params);
	}
	// Callback once stock quantity is updated.
	var confirmed = function(res) {
		console.log(chalk.bold.blue('\nCompleted adding additional item!'));
		// Reshow menu
		start();
	}
	// Questions that call the functions listed above
	inquirer.prompt([{
    name: "name",
    type: "input",
    message: "What is the name of the product you would like to add?"
  } , {
    name: "deptname",
    type: "input",
    message: "What is the department name of the product?"
  } , {
    name: "price",
    type: "input",
    message: "What is the price of the product?",
    validate: Bamazon.validateMoney
  } , {
    name: "quantity",
    type: "input",
    message: "What is the stock quantity of the product?",
    validate: Bamazon.validateQuantity
  }]).then(insertQuery);
};