# Check now


Backend de check now, una aplicacion de que es planeada para innovar
en el sector laboral para empresas dedicadas a la administracion. 
Check now es ideal para personas que suelen tener problemas para la 
gestion de sus trabajadores, ya sea en horarios de entrada y salidas, calculando sueldos etc.


## Funciones dentro del Back-End


Dentro del backend tenemos el modelo usuarios, en el cual se necesitan agregar primeramente el 
correo y la contrasenia del usuario. Esto es el primer paso para registrarse como usuario, dentro 
controllers, usuario.js dentro de la funcion *obtenerUsuarios()*.


 Primeramente req.body solo recibe dentro un correo y un password de la siguiente manera:

```javascript
const { correo, password } = req.body
\\ hacemos destruction sobre req.body para extraer directamente los datos de correo y password.
```

La siguiente linea de codigo sirve para verificar si el correo ya esta registrado en la base de datos, para mandar un error mas especifico, de cualquier forma correo es tipo unique, no pueden registrarse duplicados.

```javascript
  if(usuarioExiste) {
            const error = new Error("El usuario ya esta registrado")
            return res.status(400).json({msg: error.message})
}
```

Despues de esto nos encargamos de hashear la password, salt sirve para darle un hash mas seguro a la
contrasenia, bcrypt require este parametro junto con el dato que queremos guardar: 

```javascript
const salt = await bcrypt.genSalt(10)

const hashedPassword = await bcrypt.hash(password, salt)

// despues generamos un token que se guardara en la base de datos
// nos servira para confirmar al usuario
// mediante un correo electronico
const token = generarID()
```


 
