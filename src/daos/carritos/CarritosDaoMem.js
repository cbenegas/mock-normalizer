import ContainerMemoria from "../../Containers/ContainerMemoria.js"

class CarritosDaoMem extends ContainerMemoria {

    async save(carrito = { productos: [] }) {
        return super.save(carrito)
    }
}

export default CarritosDaoMem
