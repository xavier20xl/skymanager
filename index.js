import express from 'express'
import dotenv from 'dotenv'

// cargar las variables del .env dentro de process.env
dotenv.config()

// crear la aplicacion: este objeto ES nuestro servidor
const app = express()

// MIDDLEWARE global: convierte el body JSON de las peticiones en objeto JS
// y lo deja disponible en req.body
app.use(express.json())

// el puerto viene del .env; si no existe, respaldo en 3000
const PORT = process.env.PORT || 3000

// ruta raiz de prueba
app.get('/', (req, res) => {
    res.send('API de SkyManager - Gestion de vuelos')
})

// arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en marcha en: http://localhost:${PORT}`)
})
