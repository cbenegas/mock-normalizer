import express from 'express'
const { Router } = express

import { productosDao as productosApi } from '../daos/index.js'

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
        const productsObjet = await productosApi.listAll()

        const productsJSON = JSON.parse(JSON.stringify(productsObjet));

        return res.render("products", 
        { 
            products: productsJSON,
            haveProducts: productsJSON.length > 0
        })
    } catch(e){
        console.log(e);
        res.send({
            data: e.message,
            error: true
        });
    }
})

productosRouter.get('/test', async (req, res) => {
    try{
        const productos = await productosApi.popular()
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
        const { title, price, thumbnail } = req.body;
        console.log("REQ: ", req)
        // const body = req.body;
        console.log("🚀 ~ file: producto.router.js ~ line 82 ~ productosRouter.post ~ body", body)
        const producto = await productosApi.save({ title, price, thumbnail });
        // return res.redirect("/");
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

    const { title, price, thumbnail } = req.body;
    try {

    } catch (e) {
        return res
        .status(404)
        .send({
            error: true,
            msg: "Lo sentimos. Ha ocurrido un error. Intente nuevamente mas tarde.",
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


export default productosRouter