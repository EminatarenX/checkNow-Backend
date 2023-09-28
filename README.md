# Check now

Backend de Check Now, una aplicación planeada para innovar en el sector laboral para empresas dedicadas a la administración. Check Now es ideal para personas que suelen tener problemas para gestionar a sus trabajadores, ya sea en horarios de entrada y salida, calculando salarios, etc.

## Funciones dentro del Back-End

Dentro del backend, tenemos el modelo de usuarios, en el cual se necesitan agregar inicialmente el correo y la contraseña del usuario. Este es el primer paso para registrarse como usuario.

Dentro de `controllers/usuario.js`, puedes encontrar la función **`obtenerUsuarios()`**. Primeramente, `req.body` solo recibe un correo y una contraseña de la siguiente manera:

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
