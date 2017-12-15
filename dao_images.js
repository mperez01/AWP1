class DAOImages {
    /**
         * Inicializa el DAO de las preguntas.
         * 
         * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
         *                    sobre la BD se realizarán sobre este pool.
         */
    constructor(pool) {
        this.pool = pool;
    }

    getUserImages(user_id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            connection.query("SELECT * FROM user_images WHERE user_id=?",[user_id],
                function (err, images) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, images);
                    }
                })
        })
    }

    addImage(userId,img,text, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("INSERT INTO user_images (user_id, image,description)" +
                " VALUES (?, ?, ?)", [userId, img, text],
                (err)=> {
                    connection.release();
                    callback(err);
                })
            });
        }
    }

module.exports = {
    DAOImages: DAOImages
}