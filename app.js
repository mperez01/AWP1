"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const daoUsers = require("./dao_users");
const mysqlSession = require("express-mysql-session");
const session = require("express-session");
const multer = require("multer");
const MySQLStore = mysqlSession(session);
const ficherosEstaticos = path.join(__dirname, "public");
const app = express();
const multerFactory = multer();
//siempre debe estar
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "facebluff"
});

let pool = mysql.createPool({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});


app.use(express.static(ficherosEstaticos));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewareSession);

//app.use del flash
app.use((request, response, next) => {
    response.setFlash = (str) => {
        request.session.flashMessage = str;
    }
    response.locals.getFlash = () => {
        let mensaje = request.session.flashMessage;
        delete request.session.flashMessage;
        return mensaje;
    }
    next();
});

let daoU = new daoUsers.DAOUsers(pool);

function identificacionRequerida(request, response, next) {
    
      if (request.session.currentUser !== undefined) {
          response.locals.userEmail = request.session.currentUser;
          next();
      } else {
          response.redirect("/login.html");
      }
}

app.get("/", (request, response) => {
    response.redirect("/login.html");
});

app.get("/login.html", (request, response) => {
    response.status(200);
    response.render("login");
});

app.listen(3000, (err) => {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});

app.post("/login", (request, response) => {
    daoU.isUserCorrect(request.body.email, request.body.pass, (err, existe) => {      
        if (err) {
            console.error(err);
            response.redirect("/login.html");
        }
        else {
            if (existe === true) {
                request.session.currentUser = request.body.email;
                response.redirect("/my_profile");
            }
            else {
                response.setFlash("Dirección de correo electronico y/o contraseña no válidos");                
                response.redirect("/login.html");
            }
        }
    })
});

app.get("/logout", (request, response) => {
    
    request.session.destroy();
    response.redirect("/login.html");
});

app.get("/imagenUsuario",(request,response)=>{
    daoU.getUserImageName(request.session.currentUser,(err,img)=>{
        if(err){
            console.error(err);
        }else{
            if(img === null ||img==='') {
                response.status(200);
                response.sendFile(__dirname + '/public/img/NoProfile.png');
            }else{
                response.sendFile(__dirname + '/profile_imgs/'+ img);
            }
        }  
        request.session.userImg = img;
    });
});

app.get("/new_user.html", (request, response) => {
    response.render("new_user");
})

app.post("/new_user", (request, response) => {
    //Si no se introduce nada en fecha, NULL
    if (request.body.date === '') {
        request.body.date = null;
    }
    daoU.insertUser(request.body.email, request.body.password, request.body.name,
         request.body.gender, request.body.date, request.body.uploadedfile, (err) => {
             if (err) {
                 console.error(err);
             } else {
                 request.session.currentUser = request.body.email;
                 response.redirect("/my_profile");
             }
         });
})

app.get("/my_profile",identificacionRequerida,(request,response)=>{
    response.status(200);
    daoU.getUserData(request.session.currentUser,(err,usr)=>{
        response.render("my_profile",{user:usr});
    });
});


app.get("/modify_profile",identificacionRequerida,(request,response)=>{
    response.status(200);
    daoU.getUserData(request.session.currentUser,(err,usr)=>{
        response.render("modify_profile",{user:usr});
    });
});

app.post("/modify",identificacionRequerida,(request,response)=>{
    response.status(200);
    var img;
    if((request.body.uploadedfile===null)||(request.body.uploadedfile==="")||(request.body.uploadedfile===undefined)){
        img=request.session.userImg;
    }else{
        img=request.body.uploadedfile;
    }
        
        daoU.modifyUser(request.body.email, request.body.password, request.body.name,
            request.body.gender, request.body.date, img, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    response.redirect("/my_profile");
                }
        });
    
});

app.get("/friends", identificacionRequerida, (request, response) => {
    daoU.getUserData(request.session.currentUser,(err,usr)=>{
        response.render("friends",{user:usr});
    });
})