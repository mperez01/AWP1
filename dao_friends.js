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
     * 2 Declinada
     */

    sendFriendship(user1, user2, status, action_user, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            let idTop;
            let idDown;
            if (user1 > user2) {
                idTop = user1;
                idDown = user2;
            }
            else {
                idTop = user2;
                idDown = user1;
            }
            connection.query("INSERT INTO relationship (user_one_id, user_two_id, status, action_user_id)" +
                " VALUES (?, ?, ?, ?)", [idTop, idDown, status, action_user],
                function (err, resultado) {
                    if (err) { callback(err); return; }
                    else {
                        connection.release();
                    }
                })
        })
    }


    /**
* Busca en la base de datos la información del usuario que ha insertado el email
* 
* @param {string} id Identificador del usuario a buscar
* @param {function} callback Función que recibirá el objeto error y el resultado
*/
    getFriendData(id, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
                return;
            }
            connection.query("SELECT email, password, name, gender, dateOfBirth, points, image FROM user WHERE user_id=?", [id], (err, friend) => {
                connection.release();
                if (err) {
                    callback(err);
                    return;
                }
                if (friend.length === 0) {
                    callback(null, undefined);
                } else {
                    let edad = null;
                    let date = null;
                    /* Fecha nacimiento */
                    if (friend[0].dateOfBirth != null) {
                        let moment = require("moment");
                        let hoy = moment();
                        var fechaNacimiento = moment(new Date(friend[0].dateOfBirth));
                        edad = hoy.diff(fechaNacimiento, "years");

                        var month = friend[0].dateOfBirth.getMonth() + 1; //months from 1-12
                        var day = friend[0].dateOfBirth.getDate();
                        //console.log("DIA! " + day);
                        if (day < '10') {
                            day = `0${day}`;
                        }
                        if (month < '10') {
                            month = `0${month}`;
                        }
                        var year = friend[0].dateOfBirth.getFullYear();
                        date = `${year}-${month}-${day}`;
                    }
                    /* ----- */

                    let obj = {
                        name: friend[0].name, gender: friend[0].gender,
                        dateOfBirth: date, points: friend[0].points, image: friend[0].image, age: edad
                    };
                    callback(null, obj);
                }
            });
        })
    }

    getFriendList(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            console.log("USUARIO ES " + user);
            /*connection.query("SELECT DISTINCT u.name, u.image, r.status " + 
            "FROM relationship r JOIN user u " + 
            "WHERE r.user_one_id=? OR r.user_two_id=? AND r.status=1", 
            [user, user, user],
            */
            connection.query("SELECT * FROM `relationship` JOIN user ON user_one_id = user_id or user_two_id = user_id " +
            "WHERE (`user_one_id` = ? OR `user_two_id` = ?) AND user_id != ?",
            [user, user, user],
            
            function (err, friend) {
                if (err) { callback(err, undefined); return; }
                else {
                friend.forEach(friend => {
                        console.log("RESULTADO DE CONSULTA " +  friend.user_two_id);
                    })
                    //Resultado tendra la relació
                    connection.release();
                    callback(err, friend);
                }
            })
        })
    }

    deleteFriend(idFriend,userId, callback) {
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

    addFriend(idFriend,userId, callback) {
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
}

module.exports = {
    DAOFriends: DAOFriends
}