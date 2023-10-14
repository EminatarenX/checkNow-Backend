import mongoose from 'mongoose'
import {config} from 'dotenv'
config()

const url = process.env.DB_URL

const ConectarDB = async () => {
    try {
  
        await mongoose.connect(url)
        console.log("Conectado a db")

        
    } catch (error) {
        console.log(error)
    }
}

export {
    ConectarDB
}