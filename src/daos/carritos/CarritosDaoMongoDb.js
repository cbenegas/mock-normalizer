import ContainerMongoDb from "../../Containers/ContainerMongoDb.js"

class CarritosDaoMongoDb extends ContainerMongoDb {

    constructor() {
        super('carritos', {
            productos: { type: [], required: true }
        })
    }
}

export default CarritosDaoMongoDb
