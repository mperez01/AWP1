"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const daoUsers = require("./dao_users");
const daoFriends = require("./dao_friends");
const daoQuestions = require("./dao_questions");
const mysqlSession = require("express-mysql-session");
const session = require("express-session");
const multer = require("multer");
const MySQLStore = mysqlSession(session);

const expressValidator = require("express-validator");

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
app.use(expressValidator({
    customValidators: {
        //comprobamos que param no es solo espacios en blanco
        whiteSpace: function (param) {
            return /\S/.test(param);
        }
    }
}));

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
let daoQ = new daoQuestions.DAOQuestions(pool);

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

app.listen(3000, (err) => {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});

app.get("/login.html", (request, response) => {
    response.render("login", { errores: [], usuario: {} });
});

app.post("/login", (request, response) => {
    request.checkBody("email", "Dirección de correo vacía").notEmpty();
    request.checkBody("email", "Dirección de correo no válida").isEmail();
    request.checkBody("pass", "Contraseña vacía").notEmpty();
    request.checkBody("pass", "La contraseña debe tener entre 4 y 15 caracteres").isLength({ min: 4, max: 15 });
    request.getValidationResult().then((result) => {
        if (result.isEmpty()) {
            daoU.isUserCorrect(request.body.email, request.body.pass, (err, id) => {
                if (err) {
                    console.error(err);
                    response.redirect("/login.html");
                }
                else {
                    if (id > 0) {
                        request.session.currentUserId = id;
                        request.session.currentUserEmail = request.body.email;
                        response.redirect("/my_profile");
                    }
                    else {
                        response.setFlash("Dirección de correo electronico y/o contraseña no válidos");
                        response.redirect("/login.html");
                    }
                }
            })
        } else {
            var usuarioIncorrecto = {
                pass: request.body.pass,
                email: request.body.email,
            };
            response.render("login", { errores: result.mapped(), usuario: usuarioIncorrecto });
        }
    });
});

app.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/login.html");
});
app.get("/imagenUsuario/:id", (request, response) => {
    response.sendFile(path.join(__dirname, "profile_imgs", request.params.id));
    request.session.userImg = request.params.id;
});
app.get("/imagenUsuario", (request, response) => {
    response.status(200);
    response.sendFile(__dirname + '/public/img/NoProfile.png');
});

app.get("/new_user.html", (request, response) => {
    response.render("new_user", { errores: [], usuario: {} });
})

app.post("/new_user", upload.single("uploadedfile"), (request, response) => {
    //request.checkBody("name", "Nombre de usuario no válido").matches(/^[A-Z0-9]*$/i);
    request.checkBody("name", "Nombre de usuario vacío").notEmpty();
    request.checkBody("name", "Nombre no puede ser menor que 1 ni mayor que 50 caracteres").isLength({ min: 0, max: 50 });
    request.checkBody("name", "Nombre no puede ser espacio en blanco").whiteSpace();
    request.checkBody("email", "Dirección de correo no válida").isEmail();
    request.checkBody("email", "Dirección de correo vacía").notEmpty();
    request.checkBody("gender", "Sexo no seleccionado").notEmpty();
    request.checkBody("password", "La contraseña debe tener entre 4 y 15 caracteres").isLength({ min: 4, max: 15 });
    request.checkBody("password", "Contraseña vacía").notEmpty();
    request.getValidationResult().then((result) => {
        if (result.isEmpty()) {
            daoU.userExist(request.body.email, (err, email) => {
                if (err) {
                    console.error(err);
                }
                else {
                    if (email !== request.body.email) {
                        let imgName;
                        if (request.file) { // Si se ha subido un fichero
                            imgName = request.file.filename;
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
                            })
                    }
                    else {
                        response.setFlash("Dirección de correo electrónico en uso");
                        response.redirect("/new_user.html");
                    }
                }
            })
        } else {
            var usuarioIncorrecto = {
                email: request.body.email,
                password: request.body.password,
                name: request.body.name,
                gender: request.body.gender,
            };
            response.render("new_user", { errores: result.mapped(), usuario: usuarioIncorrecto });
        }
    });
})

app.get("/my_profile", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        } else {
            response.render("my_profile", { user: usr });
        }
    });
});


app.get("/modify_profile", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        } else {
            response.render("modify_profile", { user: usr, errores: [], usuario: {} });
        }
    });
});

app.post("/modify", identificacionRequerida, upload.single("uploadedfile"), (request, response) => {
    request.checkBody("name", "Nombre de usuario vacío").notEmpty();
    request.checkBody("name", "Nombre no puede ser menor que 1 ni mayor que 50 caracteres").isLength({ min: 0, max: 50 });
    request.checkBody("name", "Nombre no puede ser espacio en blanco").whiteSpace();
    request.checkBody("email", "Dirección de correo no válida").isEmail();
    request.checkBody("email", "Dirección de correo vacía").notEmpty();
    request.checkBody("gender", "Sexo no seleccionado").notEmpty();
    request.checkBody("password", "La contraseña debe tener entre 4 y 15 caracteres").isLength({ min: 4, max: 15 });
    request.checkBody("password", "Contraseña vacía").notEmpty();
    request.getValidationResult().then((result) => {
        if (result.isEmpty()) {
            daoU.userExist(request.body.email, (err, email) => {
                if (err) {
                    console.error(err);
                }
                else {
                    //Comprobamos que el correo sea el mismo, o si se ha cambiado, que no exista ya en la base de datos
                    if (request.session.currentUserEmail === request.body.email || email !== request.body.email) {
                        var img;
                        if (request.file) { // Si se ha subido un fichero
                            img = request.file.filename;
                        } else {
                            console.log("No hay cambio en imagen");
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
                                    //Cambiamos las cookies de sesion si hemos cambiado el email
                                    if (request.session.currentUserEmail !== request.body.email) {
                                        request.session.currentUserEmail = request.body.email;
                                    }
                                    response.setFlash("Modificaciones guardadas");
                                    response.redirect("/my_profile");
                                }
                            });
                    }
                    else {
                        response.setFlash("Dirección de correo electrónico en uso");
                        response.redirect("/modify_profile");
                    }
                }
            });
        } else {
            var usuarioIncorrecto = {
                email: request.body.email,
                password: request.body.password,
                name: request.body.name,
                gender: request.body.gender,
            };
            daoU.getUserData(request.session.currentUserId, (err, usr) => {
                if (err) {
                    console.error(err);
                } else {
                    response.render("modify_profile", { user: usr, errores: result.mapped(), usuario: usuarioIncorrecto });
                }
            });
        }
    });
});

app.get("/friends", identificacionRequerida, (request, response) => {

    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        } else {
            daoF.getFriendList(request.session.currentUserId, (err, frd) => {
                if (err) {
                    console.error(err);
                } else {
                    response.render("friends", {
                        user: usr, friends: frd, id: request.session.currentUserId,
                        errores: [], usuario: {}
                    });
                }
            })
        }
    });
})

app.post("/discardFriend", identificacionRequerida, (request, response) => {

    daoF.discardFriend(request.body.friendId, request.session.currentUserId, (err => {
        if (err) {
            console.error(err);
        }
        else {
            response.setFlash("Petición rechazada");
            response.redirect("/friends");
        }
    }))
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

    if (img === null || img === '' || img === undefined) {
        response.status(200);
        response.sendFile(__dirname + '/public/img/NoProfile.png');
    } else {
        response.sendFile(__dirname + '/profile_imgs/' + img);
    }
    request.session.userImg = img;
})

app.get("/searchName", identificacionRequerida, (request, response) => {

    request.checkQuery("nombre", "Debe introducir al menos un carácter para realizar la búsqueda").notEmpty();
    request.checkQuery("nombre", "La búsqueda no puede ser menor que 1 ni mayor que 50 caracteres").isLength({ min: 0, max: 50 });
    request.getValidationResult().then((result) => {
        if (result.isEmpty()) {
            daoF.searchByName(request.query.nombre, (err, list) => {
                if (err) {
                    console.error(err);
                }
                else {
                    if (list.length !== 0) {
                        daoF.getFriendList(request.session.currentUserId, (err, frd) => {
                            if (err) {
                                console.error(err);
                            } else {
                                daoU.getUserData(request.session.currentUserId, (err, usr) => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        frd.forEach(friend => {
                                            list.forEach(user => {
                                                if (friend.user_id === user.user_id) {
                                                    user.tieneRelacion = friend.status;
                                                }
                                            })
                                        })
                                        response.render("search", {
                                            user: usr, list: list,
                                            id: request.session.currentUserId, nombre: request.query.nombre
                                        });
                                    }
                                })
                            }
                        })
                    } else {
                        //Mensaje flash aqui
                        response.setFlash(`Ningún resultado para: ${request.query.nombre} `);
                        console.log("Nada encontrado")
                        response.redirect("/friends");
                    }
                }
            }
            )
        } else {
            var busquedaIncorrecta = {
                busqueda: request.query.nombre,
            };
            daoU.getUserData(request.session.currentUserId, (err, usr) => {
                if (err) {
                    console.error(err);
                } else {
                    daoF.getFriendList(request.session.currentUserId, (err, frd) => {
                        if (err) {
                            console.error(err);
                        } else {
                            response.render("friends", {
                                user: usr, friends: frd, id: request.session.currentUserId,
                                errores: result.mapped(), busqueda: busquedaIncorrecta
                            });
                        }
                    })
                }
            });
        }
    })
})

app.post("/sendFriendRequest", identificacionRequerida, (request, response) => {

    daoF.sendFriendship(request.body.id, request.session.currentUserId, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            //Mensaje flash (peticion enviada)
            response.setFlash("Petición enviada");
            response.redirect("/friends");
        }
    })
})

app.get("/friendProfile", identificacionRequerida, (request, response) => {
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        }
        else {
            daoU.getUserData(request.query.friendId, (err, frd) => {
                if (err) {
                    console.error(err);
                } else {
                    response.render("friend_profile", { user: usr, friend: frd, status: request.query.friendStatus });
                }
            })
        }
    });
})

app.post("/deleteFriend", identificacionRequerida, (request, response) => {
    daoF.discardFriend(request.body.friendId, request.session.currentUserId, (err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Amigo eliminado")
            response.setFlash("Amigo eliminado");
            response.redirect("/friends");
        }
    }))
})

app.get("/questions", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        } else {
            daoQ.getQuestions((err, qst) => {
                if (err) {
                    console.error(err);
                }
                else {
                    response.render("questions", { user: usr, questions: qst });
                }
            })
        }
    });
})

app.get("/addQuestion", identificacionRequerida, (request, response) => {
    response.status(200);
    daoU.getUserData(request.session.currentUserId, (err, usr) => {
        if (err) {
            console.error(err);
        } else {
            daoQ.getQuestions((err, qst) => {
                if (err) {
                    console.error(err);
                }
                else {
                    response.render("addQuestions", {user: usr});
                }
            })
        }
    });
})