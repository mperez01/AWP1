class DAOQuestions {
    /**
         * Inicializa el DAO de las preguntas.
         * 
         * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
         *                    sobre la BD se realizarán sobre este pool.
         */
    constructor(pool) {
        this.pool = pool;
    }

    /*getQuestionList(user, callback) {
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
    }*/
}
module.exports = {
    DAOQuestions: DAOQuestions
}