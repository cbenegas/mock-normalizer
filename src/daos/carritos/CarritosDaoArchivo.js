import ContainerFile from "../../Containers/ContainerFile.js"

class CarritosDaoFile extends ContainerFile {

    constructor() {
        super('carritos.json')
    }

    async save(carrito = { productos: [] }) {
        return super.save(carrito)
    }
}

export default CarritosDaoFile
