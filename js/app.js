"use strict";

const mysql = require("mysql");
const config = require("./config");
const daoUsers = require("./dao_users");

const pool= mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUsers = new daoUsers.DAOUsers(pool);
daoUsers.isUserCorrect("user", "pass", (err, result) => {
    if (err) {
        console.error(err);
    } else if (result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
});