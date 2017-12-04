"use strict";

class DAOUsers {
    /**
     * Inicializa el DAO de usuarios.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool) {
        this.pool = pool;
    }
    /**
 * Busca en la base de datos la información del usuario que ha insertado el email
 * 
 * @param {string} email Identificador del usuario a buscar
 * @param {function} callback Función que recibirá el objeto error y el resultado
 */
    getUserData(email, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
                return;
            }
            connection.query("SELECT email, password, name, gender, dateOfBirth, points, image FROM user WHERE email=?", [email], (err, usr) => {
                connection.release();
                if (err) {
                    callback(err);
                    return;
                }
                if (usr.length === 0) {
                    callback(null, undefined);
                } else {
                    let obj = { email:usr[0].email, password: usr[0].password, name: usr[0].name, gender: usr[0].gender, dateOfBirth: usr[0].dateOfBirth, points: usr[0].points, image: usr[0].image };
                    console.log(obj);
                    callback(null, obj);
                }
            });

        })
    }
    /**
 * Determina si un determinado usuario aparece en la BD con la contraseña
 * pasada como parámetro.
 * 
 * Es una operación asíncrona, de modo que se llamará a la función callback
 * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
 * y, por otro lado, un booleano indicando el resultado de la operación
 * (true => el usuario existe, false => el usuario no existe o la contraseña es incorrecta)
 * En caso de error error, el segundo parámetro de la función callback será indefinido.
 * 
 * @param {string} email Identificador del usuario a buscar
 * @param {string} password Contraseña a comprobar
 * @param {function} callback Función que recibirá el objeto error y el resultado
 */
    isUserCorrect(email, password, callback) {

        /* Implementar */
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("SELECT email, password FROM user WHERE email = ? AND password = ?", [email, password],
                (err, filas) => {
                    /* Conecction release se puede poner justo aqui, ya que tenemos la
                    información de la tabla en filas y no vamos a necesitarlo más */
                    connection.release();
                    if (err) { callback(err); return; }
                    if (filas.length === 0) {
                        callback(null, false);
                    }
                    else {
                        callback(null, true);
                    }
                })
        })

    }
    /**
     * Obtiene el nombre de fichero que contiene la imagen de perfil de un usuario.
     * 
     * Es una operación asíncrona, de modo que se llamará a la función callback
     * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
     * y, por otro lado, una cadena con el nombre de la imagen de perfil (o undefined
     * en caso de producirse un error).
     * 
     * @param {string} email Identificador del usuario cuya imagen se quiere obtener
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    getUserImageName(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("SELECT image FROM user WHERE email = ?",
                [email],
                (err, rows) => {
                    if (err) { callback(err); return; }
                    connection.release();
                    if (rows.length === 0) {
                        callback(null, undefined);
                    } else {
                        callback(null, rows[0].image);
                    }
                });
        });
    }

    insertUser(email, password, name, gender, date, image, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("INSERT INTO user (email, password, name, gender, dateOfBirth, image)" +
                " VALUES (?, ?, ?, ?, ?, ?)", [email, password, name, gender, date, image],
                function (err, resultado) {
                    if (err) { callback(err); return; }
                    callback(null);
                    connection.release();
                })
        })
    }
}

module.exports = {
    DAOUsers: DAOUsers
}