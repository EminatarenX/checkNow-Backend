import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Empresa from "../models/Empresa.js";

async function checkAuth(req, res, next) {
    let token;

   try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]

        const {id} = await jwt.verify(token, process.env.JWT_SECRET)

        let usuario = await Usuario.findById(id)

        if(!usuario) {
            return res.status(401).json({msg: "No autorizado"})
        }

        req.usuario = usuario
        

        if(usuario.role !== "admin") {
            return next()
        }
    
        const empresa = await Empresa.findOne({creador: id})
        
        if(!empresa) {
            return next()
        }

        req.empresa = empresa

        return next()


    }else {
        return res.status(401).json({msg: "No autorizado"})
    }
    
   } catch (error) {

    console.log(error)
        return res.status(401).json({msg: "No autorizado"})
   }
}

export { checkAuth }