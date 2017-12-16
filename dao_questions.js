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
            connection.query("SELECT * FROM questions ORDER BY RAND() LIMIT 5",
                function (err, questions) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, questions);
                    }
                })
        })
    }

    getParticularQuestion(question_id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }
            connection.query("SELECT * FROM questions where id=?", [question_id],
                function (err, quest) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, quest[0]);
                    }
                })
        })
    }

    getParticularAnswer(user_id, question_id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }

            connection.query("SELECT DISTINCT a.text as ansName, ua.id_answer as answer, ua.id_user as friendId, (SELECT num_answ FROM questions where questions.id=?) as num " +
                "FROM user_answer ua JOIN answer a on ua.id_answer=a.id " +
                "WHERE ua.id_user=? AND a.id_question=?", [question_id, user_id, question_id],
                function (err, ans) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, ans[0]);
                    }
                })
        })
    }
    /*
    -answer_id que debe estar (cogido en get particular answer)
    -numero de respuestas que debe haber(cogido en questions.num_answ)
    -question_id (para coger sus respectivas respuestas agenciadas a esa pregunta)
    - */
    pickNRandomAnswers(answer_id, question_id, num, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }
            connection.query("SELECT answer.text as answer, answer.id as answerId, questions.text as question FROM `questions` JOIN answer " +
                "where questions.id = answer.id_question and questions.id = ? and answer.id != ? " +
                "ORDER BY RAND() LIMIT ?", [question_id, answer_id, num],
                function (err, quest) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, quest);
                    }
                })
        })
    }

    isAnsweredByUser(user_id, question_id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }
            else {
                connection.query("SELECT * FROM user_answer JOIN answer " +
                    "WHERE user_answer.id_user=? and answer.id = user_answer.id_answer and id_question=?",
                    [user_id, question_id],
                    function (err, answ) {
                        connection.release();
                        if (err) { callback(err, undefined); return; }
                        if (answ.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(err, true);
                        }
                    })
            }
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

    addQuestion(userId, question, answers, num, callback) {
        this.pool.getConnection((err, connection) => {
            connection.release();
            if (err) { callback(err); return; }
            //¿como introducimos las opciones?
            connection.query("INSERT INTO questions (user_id, text,num_answ)" +
                " VALUES (?, ?, ?)", [userId, question, num],
                function (err, questions) {
                    if (err) { callback(err); return; }
                    answers.forEach((a, index, array) => {
                        connection.query("INSERT INTO answer (id_question, text)" +
                            " VALUES (?, ?)", [questions.insertId, a],
                            function (err, resultado) {
                                connection.release();
                                if (err) { callback(err); return; }
                            })
                            //de este modo se envia el callback justo despues de terminar y no antes
                        if (index===array.length-1) {
                            callback();
                        }
                    })
                })
        })
    }

    getAnswers(questionId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("SELECT questions.id as questId, answer.id as ansId, answer.text as ansText, questions.text as questName " +
                "FROM `questions` JOIN answer WHERE questions.id = answer.id_question AND questions.id=?",
                [questionId],
                function (err, anwers) {
                    connection.release();
                    if (err) { callback(err); return; }
                    callback(err, anwers);
                })
        })
    }

    addAnswer(questionsId, answerText, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("INSERT INTO answer (id_question, text)" +
                " VALUES (?, ?)", [questionsId, answerText],
                function (err, addAnswer) {
                    connection.release();
                    if (err) { callback(err); return; }
                    callback(null, addAnswer.insertId);
                })
        })
    }

    addUserAnswer(id_answer, id_user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("INSERT INTO user_answer (id_answer, id_user)" +
                " VALUES (?, ?)", [id_answer, id_user],
                (err) => {
                    connection.release();
                    callback(err);
                })
        })
    }

    getFriendsAnswer(id_user, questionId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("SELECT answer.id AS answerId, user_answer.id_user AS userId, u.image AS image, u.name AS name, " +
                "(SELECT correct FROM answer a, user_guess JOIN questions where user_guess.id_user=? and questions.id=? " +
                " and a.id=user_guess.id_answer and a.id_question=questions.id and user_guess.id_friend=user_answer.id_user) as correct " +
                " FROM relationship r,user u, user_answer JOIN answer ON id=id_answer WHERE user_answer.id_user!=? AND " +
                "((r.user_one_id=? AND r.user_two_id=user_answer.id_user) OR (r.user_one_id=user_answer.id_user AND r.user_two_id=?)) " +
                "AND id_question=? AND u.user_id=user_answer.id_user and r.status=1",
                [id_user, questionId, id_user, id_user, id_user, questionId],
                function (err, answer) {
                    connection.release();
                    if (err) { callback(err); return; }
                    else {
                        callback(null, answer);
                    }
                })
        })
    }

    addGuessAnswer(id_answer, id_user, id_friend, correct, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) { callback(err); return; }
            connection.query("INSERT INTO user_guess (id_user, id_friend, id_answer, correct)" +
                " VALUES (?, ?, ?, ?)", [id_user, id_friend, id_answer, correct],
                (err) => {
                    connection.release();
                    callback(err);
                })
        })
    }
}
module.exports = {
    DAOQuestions: DAOQuestions
}