![](https://github.com/mperez01/Facebluff/blob/master/public/img/Logo.png "Facebluff")

Facebluff. Red social para la asignatura de Aplicaciones Web de la Universidad Complutense de Madrid

Curso 2017-2018

# Descripción

Facebluff es una red social en la que los usuarios pueden crear y responder preguntas, adivinar las preguntas de los amigos y con ello conseguir puntos; los puntos se pueden canjear por la posibilidad de subir fotos al perfil.

### Creación de perfil y modificación del perfil
La información guardada para cada usuario consiste en: su dirección de correo (que lo identifica unívocamente), una contraseña, su nombre completo y su género. Opcionalmente, puede incluirse una imagen de perfil (avatar) y su fecha de nacimiento. Al introducirse en la base de datos, el usuario recibe un ID único.

Una vez se disponga de una cuenta de usuario, se podrá modificar/añadir:
* El email
* La contraseña
* El nombre completo
* El sexo
* La fecha de nacimiento
* La imagen de perfil

### Perfil de usuario y subida de imágenes
En el perfil de usuario se encuentra la información del usuario y la posibilidad de subir imágenes al perfil (distintas a la imagen de perfil). La subida de imágenes sólo será posible si el usuario tiene, al menos, 100 puntos, y estos se descontarán de su cuenta si sube una imagen nueva.

### Amigos
En la sección amigos aparecerán los usuarios de Facebluff que le hayan enviado una petición de amistad al usuario logeado, así como su lista de amigos. Desde esta sección también se puede buscar a usuarios de Facebluff por su nombre.

### Preguntas: Crear y contestar
En la sección preguntas el usuario podrá crear nuevas preguntas y añadirlas a la base de datos, así como contestar las preguntas que se le mostraran aleatoriamente en la página.

### Adivinar respuestas de amigos y puntos
Una pregunta que haya sido contestada por un amigo del usuario logeado dará la opción de, en el menú de dicha pregunta, adivinarla; si el usuario acierta la respuesta que haya dado su amigo, ganará 50 puntos, en caso contrario no ganará ninguno.

Los puntos pueden usarse para subir fotos/imágenes al perfil

### Características
Un usuario puede ver el perfil de cualquier usuario de la red social Facebluff a través del buscador, y de los amigos y usuarios que le hayan enviado petición de amistad desde el buscador o desde el apartado "amigos" (tanto desde amigos como solicitudes de amistad), pero no podrá intentar adivinar las preguntas de usuarios que no sean sus amigos.

Las preguntas del apartado "preguntas" son accesibles para todos los usuarios de la red una vez se haya creado una nueva pero, como está explicado en líneas anteriores, no se podrá adivinar las preguntas de usuarios que no sean amigos.

Al subir imagenes por puntos será necesario incluir una descripción (en caso contrario no se podrá). De este modo se añadira la descripción al html en alt.

En el perfil de los usuarios, si son amigos, existirá la posibilidad de eliminarlos, en caso de no tener amistad no existirá ninguna opción. Si un usuario manda una petición de amistad, aquí también aparecerá la opción de descartarla.

### Diseño de la base de datos

![](https://i.imgur.com/05xVTs1.png "entidad-relación")
En la tabla relationship, user_id_one tiene la condición de que su índice debe ser siempre estrictamente menor que user_id_two.
En la misma tabla, action_user_id guarda el id del último usuario que haya interactuado en la relación (enviar petición de amistad o aceptarla).

Las tabla questions y answer guardan información sobre la pregunta en cuestión y las respuestas asociadas a la misma respectivamente. La tabla user_answer guarda la información del usuario que haya respondido una pregunta con la respuesta que haya decidido, mientras user_guess, guarda la información de la respuesta que haya creído que un amigo haya hecho en una pregunta que previamente haya respondido el amigo, guardando true o false en correct si la ha acertado o no.

La tabla user_image guarda información sobre las imágenes que haya subido el usuario a su perfil (no la imagen de perfil)

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

[GloriaHallelujah.ttf](http://www.kimberlygeswein.com/)

[Imágenes de usuario](https://hopstarter.deviantart.com/art/Halloween-Avatars-643096849)
