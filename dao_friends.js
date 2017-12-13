"use strict";

class DAOFriends {
    /**
         * Inicializa el DAO de usuarios.
         * 
         * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
         *                    sobre la BD se realizarán sobre este pool.
         */
    constructor(pool) {
        this.pool = pool;
    }

    /** Status code in database:
     * 0 Pendiente
     * 1 Aceptada
     */

    sendFriendship(idFriend, userId, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            let first;
            let second;
            if (idFriend > userId) {
                first = userId;
                second = idFriend;
            }
            else {
                first = idFriend;
                second = userId;
            }
            connection.query("INSERT INTO relationship (user_one_id, user_two_id, status, action_user_id)" +
                " VALUES (?, ?, 0, ?)", [first, second, userId],
                (err) => {
                    connection.release();
                    callback(err);
                })
        })
    }

    getFriendList(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
                return;
            }

            connection.query("SELECT * FROM `relationship` JOIN user ON user_one_id = user_id or user_two_id = user_id " +
                "WHERE (`user_one_id` = ? OR `user_two_id` = ?) AND user_id != ?",
                [user, user, user],

                function (err, friend) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, friend);
                    }
                })
        })
    }

    discardFriend(idFriend, userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            let first;
            let second;
            if (idFriend > userId) {
                first = userId;
                second = idFriend;
            }
            else {
                first = idFriend;
                second = userId;
            }
            connection.query(
                "DELETE FROM relationship WHERE user_one_id=? AND user_two_id=? ",
                [first, second],
                (err) => {
                    connection.release();
                    callback(err);
                }
            );
        });
    }

    addFriend(idFriend, userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            let first;
            let second;
            if (idFriend > userId) {
                first = userId;
                second = idFriend;
            }
            else {
                first = idFriend;
                second = userId;
            }
            connection.query(
                "UPDATE relationship SET status=1, action_user_id=? WHERE user_one_id=? AND user_two_id=?",
                [userId, first, second],
                (err) => {
                    connection.release();
                    callback(err);
                }
            );
        });
    }

    searchByName(name, callback) {
        this.pool.getConnection((err, connection) => {
            //Si se pusiera %?% en la consulta, daría error
            name = `%` + name + `%`;
            connection.query(
                "SELECT name, image, user_id FROM user WHERE name LIKE ? ",
                [name],
                function (err, friend) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, friend);
                    }
                }
            );
        })
    }
    /**
     * Dado el id del amigo y del usuario, se realiza una consulta en la base de datos
     * en la que se devuelve todos los datos del amigo, incluyendo el estado actual con 
     * el usuario (1 peticion enviada, en espera; 0 aceptada y por tanto, amigo)
     * 
     * @param {*} idFriend Id del amigo
     * @param {*} userId  Id del usuario logeado
     * @param {*} callback  Devuelve la información del amigo y el estado con el usuario
     */
    getStatusFriend(idFriend, userId, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            let first;
            let second;
            if (idFriend > userId) {
                first = userId;
                second = idFriend;
            }
            else {
                first = idFriend;
                second = userId;
            }
            connection.query("SELECT *, (SELECT status FROM relationship join user " + 
            "WHERE relationship.user_one_id=? and relationship.user_two_id=? and USER_ID=?) as status FROM " + 
            "user WHERE USER_ID=?",
                [first, second, idFriend, idFriend],
                function (err, friend) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else if (friend[0] !== undefined) {
                        let edad = null;
                        let date = null;
                        /* Fecha nacimiento */
                        if (friend[0].dateOfBirth != null) {
                            let moment = require ("moment");
                            let hoy = moment();
                            var fechaNacimiento = moment(new Date(friend[0].dateOfBirth));
                            edad = hoy.diff(fechaNacimiento, "years");
    
                            var month = friend[0].dateOfBirth.getMonth() + 1; //months from 1-12
                            var day = friend[0].dateOfBirth.getDate();
                             
                            if(day < '10') {
                                day = `0${day}`;
                            }
                            if(month < '10') {
                                month = `0${month}`;
                            }
                            var year = friend[0].dateOfBirth.getFullYear();
                            date = `${year}-${month}-${day}`;
                        }
                        let obj = {id: friend[0].user_id, name: friend[0].name, gender: friend[0].gender, 
                            dateOfBirth: date, points: friend[0].points, 
                            image: friend[0].image, age: edad, status: friend[0].status};
                        callback(err, obj);
                    } else {
                        callback(err, undefined);
                    }
                }
            );
        })
    }
}

module.exports = {
    DAOFriends: DAOFriends
}