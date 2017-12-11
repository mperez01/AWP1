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

    getQuestions(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            connection.query("SELECT * FROM questions",
                function (err, questions) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, questions);
                    }
                })
        })
    }

    getAnswers(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            connection.query("SELECT * FROM answers",
                function (err, questions) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, questions);
                    }
                })
        })
    }

    addQuestion(userId, question, answers, callback) {
        this.pool.getConnection((err, connection) => {
            connection.release();
            if (err) { callback(err); return; }
            //¿como introducimos las opciones?
            connection.query("INSERT INTO questions (user_id, text)" +
                " VALUES (?, ?)", [userId, question],
                function (err, questions) {
                    if (err) { callback(err); return; }
                        answers.forEach(a => {
                            connection.query("INSERT INTO answer (id_question, text)" +
                                " VALUES (?, ?)", [questions.insertId, a],
                                function (err, resultado) {
                                    if (err) { callback(err); return; }
                                })
                        })
                })
                callback();
                connection.release();
        })
    }
}
module.exports = {
    DAOQuestions: DAOQuestions
}