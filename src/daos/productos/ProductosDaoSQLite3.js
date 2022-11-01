import ContainerSQL from "../../Containers/ContainerSQL.js"
import config from '../../config.js'

class ProductosDaoSQLite3 extends ContainerSQL {

    constructor() {
        super(config.sqlite3, 'productos')
    }
}

export default ProductosDaoSQLite3
