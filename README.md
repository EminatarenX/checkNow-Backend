# Check now

Backend de Check Now, una aplicación planeada para innovar en el sector laboral para empresas dedicadas a la administración. Check Now es ideal para personas que suelen tener problemas para gestionar a sus trabajadores, ya sea en horarios de entrada y salida, calculando salarios, etc.

## Funciones dentro de controllers/usuarios.js

Dentro del backend, tenemos el modelo de usuarios, en el cual se necesitan agregar inicialmente el correo y la contraseña del usuario. Este es el primer paso para registrarse como usuario.

### crearUsuario

Dentro de `controllers/usuario.js`, puedes encontrar la función **`crearUsuario()`**. Primeramente, `req.body` solo recibe un correo y una contraseña de la siguiente manera:
```json
{
  "correo" : "correo@usuario.com",
  "password" : "password_usuario"
}
```
Recibimos dentro de la funcion como: 
```js
const { correo, password } = req.body; 
```

La siguiente linea de codigo sirve para verificar si el correo ya esta registrado en la base de datos, para mandar un error mas especifico, de cualquier forma correo es tipo unique, no pueden registrarse duplicados.

```js
if(usuarioExiste) {
  const error = new Error("El usuario ya esta registrado")
  return res.status(400).json({msg: error.message})
}
```

Despues de esto nos encargamos de hashear la password, salt sirve para darle un hash mas seguro a la contrasenia, bcrypt require este parametro junto con el dato que queremos guardar: 

```js
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)
const token = generarID()
```

Despues de generar estos parametros, podemos usarlos para enviar un correo a nuestro usuario con las siguientes lineas de codigo, y procedemos a guardarlo en la base de datos: 

```js
emailRegistro({correo, token})

const usuario = new Usuario({
  correo,
  password: hashedPassword,
  token
})
await usuario.save()
```
si todo sale bien, retornamos un mensaje de exito, con los datos del usuario y con un mensaje de aviso para notificar al usuario del mensaje que ha sido enviado a su correo para confirmar su cuenta: 
```js
return res.json({
  msg: {
    titulo: "Cuenta creada!",
    cuerpo: "Hemos enviado un mensaje de verificación a tu correo electrónico"
  },
  usuario
})
```

### confirmarUsuario

la funcon confirmar usuario es producto de el correo que se envia al usuario para confirmar su identidad por medio de un mail, la funcion espera los siguientes datos por medio de params:

```js
const { token } = req.params
```

seguido de extraer el token de los params enviados desde el frontend, hacemos una busqueda de el usuario dentro de un bloque de **trycatch** por medio de ese token para despues de ello borrarlo. De esa manera confirmamos al usuario:

```js
  // buscamos al usuario con el token
  let usuario = await Usuario.findOne({ token })

  //si no existe significa que ya ha sido confirmado
  // o que nunca existio
  if (!usuario) {
    const error = new Error("El usuario ya ha sido confirmado")
    return res.status(404).json({ msg: error.message })
  }

  usuario.token = ""

  await usuario.save()

  // retornamos un mensaje de exito 
  return res.status(200).json({
    msg: {
      titulo: "Cuenta verificada!",
      cuerpo: "Ahora puedes iniciar sesion :)"
    }
  })
```

### iniciarSesion 

Iniciar sesion unicamente espera un json por medio de `req.body` de la siguiente manera:
```json
{
  "correo" : "usuario@correo.com",
  "password" : "contrasenia_del_usuario"
}
```
Seguido de recibir estos datos, dentro de un bloque de `trycatch` hacemos una busqueda de ese usuario, por medio del correo: 

```js
const existeUsuario = await Usuario.findOne({ correo })

// si el usuario no existe retornamos un mensaje de error
if (!existeUsuario) {
  const error = new Error("El usuario no existe")
  return res.status(400).json({ msg: error.message })
}
```
Seguido de verificar que existe, se verifica si el usuario tiene el token de confirmacion, si lo tiene significa que el usuario no esta confirmado:
```js
if (existeUsuario.token) {
  const error = new Error("El usuario no esta verificado")
  return res.status(400).json({ msg: error.message })
}
```
si todo es correcto verificamos si la contraseña que estamos recibiendo coincide con la contraseña hasheada dentro del backend usando `compare()` de la libreria *bcrypt*,
si las contraseñas coinciden se genera un JsonWebToken ( JWT ) donde firmamos con la palabra secretta `JWT_SECRET`, tiempo de expiracion y el id del usuario para facilitar las consultas con middlewares: 
```js

const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password)

if (!passwordCorrecto) {
  const error = new Error("Contraseña incorrecta")
  return res.status(400).json({ msg: error.message })
}

const token = jwt.sign({ id: existeUsuario._id }, process.env.JWT_SECRET, { expiresIn: "30m" })

// mensaje de exito, junto con el token para que el front pueda almacenarlo
// y usarlo para realizar consultas al backend
return res.json({
  msg: {
    titulo: "¡Bienvenido!",
    cuerpo: "Has iniciado sesión correctamente"
  },
  token
})

```
### solicitarCambioPassword
Esta funcion es la encargada de enviar un correo al usuario para que pueda cambiar su contraseña, esta funcion recibe un correo por medio de `req.body` de la siguiente manera: 

```json
{
  "correo" : "alguien@example.com"
}
```
Seguido de recibir el correo, se verifica si el usuario existe, si no existe se retorna un mensaje de error:

```js
const usuario = await Usuario.findOne({ correo })

if (!usuario) {
  const error = new Error("El usuario no existe")
  return res.status(400).json({ msg: error.message })
}
```

Seguido de verificar que el usuario existe, se genera un token y se guarda en la base de datos: 

```js
const token = generarID()

usuario.token = token

await usuario.save();
```
Despues de esto se envia un correo al usuario con el token generado, para que pueda cambiar su contraseña, y se retorna un mensaje de exito: 

```js
emailCambioPassword({ correo, token })

return res.json({
  msg: {
    titulo: "Correo enviado!",
    cuerpo: "Hemos enviado un correo para que puedas cambiar tu contraseña"
  }
})
```

### cambiarPassword
Esta función solo funcionará (valgase la redundancia) con el token que se envia al correo del usuario, esta funcion recibe el token por medio de `req.params` de la siguiente manera: 
```js
const { token } = req.params
```

Seguido de recibir el token, se verifica si el usuario solicitó el cambio de contraseña, si no, se retorna un mensaje de error:

```js
const usuario = await Usuario.findOne({ token })

if(!usuario) {
  const error = new Error("El usuario no ha solicitado el cambio de contraseña")
  return res.status(400).json({ msg: error.message })
}
```
Si el usuario existe, se verifica que el token no haya expirado, si ya expiró se retorna un mensaje de error: 

```js
const tokenExpirado = Date.now() - usuario.updatedAt.getTime() > 3600000

if(tokenExpirado) {
  const error = new Error("El token ha expirado")
  return res.status(400).json({ msg: error.message })
}
```

Si el token no ha expirado entonces se procede a cambiar la contraseña, se recibe la contraseña por medio de `req.body` de la siguiente manera: 

```json
{
  "password" : "contrasenaEjemplo"
}
```
Posterior a recibir la contraseña, se hashea y se guarda en la base de datos: 

```js
const { password } = req.body

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

usuario.password = hashedPassword
usuario.token = ""

await usuario.save()
```

Despues de esto se retorna un mensaje de exito: 

```js
return res.json({
  msg: {
    titulo: "Contraseña cambiada!",
    cuerpo: "Ahora puedes iniciar sesion con tu nueva contraseña"
  }
})
```
