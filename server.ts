import { app } from './app'
import connectDB from './utils/db'
require('dotenv').config()
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  secret_key: process.env.CLOUD_SECRET_KEY,
})
app.listen(process.env.PORT, () => {
  console.log(`Servidor esta conectado com a port ${process.env.PORT}`)
  connectDB()
})
