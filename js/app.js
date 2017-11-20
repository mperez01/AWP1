"use strict";

const mysql = require("mysql");
const config = require("./config");
const daoUsers = require("./dao_users");
const express = require("express");

//----------------------
const app = express();
//----------------------

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

app.get("/", (request, response) => {
    response.status(200);
    response.type("text/plain; charset=utf-8"); 
    response.end("Directorio raiz");
});

app.get("/index.html", (request, response) => {
    response.status(200);
    response.type("text/plain; charset=utf-8"); 
    response.end("Aqui se muestra index.html");
});

app.listen(3000, (err) => {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});