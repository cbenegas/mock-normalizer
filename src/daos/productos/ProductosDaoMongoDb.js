import ContainerMongoDb from "../../containers/ContainerMongoDb.js"
import generarProducto from "../test/generarProducto.js";

class ProductosDaoMongoDb extends ContainerMongoDb {

    constructor() {
        super('productos', {
            title: { type: String},
            price: { type: Number},
            thumbnail: { type: String},
        })
    }
    async popular(cant = 5) {
        const nuevos = []
        for (let i = 1; i <= cant; i++) {
            const nuevoProducto = await generarProducto();
            nuevos.push(nuevoProducto);
        }
        return {wasError: false, data: nuevos};
    }

}

export default ProductosDaoMongoDb
