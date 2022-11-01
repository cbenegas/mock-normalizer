import express from 'express'
const { Router } = express

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'

//------------------------------------------------------------------------
// instancio servidor

const app = express()

//--------------------------------------------
// permisos de administrador

const adminAuth = (permissions) => {

    return (req, res, next) => {
        permissions === true
        ? next()
        : res
            .status(401)
            .json({ error: -1, description: "unauthorized permission" });
    };
};

//--------------------------------------------
// configuro router de productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    try{
        const productos = await productosApi.listAll()
        res.send({
            data: productos,
            error: false
        });
    } catch(e){
        console.log(e);
        res.send({
            data: e.message,
            error: true
        });
    }
})

productosRouter.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const producto = await productosApi.list(id);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

productosRouter.post('/', adminAuth(true), async (req, res) => {
    try{
        const body = req.body;
        const producto = await productosApi.save(body);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        console.log(e);
        res.send({
            data: e.message,
            error: true
        });
    }
})

productosRouter.put('/:id', adminAuth(true), async (req, res) => {
    try{
        const body = req.body;
        const producto = await productosApi.update(body);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

productosRouter.delete('/:id', adminAuth(true), async (req, res) => {
    try{
        const { id } = req.params;
        const producto = await productosApi.delete(id);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
    try{
        const productos = await carritosApi.listAll()
        res.send({
            data: productos,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

carritosRouter.post('/', async (req, res) => {
    try{
        const body = req.body;
        const producto = await carritosApi.save(body);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

carritosRouter.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const producto = await carritosApi.delete(id);
        res.send({
            data: producto,
            error: false
        });
    } catch(e){
        res.send({
            data: e.message,
            error: true
        });
    }
})

//--------------------------------------------------
// router de productos en carrito

// carritosRouter.get('/:id/productos', async (req, res) => {
    
// })

// carritosRouter.post('/:id/productos', async (req, res) => {
    
// })

// carritosRouter.delete('/:id/productos/:idProd', async (req, res) => {
    
// })

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app