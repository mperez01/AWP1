![](https://github.com/mperez01/Facebluff/blob/master/public/img/Logo.png "Facebluff")

Facebluff. Red social para la asignatura de Aplicaciones Web de la Universidad Complutense de Madrid

Curso 2017-2018

# Descripción

Facebluff es una red social en la que los usuarios pueden crear y responder preguntas, adivinar las preguntas de los amigos y con ello conseguir puntos; los puntos se pueden cangear por la posibilidad de subir fotos al perfil.

### Creación de perfil y modificación del perfil
La información guardada para cada usuario consiste en: su dirección de correo (que lo identifica unívocamente), una contraseña, su nombre completo y su género. Opcionalmente, puede incluirse una imagen de perfil (avatar) y su fecha de nacimienta. Al introducirse en la base de datos, el usuario recibe un ID único.

Una vez se disponga de una cuenta de usuario, se podrá modificar/añadir:
* El email
* La contraseña
* El nombre completo
* El sexo
* La fecha de nacimiento
* La imagen de perfil

### Perfil de usuario y subida de imagenes
En el perfil de usuario se encuentra la información del usuario y la posibilidad de subir imagenes al perfil (distintas a la imagen de perfil). La subida de imagenes sólo será posible si el usuario tiene, al menos, 100 puntos, y estos se descontaran de su cuenta si sube una imagen nuevo.

### Amigos
En la sección amigos apareceran los usuarios de Facebluff que le hayan enviado una petición de amistad al usuario logeado, así como su lista de amigos. Desde esta sección también se puede buscar a usuarios de Facebluff por su nombre.

### Preguntas: Crear y contestar
En la sección preguntas el usuario podrá crear nuevas preguntas y añadirlas a la base de datos, así como contestar las preguntas que se le mostraran aleatoriamente en la página.

### Adivinar respuestas de amigos y puntos
Una pregunta que haya sido contestada por un amigo del usuario logeado dará la opción de, en el menú de dicha pregunta, adivinarla; si el usuario acierta la respuesta que haya dado su amigo, ganará 50 puntos, en caso contrario no ganará ninguno.

Los puntos pueden usarse para subir fotos/imagenes al perfil


### Recursos usados
 * [XAMPP](https://www.apachefriends.org/es/index.html)
 * [Node.js](https://nodejs.org/es/)
   * [Express](http://expressjs.com/es/)
   * [Express-mysql-session](https://www.npmjs.com/package/express-mysql-session)
   * [Express-session](https://github.com/expressjs/session)
   * [Express-validator](https://github.com/ctavan/express-validator)
   * [Body-parser](https://github.com/expressjs/body-parser)
   * [Multer](https://github.com/expressjs/multer)
   * [Mysql](https://github.com/mysqljs/mysql)

### Referencias
[Algorithm Fisher-Yates](https://github.com/Daplie/knuth-shuffle)


