"use strict";

const mysql = require("mysql");
const config = require("js/config");
const daoUsers = require("js/dao_users");

const pool= mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
