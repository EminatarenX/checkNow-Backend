import bcrypt from 'bcrypt'
import { generarID } from "../helpers/generarId.js"
import { emailRegistro, emailCambiarPassword } from "../helpers/correos.js"
import jwt from 'jsonwebtoken'

// modelos
import Usuario from "../models/Usuario.js"
import Empleado from '../models/Empleado.js'

const obtenerUsuarios = async (req, res) => {
    //crear una variable por si pone un usuario especifico
    const { usuarioId } = req.params
    if (usuarioId) {
        try {
            const usuario = await Usuario.findById(usuarioId)
            return res.json(usuario)
        } catch (error) {
            console.log(error)
        }
    }
    try {
        const usuarios = await Usuario.find()

        res.json(usuarios)

    } catch (error) {
        console.log(error)
    }
}

const crearUsuario = async (req, res) => {
    const { correo, password } = req.body

    try {
        const usuarioExiste = await Usuario.findOne({ correo })

        if (usuarioExiste) {
            const error = new Error("El usuario ya esta registrado")
            return res.status(400).json({ msg: error.message })
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const token = generarID()

        emailRegistro({ correo, token })

        const usuario = new Usuario({
            correo,
            password: hashedPassword,
            token
        })



        await usuario.save()

        return res.json({
            msg: {
                titulo: "¡Cuenta creada!",
                cuerpo: "Hemos enviado un mensaje de verificación a tu correo electrónico"
            },
            usuario
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "Hubo un error, Intenta mas tarde", error })
    }
}

const iniciarSesion = async (req, res) => {
    const { correo, password } = req.body

    try {
        const existeUsuario = await Usuario.findOne({ correo })

        if (!existeUsuario) {
            const error = new Error("El usuario no existe")
            return res.status(400).json({ msg: error.message })
        }



        if (existeUsuario.token && !existeUsuario.verified) {
            const error = new Error("El usuario no esta verificado")
            return res.status(400).json({ msg: error.message })
        }

        
        const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password)
        
        if(existeUsuario.token && existeUsuario.verified && !passwordCorrecto){
            const error = new Error("Contraseña incorrecta")
            return res.status(400).json({ msg: error.message })
        }

        if (!passwordCorrecto) {
            const error = new Error("Contraseña incorrecta")
            return res.status(400).json({ msg: error.message })
        }

        const token = jwt.sign({ id: existeUsuario._id }, process.env.JWT_SECRET, { expiresIn: "30m" })

        return res.json({
            msg: {
                titulo: "¡Bienvenido!",
                cuerpo: "Has iniciado sesión correctamente"
            },
            token
        })

    } catch (error) {
        console.log(error)
    }
}

const confirmarUsuario = async (req, res) => {
    const { token } = req.params

    try {
        let usuario = await Usuario.findOne({token: token})

        if (!usuario) {
            const error = new Error("El usuario ya ha sido confirmado")
            return res.status(404).json({ msg: error.message })
        }

        usuario.token = ""
        usuario.verified = true

        await usuario.save()

        return res.status(200).json({
            msg: {
                titulo: "Cuenta verificada!",
                cuerpo: "Ahora puedes iniciar sesion :)"
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const completarPerfil = async (req, res) => {
    const { nombre, apellidos, telefono, direccion, role } = req.body
    
    const { id: usuario_id } = req.usuario


    try {
        let usuario = await Usuario.findById(usuario_id)

        if (!usuario) {
            const error = new Error("El usuario no existe")
            return res.status(400).json({ msg: error.message })
        }

        const existeTelefono = await Usuario.findOne({ telefono })

        if(existeTelefono && existeTelefono._id != usuario_id){
            const error = new Error("El telefono ya esta registrado")
            return res.status(400).json({ msg: error.message })
        }

        if(role === "user"){
            const empleado = new Empleado({
                id_usuario: usuario_id,
                informacion_personal: {
                    nombre,
                    apellidos,
                    telefono,
                    direccion
                }
            })
            await empleado.save()
        }

        usuario.nombre = nombre
        usuario.apellidos = apellidos
        usuario.telefono = telefono
        usuario.direccion = direccion
        usuario.role = role

        

        await usuario.save()

        return res.json({
            msg: {
                titulo: "¡Registro completado!",
                usuario

            },
 
        })

    } catch (error) {
        return res.status(400).json({ msg: "Hubo un error, Intenta mas tarde", error })
    }
}

const solicitarCambioPassword = async (req, res) => {
    
    const { correo } = req.body;

    try{
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(404).json({msg: "El usuario no existe"})
        }

        const token = generarID()

        usuario.token = token

        await usuario.save()

        emailCambiarPassword({correo, token})

        return res.json({
            msg: {
                titulo: "¡Correo enviado!",
                cuerpo: "Hemos enviado un correo para que puedas cambiar tu contraseña"
            }
        })

    }catch(error){
        console.log(error)
    }
}

const cambiarPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    try{
        const usuario = await Usuario.findOne({token})

        if(!usuario){
            return res.status(404).json({msg: "El usuario no ha solicitado el cambio de contraseña"})
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        usuario.password = hashedPassword
        usuario.token = ""

        await usuario.save()

        return res.json({
            msg: {
                titulo: "¡Contraseña cambiada!",
                cuerpo: "Tu contraseña ha sido cambiada correctamente"
            }
        })

    }catch(error){
        console.log(error)
    }
}

const obtenerPerfil = async (req, res) => {
    const usuario = req.usuario;
    return res.status(200).json({usuario})
}

const eliminarTrabajador = async(req, res) =>{

    const { usuario } = req;
    const { id } = req.params;
    console.log(usuario)

    try{
        const trabajador = await Usuario.findById(id)
        if(!trabajador){
            const error = new Error("Ese trabajador no existe")
            return res.status(400).json({ msg: error.message })
        }
        if(trabajador.idJefe !== usuario.id){
            const error = new Error("No tienes permisos para eliminar a este trabajador")
            return res.status(400).json({ msg: error.message })
        }

        await Usuario.findByIdAndDelete(id)

    }catch(error){
        console.log(error)
    }
}



export default {
    obtenerUsuarios,
    crearUsuario,
    iniciarSesion,
    confirmarUsuario,
    completarPerfil,
    solicitarCambioPassword,
    cambiarPassword,
    obtenerPerfil,
    eliminarTrabajador
}
