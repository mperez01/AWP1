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
}

module.exports = {
    DAOFriends: DAOFriends
}