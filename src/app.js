import express from 'express';
import session from "express-session";
import MongoStore from "connect-mongo";


import productosRouter from './routers/producto.router.js';
import userRouter from './routers/user.router.js';
import carritosRouter from './routers/carrito.router.js';

import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import { Server as IOServer} from 'socket.io';
import { Server as HttpServer } from 'http';

import messagesDAOMongo from './daos/messages/messagesDAOMongo.js';

const PORT = 8099

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const isLogged = (req, res, next) => {
    if (!req.session.username){
        res.redirect("/user/login")
    }
    next();
};

app.use(
    session({
        secret: "32m32e90me2393",
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://einsua91:0AsDIACXvDmHDQug@cluster0.j7gmil7.mongodb.net/test",
            mongoOptions: advancedOptions,
        }),
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use('/productos', isLogged, productosRouter);
app.use('/user', userRouter);
// app.use('/carritos', carritosRouter)

// Config del front
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("views", "./views");
app.use(express.static(__dirname))
app.set("view engine", "hbs");



app.get('/', isLogged, (req, res) => {
    return res.render("index", {layout: 'main', username: req.session.username}); 
});




app.get('/*', (req, res) => {
    res.redirect("/")
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
    const mensajes = await dbMsg.getAllMessages();
    io.sockets.emit("mensajes", mensajes);

    socket.on("new_msg", async (data) => {
        dbMsg.insertMessages({...data});
        const mensajes = await dbMsg.getAllMessages();
        io.sockets.emit("mensajes", mensajes);
    });
})