import express from 'express'
const { Router } = express

import { carritosDao as carritosApi } from '../daos/index.js'

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

export default carritosRouter
