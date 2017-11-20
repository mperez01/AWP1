"use strict";

const mysql = require("mysql");
const http = require("http");
const express = require("express");
const config = require("./config");
const daoUsers = require("./dao_users");


const pool= mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUser = new daoUsers.DAOUsers(pool);
daoUser.isUserCorrect("user", "pass", (err, result) => {
    if (err) {
        console.error(err);
    } else if (result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
    pool.end();
});