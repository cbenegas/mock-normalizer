import express from 'express'
import productosRouter from './routers/producto.router.js';
import carritosRouter from './routers/carrito.router.js';

//------------------------------------------------------------------------
// instancio servidor

const app = express()

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app


server => express
server => Http
server => Socket.io