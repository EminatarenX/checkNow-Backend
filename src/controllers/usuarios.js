import Usuario from "../models/Usuario.js"
import bcrypt from 'bcrypt'
import { generarID } from "../helpers/generarId.js"
import { emailRegistro } from "../helpers/confirmarCuenta.js"

const obtenerUsuarios = async(req, res) => {
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
        const usuarioExiste = await Usuario.findOne({correo})

        if(usuarioExiste) {
            const error = new Error("El usuario ya esta registrado")
            return res.status(400).json({msg: error.message})
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const token = generarID()

        emailRegistro({correo, token})

        const usuario = new Usuario({
            correo, 
            password: hashedPassword,
            token
        })



        await usuario.save()

        return res.json({
            msg: {
                titulo: "Cuenta creada!",
                cuerpo: "Hemos enviado un mensaje de verificación a tu correo electrónico"
            },
            usuario
        })
        
    } catch (error) {
        return res.status(400).json({msg: "Hubo un error, Intenta mas tarde", error})
    }
}

export default {
    obtenerUsuarios,
    crearUsuario
}
