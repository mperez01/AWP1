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

    getParticularAnswer(user_id,question_id,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }
            connection.query("SELECT DISTINCT id_answer as answer, id_question as question, questions.text as name FROM user_answer JOIN answer JOIN questions "+
            "WHERE id_user=? AND id_question=?", [user_id,question_id],
                function (err, quest) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, quest[0]);
                    }
                })
        })
    }
/*
-answer_id que debe estar (cogido en get particular answer)
-numero de respuestas que debe haber(cogido en questions.num_answ)
-question_id (para coger sus respectivas respuestas agenciadas a esa pregunta)
- */
    pickNRandomAnswers(answer_id, question_id, callback){
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined); return;
            }
            connection.query("SELECT DISTINCT id_answer as answer, id_question as question FROM user_answer JOIN answer "+
            "WHERE id_user=? AND id_question=?", [idAnswer,question_id],
                function (err, quest) {
                    connection.release();
                    if (err) { callback(err, undefined); return; }
                    else {
                        callback(err, quest[0]);
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
                    answers.forEach(a => {
                        connection.query("INSERT INTO answer (id_question, text)" +
                            " VALUES (?, ?)", [questions.insertId, a],
                            function (err, resultado) {
                                if (err) { callback(err); return; }
                            })
                    })
                    callback();
                    connection.release();
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
            connection.query( "SELECT answer.id AS answerId, user_answer.id_user AS userId, u.image AS image, u.name AS name, " + 
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
                        console.log(answer);
                        callback(null, answer);
                    }
                })
        })
    }
}
module.exports = {
    DAOQuestions: DAOQuestions
}