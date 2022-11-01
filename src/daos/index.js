import config from '../config.js'

let productosDao
let carritosDao

switch (config.TypeDB) {
    case 'json':
        const { default: ProductosDaoFile } = await import('./productos/ProductosDaoFile.js')
        const { default: CarritosDaoFile } = await import('./carritos/CarritosDaoFile.js')

        productosDao = new ProductosDaoFile()
        carritosDao = new CarritosDaoFile()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js');
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js');
        
        productosDao = new ProductosDaoFirebase();
        carritosDao = new CarritosDaoFirebase();    

        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js');
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js');
        
        productosDao = new ProductosDaoMongoDb();
        carritosDao = new CarritosDaoMongoDb();
        break
    case 'mariadb':
        
        break
    case 'sqlite3':
        
        break
    default:
        
        break
}

export { productosDao, carritosDao }