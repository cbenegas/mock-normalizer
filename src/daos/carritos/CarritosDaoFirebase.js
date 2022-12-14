import ContainerFirebase from "../../Containers/ContainerFirebase.js"

class CarritosDaoFirebase extends ContainerFirebase {

    constructor() {
        super('carritos')
    }

    async save(carrito = { productos: [] }) {
        return super.save(carrito)
    }
}

export default CarritosDaoFirebase


const prueba = await new CarritosDaoFirebase().listAll();

console.log(prueba);