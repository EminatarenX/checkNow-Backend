import { config } from 'dotenv'
config()
import bcrypt from 'bcrypt'
import { generarID } from "../helpers/generarId.js"
import { emailRegistro, emailCambiarPassword } from "../helpers/correos.js"
import jwt from 'jsonwebtoken'
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import Pago from "../models/Pagos.js";

// modelos
import Usuario from "../models/Usuario.js"
import Empleado from '../models/Empleado.js'
import Empresa from '../models/Empresa.js'


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
            token,
            role: "new"
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

        const token = jwt.sign({ id: existeUsuario._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

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
    
    const { id: usuario_id, correo } = req.usuario


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
                usuario: usuario_id,
            });

            await empleado.save()

        } else {
            const customer = await stripe.customers.create({
                email: correo,
                name: `${nombre} ${apellidos}`,
                phone: telefono,
            })

            const empresa = new Empresa({
                creador: usuario_id,
                stripeCustomerId: customer.id
            });
            
            await empresa.save()
  
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
        console.log(error)
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
   
    const {id, correo, verified, created_at, updated_at, nombre, apellidos, direccion, role, telefono} = req.usuario;
    
    if(req.empresa){
        const {id : empresa} = req.empresa
        let pago = {}
        const pagos = await Pago.find({id_user: empresa}).sort({createdAt: -1}).limit(1)
        
        if(pagos.length > 0){
            pago = pagos[0]
        }
        return res.status(200).json({usuario: {
            id,
            correo,
            verified,
            created_at,
            updated_at,
            nombre,
            apellidos,
            direccion,
            role,
            telefono,
            empresa,
            payment: pago
        }})
    
    }else {
        return res.status(200).json({usuario: {
            id,
            correo,
            verified,
            created_at,
            updated_at,
            nombre,
            apellidos,
            direccion,
            role,
            telefono,
            
        }})
    }
    
   
}

const actualizarUsuario = async (req, res) => {

    const { nombre, apellidos, telefono, direccion, informacion_personal } = req.body
    const { id: usuario_id } = req.usuario

    try {
        let usuario = await Usuario.findById(usuario_id)
        let empleado = await Empleado.findById(usuario.id)


        if (!usuario) {
            const error = new Error("El usuario no existe")
            return res.status(400).json({ msg: error.message })
        }

        const existeTelefono = await Usuario.findOne({ telefono })

        if(existeTelefono && existeTelefono._id != usuario_id){
            const error = new Error("El telefono ya esta registrado")
            return res.status(400).json({ msg: error.message })
        }

        usuario.nombre = nombre
        usuario.apellidos = apellidos
        usuario.telefono = telefono
        usuario.direccion = direccion
        empleado.informacion_personal = informacion_personal
 
        await usuario.save()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "Hubo un error, Intenta mas tarde", error })
    }
}

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        return res.status(200).json({ usuarios })
    } catch (error) {
        return res.status(500).json({ error })
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
    actualizarUsuario
}
