import express from 'express'
import productosRouter from './routers/producto.router.js';
import carritosRouter from './routers/carrito.router.js';

import handlebars from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';

import { Server as IOServer} from 'socket.io';
import { Server as HttpServer } from 'http';
// import app from '../bootServer';
import messagesDAOMongo from './daos/messages/messagesDAOMongo.js';

const PORT = 8091

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use('/productos', productosRouter)
app.use('/carritos', carritosRouter)

// Config del front
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    return res.render("index");
});
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    }),
)

app.set("views", "./views");
app.use(express.static('public'))
app.set("view engine", "hbs");
//------------------------------------------------------------------------
// instancio servidor

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))


//--------------------------------------------
// configuro el servidor

const dbMsg = new messagesDAOMongo();

// const serverSocket = httpServer.listen( PORT, () => {
//     console.log(`Listening on port ${ PORT }`);
// });

// serverSocket.on( "Error", error => console.log(`Error while listening on port ${PORT}: ${error}`) );

io.on('connection', async ( socket ) => {
    // const products = await dbProducts.popular();
    // socket.emit('products', products);
    
    const { wasError, data } = await dbMsg.getAllMessages();
    !wasError && socket.emit("mensajes", data);

    socket.on("new_msg", async (data) => {
        console.log('new_msg',data);
        const { wasError, data: newMsg} = await dbMsg.insertMessages({...data});
        
        if (!wasError){
            const { wasError:Error, data } = await dbMsg.getAllMessages();
            console.log('back',data);
            !Error && io.sockets.emit("mensajes", data);
        }
        // socket.to().emit('evento', 'data')
    });
})
