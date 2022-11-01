import ContainerMemoria from "../../Containers/ContainerMemoria.js"

class ProductosDaoMem extends ContainerMemoria {
    constructor() {
        super('productos.json')
    }
}

export default ProductosDaoMem
