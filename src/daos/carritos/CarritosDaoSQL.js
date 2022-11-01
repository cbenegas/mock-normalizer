import ContainerSQL from "../../Containers/ContainerSQL.js"

class CarritosDaoSQL {

    constructor(configCarritos, configProds) {
        this.carritos = new ContainerSQL(configCarritos, 'carritos')
        this.prodsEnCarritos = new ContainerSQL(configProds, 'prodsEnCarritos')
    }

    async save(carrito = {}) {
        const result = await this.carritos.save(carrito)
        result.productos = []
        return result
    }

    async list(_idCarrito) {
        const idCarrito = Number(_idCarrito)
        await this.carritos.list(idCarrito)
        const result = {
            id: idCarrito,
            productos: []
        }
        const prodsEnCarritos = await this.prodsEnCarritos.listAll({ idCarrito })
        for (const prod of prodsEnCarritos) {
            delete prod.idCarrito
            result.productos.push(prod)
        }
        return result
    }

    async update(carrito) {
        carrito.id = Number(carrito.id)
        await this.prodsEnCarritos.deleteAll({ idCarrito: carrito.id })
        const inserts = carrito.productos.map(p => {
            return this.prodsEnCarritos.save({
                ...p,
                idCarrito: carrito.id
            })
        })
        return Promise.allSettled(inserts)
    }

    async delete(_idCarrito) {
        const idCarrito = Number(_idCarrito)
        const result = await Promise.allSettled([
            this.prodsEnCarritos.deleteAll({ idCarrito }),
            this.carritos.delete(idCarrito)
        ])
        return result
    }

    deleteAll() {
        return Promise.allSettled([
            this.carritos.deleteAll(),
            this.prodsEnCarritos.deleteAll()
        ])
    }

    async listAll() {
        const carritosIds = await this.carritos.listAll()
        const carritosMap = new Map()
        for (const obj of carritosIds) {
            carritosMap.set(obj.id, {
                id: obj.id,
                productos: []
            })
        }
        const prodsEnCarritos = await this.prodsEnCarritos.listAll()
        for (const prod of prodsEnCarritos) {
            if (carritosMap.has(prod.idCarrito)) {
                carritosMap.get(prod.idCarrito).productos.push(prod)
            }
        }
        return [...carritosMap.values()]
    }
}

export default CarritosDaoSQL
