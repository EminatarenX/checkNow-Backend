import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from 'dotenv'
import fs from 'fs'
config()

const region = process.env.AWS_REGION
const ACCESS_KEY_ID = process.env.AWS_BUCKET_PUBLIC_KEY
const SECRET_ACCESS_KEY = process.env.AWS_BUCKET_SECRET_KEY
const BUCKET_NAME = process.env.AWS_BUCKET


const client = new S3Client({
    region,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
})

async function uploadFile(file, params) {
    const { empresa, nomina } = params
    
    const folder = `nominas/${empresa}`
    const Body = Buffer.isBuffer(file) ? file : fs.createReadStream(file);

    const uploadParams ={
        Bucket: BUCKET_NAME,
        Key: `${folder}/${nomina}`,
        Body
    }

    const command = new PutObjectCommand(uploadParams)
    const result = await client.send(command)

    return {result, uploadParams}
}

async function getFile(filename) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    })

    const signedUrl = await getSignedUrl(client, command, {expiresIn: 3600})

    return signedUrl
}

async function getAllNominas(user) {
    const command = new ListObjectsCommand({
        Bucket: BUCKET_NAME,
        Prefix: `nominas/${user}`
    })

    const result = await client.send(command)

    const urls = await Promise.all(result.Contents.map(async item => {
        return await getFile(item.Key)
    }))
    return urls

}


export {
    client,
    uploadFile,
    getFile,
    getAllNominas
    
}