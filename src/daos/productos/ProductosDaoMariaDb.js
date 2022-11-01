import ContainerSQL from "../../Containers/ContainerSQL.js"
import config from '../../config.js'

class ProductosDaoMariaDb extends ContainerSQL {

    constructor() {
        super(config.mariaDb, 'productos')
    }
}

export default ProductosDaoMariaDb
