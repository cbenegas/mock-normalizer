import ContainerMongoDb from "../../containers/ContainerMongoDb.js"

class ProductosDaoMongoDb extends ContainerMongoDb {

    constructor() {
        super('productos', {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
        })
    }
}

export default ProductosDaoMongoDb
