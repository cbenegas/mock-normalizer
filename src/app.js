const express = require('express');
const handlebars = require('express-handlebars');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const { router: routerProducts } = require('./routes/productos');
const { Products } = require('./routes/routerProducts.controller');
const {mariaDb} = require('../config/config');
const messagesDAOMongo = require('./daos/messages/messagesDAOMongo');
const { ApiProductoMock } = require('../test/ApiProductosMock');


// const dbProducts = new Products( mariadbConfig, productsTableName );
const dbProducts = new ApiProductoMock(mariaDb.mariaDbConfig, mariaDb.productsTableName);
const PORT = 8095;

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);



const dbMsg = new messagesDAOMongo();

app.use('/productos', routerProducts);

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

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
app.use(express.static("public"));


app.set("view engine", "hbs");

const server = httpServer.listen( PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});



server.on( "Error", error => console.log(`Error while listening on port ${PORT}: ${error}`) );

io.on('connection', async ( socket ) => {
    const products = await dbProducts.popular();
    const { wasError, data } = await dbMsg.getAllMessages();
    socket.emit('products', products);
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

    socket.on('new_product', async ( newProduct ) => {
        console.log('producto recivido')
        console.log('new_product',newProduct);
        await dbProducts.save(newProduct);
        const products = await dbProducts.getAll();
        io.sockets.emit('products', products);
    })
})


