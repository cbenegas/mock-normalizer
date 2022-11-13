import express from 'express'
import productosRouter from './routers/producto.router.js';
import carritosRouter from './routers/carrito.router.js';

import chatSocket from './socket/chat.js';

import handlebars from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';

//------------------------------------------------------------------------
// instancio servidor

const app = express()
//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

app.get('/', (req, res) => {
    return res.render("index");
});

// Config del front
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    }),
)

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static('public'))

chatSocket();


export default bootServer
