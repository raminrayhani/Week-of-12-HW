-- Create the database Bamazon_DB and specified it for use.
CREATE DATABASE Bamazon_DB;
USE Bamazon_DB;

-- Create the table of products.
CREATE TABLE Products (
	ItemID INT(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    DepartmentName VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY(ItemID)
);

-- Insert a set of products.
INSERT INTO Products 
	(ProductName,DepartmentName,Price,StockQuantity)
VALUES
	('iPhone 7','Cellphones',849.99,300),
    ('iPhone 7 Plus','Cellphones',999.99,75),
    ('Galaxy S8','Cellphones',899.99,150),
    ('Levis Pants','Clothing',69.99,200),
    ('Tommy T-shirt','Clothing',29.99,500),
    ('Samsung Refrigerator','Appliances',1699.99,10),
    ('Romax Watch', 'Jewellery', 900, 100),
    ('Ring', 'Jewellery',2250,50),
    ('Piano','Instruments',2199.99,10),
    ('Violin','Instruments',899.99,12),
    ('gbox','Electronics',99.99,10000),
    ('LG LED TV','Electronics',699.99,175);

-- Create the table of departments.    
CREATE TABLE Departments (
	DepartmentID INT(5) UNSIGNED AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(255) NOT NULL,
    OverheadCosts DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    ProductSales DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY(DepartmentID)
);

-- Insert a set of departments.
INSERT INTO Departments 
	(DepartmentName,OverHeadCosts)
VALUES
	('Cell Phones',700),
    ('Clothing',100),
    ('Appliances',5000),
    ('Jewellery',1200),
    ('Instruments',1000),
    ('Electronics',500);
