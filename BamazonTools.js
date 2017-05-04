var chalk = require('chalk');
var accounting = require('accounting');

var createQuery = function(col) {
  var query = 'SELECT ';
  for (var i = 0; i < col.length; i++) {
    query += col[i].split(' ').join('') + ' AS "' + col[i] + '"';
    if (i !== col.length-1) {
      query += ', ';
    } else {
      query += ' ';
    }
  }
  query += 'FROM Products';
  return query;
};

var printData = function(res, col) {
  // Get length of column header
  var colLengths = [];
  for (var h = 0; h < col.length; h++) {
    colLengths.push(col[h].split('').length);
  }
  // Loop through each row
  for (var i = 0; i < res.length; i++) {
    // Loop through each column
    for (var j = 0; j < col.length; j++) {
      var length;
      // Check to see if datatype is number, if so turn to string
      if (typeof res[i][col[j]] === 'number') {
        // If price, overhead, sales, or profit add $ and format properly
        if (col[j] === 'Price' || col[j] === 'Overhead Costs' || col[j] === 'Product Sales' || col[j] === 'Total Profit') res[i][col[j]] = accounting.formatMoney(res[i][col[j]]);
        length = res[i][col[j]].toString().split('').length;
      } else {
        length = res[i][col[j]].split('').length;
      }
      // Find the longest string length
      if (colLengths[j] < length) colLengths[j] = length;
    }
  }
  // Loop through each row
  for (var k = 0; k < res.length; k++) {
    var header = '| ';
    var divider = '+';
    var row = '| ';
    // Loop through each column
    for (var l = 0; l < col.length; l++) {
      var spacerHeader = '';
      var spacer = '';
      for (var m = 0; m < colLengths[l]; m++) {
        // Add beginning dashed space
        if (m === 0) divider += '-';
        // Fill in divider
        divider += '-';
        // Check to see if datatype is number, if so turn to string
        var length;
        if (typeof res[k][col[l]] === 'number') {
          length = res[k][col[l]].toString().split('').length;
        } else {
          length = res[k][col[l]].split('').length;
        }
        // Fill in spaces
        if (m >= col[l].split('').length && k === 0) spacerHeader += ' ';
        if (m >= length) spacer += ' ';
        // Add ending corner
        if (m === colLengths[l] - 1) divider += '-+';
      }
      if (k === 0) {
        // Add header
        header += chalk.bold.cyan(col[l]);
        // Add header spacing, end and beginning of new one
        header += spacerHeader + ' | ';
      }
      // Add row
      row += chalk.yellow(res[k][col[l]]);
      // Add row spacing, end and beginning of new one
      row += spacer + ' | ';
    }
    // Add header
    if (k === 0) {
      console.log(chalk.bold.blue('\nCurrent Items on Sale\n'));
      console.log(divider);
      console.log(header);
      console.log(divider);
    }
    // Add rows
    console.log(row);
    console.log(divider);
  }
  console.log('');
};

var validateQuantity = function(value) {
  if (value>=0 && value<=65535 && value%1===0 && value.indexOf(' ')<0 && value.indexOf('.')<0) {
    return true;
  } else {
    return 'Please type a whole number between 0 and 65535 without a period or extra spaces';
  }
}

var validateMoney = function(value) {
  format = accounting.formatMoney(value, "", 2, "",".")
  if (format !== '0.00' && Number(format) <= 99999999.99) {
    return true;
  } else {
    return 'Please type a number greater than 0 and less than or equal to 99999999.99';
  }
}

exports.createQuery = createQuery;
exports.printData = printData;
exports.validateQuantity = validateQuantity;
exports.validateMoney = validateMoney;