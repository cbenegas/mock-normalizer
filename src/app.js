import express from 'express'
import productosRouter from './routers/producto.router.js';
import carritosRouter from './routers/carrito.router.js';
import { denormalize } from 'normalizr';
import postSchema from './daos/messages/postSchema.js';

import handlebars from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';

import { Server as IOServer} from 'socket.io';
import { Server as HttpServer } from 'http';
// import app from '../bootServer';
import messagesDAOMongo from './daos/messages/messagesDAOMongo.js';

const PORT = 8095

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
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

io.on('connection', async ( socket ) => {

    socket.on("new_msg", async (data) => {
        dbMsg.insertMessages({...data});
        const mensajes = await dbMsg.getAllMessages();
        const normalizedDataJSON = JSON.parse(JSON.stringify(mensajes));
        const desnormalize = await denormalize(normalizedDataJSON.result, postSchema, normalizedDataJSON.entities)
        console.log("🚀 ~ file: messagesDAOMongo.js ~ line 71 ~ messagesDAOMongo ~ getAllMessages ~ desnormalize", desnormalize)
        io.sockets.emit("mensajes", desnormalize);
    });
})