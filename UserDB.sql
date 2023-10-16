-- Run this T-SQL script in SQL server

-- Create a User Database
CREATE DATABASE UserDatabase;
GO
USE UserDatabase;

-- Create a Users table
CREATE TABLE Users (
    -- UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) PRIMARY KEY,
    Password NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Phone NVARCHAR(15),
    Address NVARCHAR(255),
    RoleID INT NOT NULL
);

-- Create a Roles table
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL
);

-- Insert default roles
INSERT INTO Roles (RoleID, RoleName)
VALUES (1, 'Admin'), (2, 'User');
