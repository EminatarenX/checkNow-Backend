# Check now

Backend de Check Now, una aplicación planeada para innovar en el sector laboral para empresas dedicadas a la administración. Check Now es ideal para personas que suelen tener problemas para gestionar a sus trabajadores, ya sea en horarios de entrada y salida, calculando salarios, etc.

## Funciones dentro de controllers/usuarios.js

Dentro del backend, tenemos el modelo de usuarios, en el cual se necesitan agregar inicialmente el correo y la contraseña del usuario. Este es el primer paso para registrarse como usuario.

### crearUsuario

Dentro de `controllers/usuario.js`, puedes encontrar la función **`crearUsuario()`**. Primeramente, `req.body` solo recibe un correo y una contraseña de la siguiente manera:

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
try {
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
