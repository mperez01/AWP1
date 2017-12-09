"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const daoUsers = require("./dao_users");
const daoFriends = require("./dao_friends");
const mysqlSession = require("express-mysql-session");
const session = require("express-session");
const multer = require("multer");
const MySQLStore = mysqlSession(session);
const ficherosEstaticos = path.join(__dirname, "public");
const app = express();
const upload = multer({ dest: path.join(__dirname, "profile_imgs") });
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
let daoF = new daoFriends.DAOFriends(pool);

function identificacionRequerida(request, response, next) {

    if (request.session.currentUserId !== undefined) {
        response.locals.user_id = request.session.currentUserId;
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
    daoU.isUserCorrect(request.body.email, request.body.pass, (err, id) => {
        if (err) {
            console.error(err);
            response.redirect("/login.html");
        }
        else {
            if (id > 0) {
                console.log("ID del usuario = " + id);
                request.session.currentUserId = id;
                response.redirect("/my_profile");
            }
            else {
                response.setFlash("Dirección de correo electronico y/o contraseña no válidos");
                response.redirect("/login.html");
            }
        }
    })
});

app.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/login.html");
});
app.get("/imagenUsuario/:id", (request, response) => {
    console.log("imagenID:" + request.params.id);
    if(request.params.id === null ||request.params.id==='' || request.params.id===undefined) {
            response.status(200);
            response.sendFile(__dirname + '/public/img/NoProfile.png');
    }else{
        response.sendFile(path.join(__dirname, "profile_imgs", request.params.id));
    }

});
app.get("/imagenUsuario", (request, response) => {
    response.status(200);
    response.sendFile(__dirname + '/public/img/NoProfile.png');
});

app.get("/new_user.html", (request, response) => {
    response.render("new_user");
})

app.post("/new_user", upload.single("uploadedfile"), (request, response) => {
    let imgName;
    if (request.file) { // Si se ha subido un fichero
        console.log(`Fichero guardado en: ${request.file.path}`);
        console.log(`Tamaño: ${request.file.size}`);
        console.log(`Tipo de fichero: ${request.file.mimetype}`);
        imgName = request.file.filename;
        console.log('nameFile' + request.file.filename);
    }
    if (request.body.date === '') {
        request.body.date = null;
    }
    daoU.insertUser(request.body.email, request.body.password, request.body.name,
        request.body.gender, request.body.date, imgName, (err, id) => {
            if (err) {
                console.error(err);
            } else {
                request.session.currentUserId = id;
                response.redirect("/my_profile");
            }
        });
})

app.get("/my_profile", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        response.render("my_profile", { user: usr });
    });
});


app.get("/modify_profile", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        response.render("modify_profile", { user: usr });
    });
});

app.post("/modify", identificacionRequerida, upload.single("uploadedfile"), (request, response) => {
    response.status(200);
    var img;
    if (request.file) { // Si se ha subido un fichero
        console.log(`Fichero guardado en: ${request.file.path}`);
        console.log(`Tamaño: ${request.file.size}`);
        console.log(`Tipo de fichero: ${request.file.mimetype}`);
        img = request.file.filename;
        console.log('nameFile' + img);
    } else {
        img = request.session.userImg;
    }
    if (request.body.date === '') {
        request.body.date = null;
    }
    daoU.modifyUser(request.session.currentUserId, request.body.email, request.body.password, request.body.name,
        request.body.gender, request.body.date, img, (err) => {
            if (err) {
                console.error(err);
            } else {
                response.redirect("/my_profile");
            }
        });

});

app.get("/friends", identificacionRequerida, (request, response) => {
    console.log("Aqui, en aimgos, estamos")
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        daoF.getFriendList(request.session.currentUserId, (err, frd) => {
            response.render("friends", { user: usr, friends: frd, id: request.session.currentUserId });
        })
    });
})

app.post("/deleteFriend", identificacionRequerida, (request, response) => {
    daoF.deleteFriend(request.body.id, request.session.currentUserId, (err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Peticion rechazada")
            response.redirect("/friends");
        }
    })
    )
})

app.post("/addFriend", identificacionRequerida, (request, response) => {
    daoF.addFriend(request.body.id, request.session.currentUserId, (err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Peticion aceptada")
            response.redirect("/friends");
        }
    })
    )
})

app.get("/friendImg", identificacionRequerida, (request, response) => {
    let img;
    img = request.body.userId;
    console.log(img);
    if (img === null || img === '' || img === undefined) {
        response.status(200);
        response.sendFile(__dirname + '/public/img/NoProfile.png');
    } else {
        response.sendFile(__dirname + '/profile_imgs/' + img);
    }
    request.session.userImg = img;
})

app.get("/searchName", identificacionRequerida, (request, response) => {

    daoF.searchByName(request.query.nombre, (err, list) => {
        if (err) {
            console.error(err);
        }
        else {
            if (list.length !== 0) {
                daoU.getUserData(request.session.currentUserId, (err, usr) => {
                    response.render("search", { user: usr, list: list, id: request.session.currentUserId });
                })
            } else {
                //Mensaje flash aqui
                console.log("Nada encontrado")
                response.redirect("/friends");
            }
        }
    }
    )
})

app.post("/sendFriend", identificacionRequerida, (request, response) => {

    daoF.sendFriendship(request.body.id, request.session.currentUserId, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            //Mensaje flash (peticion enviada)
            console.log("Petición enviada")
           response.redirect("/friends");
        }
    })
})