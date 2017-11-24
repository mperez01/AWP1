"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "public"))); //no muy seguro de lo que hace esto
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/crear_usuario.html", (request, response) => { //meterlo en app.js?
    var email = request.body.email;
	var password = request.body.password;
	var name = request.body.name;
	var gender = request.body.gender;
	var dateOfBirth = request.body.dateOfBirth;
	var image = request.body.image;
	insertUser(email,password,name,gender,dateOfBirth,image,/*callback*/); //seria desde el DAOUSER???
    response.end();
});

insertUser(email,password,name,gender,dateOfBirth,image,callback){ //dentro de daouser
	 this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query(INSERT INTO user (email, password, name, gender, dateOfBirth, image) VALUES (?,?,?,?,?,?)", [email, password, name,gender,dateOfBirth,image],
                function (err, resultado) {
                    if (err) { callback(err); return; }
                    connection.release();
                })
        }
}