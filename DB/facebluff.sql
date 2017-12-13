-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-12-2017 a las 13:06:19
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

CREATE TABLE `answer` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_question` int(10) UNSIGNED NOT NULL,
  `text` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id`, `id_question`, `text`) VALUES
(55, 15, '1\r'),
(56, 15, '2\r'),
(57, 15, '3\r'),
(58, 15, '4'),
(59, 15, 'Holi');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `text` text NOT NULL,
  `num_answ` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`id`, `user_id`, `text`, `num_answ`) VALUES
(15, 24, 'Pregunta', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relationship`
--

CREATE TABLE `relationship` (
  `user_one_id` int(10) UNSIGNED DEFAULT NULL,
  `user_two_id` int(10) UNSIGNED DEFAULT NULL,
  `status` tinyint(3) UNSIGNED DEFAULT NULL,
  `action_user_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `relationship`
--

INSERT INTO `relationship` (`user_one_id`, `user_two_id`, `status`, `action_user_id`) VALUES
(1, 19, 1, 1),
(1, 24, 0, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('JnT0dxBn7EeS2ZQqbXDLGpNIeFobbr77', 1513195966, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUserId\":24,\"userImg\":\"aa5b2da5c7ae5d70dd03837d0ee7cd46\"}'),
('Sq1brhkPujkXEcs0Am9HhnxV3pO4HTTP', 1513174661, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUserId\":19,\"currentUserEmail\":\"mario@ucm.es\",\"userImg\":\"d7ec16cf43d6cb10e32bf673c29a2ad4\"}'),
('ZHo94bXlUS-t_qRAOEKRnws6Zj5_rmgB', 1513249011, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUserId\":19,\"currentUserEmail\":\"mario@ucm.es\",\"userImg\":\"Capt Spaulding-01.png\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `points` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `name`, `gender`, `dateOfBirth`, `image`, `points`) VALUES
(1, 'marce93p@gmail.com', '1234', 'Marcelino Pérez', 'male', '1993-06-30', '35b63474abbd3a896e5acce19ccf83e0', 0),
(19, 'mario@ucm.es', 'pass', 'Mario Rodríguez Salinero', 'male', '1994-01-14', 'Capt Spaulding-01.png', 0),
(23, 'marzia@astolfi.com', '1234', 'Marzia Astolfi', 'female', '1994-06-04', 'd7ec16cf43d6cb10e32bf673c29a2ad4', 0),
(24, 'jorge@gmail.com', '1234', 'Jose Luis', 'male', '2017-12-12', 'aa5b2da5c7ae5d70dd03837d0ee7cd46', 0),
(25, 'sabela@ucm.es', 'pass', 'Sabela García', 'female', '1996-04-18', 'd507c264354c599eff93e421f3013431', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_answer`
--

CREATE TABLE `user_answer` (
  `id_answer` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user_answer`
--

INSERT INTO `user_answer` (`id_answer`, `id_user`) VALUES
(55, 25),
(59, 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_guess`
--

CREATE TABLE `user_guess` (
  `user_id_answer` int(10) UNSIGNED NOT NULL,
  `user_id_guess` int(10) UNSIGNED NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_question` (`id_question`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Indices de la tabla `relationship`
--
ALTER TABLE `relationship`
  ADD UNIQUE KEY `unique_users_id` (`user_one_id`,`user_two_id`),
  ADD KEY `user_one_id` (`user_one_id`),
  ADD KEY `user_two_id` (`user_two_id`),
  ADD KEY `action_user_id` (`action_user_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD KEY `id_answer` (`id_answer`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `user_guess`
--
ALTER TABLE `user_guess`
  ADD KEY `user_id_answer` (`user_id_answer`),
  ADD KEY `user_id_guess` (`user_id_guess`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id`);

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `foreign_userId` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `relationship`
--
ALTER TABLE `relationship`
  ADD CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `relationship_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `relationship_ibfk_3` FOREIGN KEY (`action_user_id`) REFERENCES `user` (`user_id`);

--
-- Filtros para la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD CONSTRAINT `user_answer_ibfk_1` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id`),
  ADD CONSTRAINT `user_answer_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`user_id`);

--
-- Filtros para la tabla `user_guess`
--
ALTER TABLE `user_guess`
  ADD CONSTRAINT `user_guess_ibfk_1` FOREIGN KEY (`user_id_answer`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_guess_ibfk_2` FOREIGN KEY (`user_id_guess`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
