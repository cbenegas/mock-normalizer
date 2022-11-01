import admin from "firebase-admin"
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContainerFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async list(id) {
        try {
            const productFound = await this.coleccion.doc(`${id}`).get();
            if (productFound) {
                return { error: false , msg: `Producto obtenido. Id: ${productFound.id}`, data: {...productFound.data(), id: productFound.id} };
            } else {
                return { error: true, 
                        msg: "No hay datos.", 
                        data: {} 
                    };
            }
        } catch (e) {
            return { error: [e.message], msg: "Lo sentimos. Ocurrio un error insepearado.", data: {} };
        }
    }

    async listAll() {
        try{
            let productos = [];
            const coleccionSnapshot = await this.coleccion.get();
            coleccionSnapshot.forEach((doc) => productos.push({ id: doc.id, ...doc.data() }));
            return { error: [], 
                msg: "Productos obtenidos.", 
                data: productos 
            };
        } catch(e){
            console.log(e);
            return {
                data: e.message,
                error: true
            };
        }
    }

    async save(nuevoElem) {
        try {
            nuevoElem.timestamp = new Date();
            const productoAddedId = await this.coleccion.add( nuevoElem );
            return {
                error: [],
                msg: `Producto Agregado correctamente con el id: ${productoAddedId.id}`,
                data: productoAddedId
            };
        } catch (e) {
            return {
                error: [e.message],
                msg: "Lo sentimos. Ocurrio un error inesperado",
                data: {}
            };
        }
    }

    async update(id,nuevoElem) {
        if (typeof(nuevoElem) !== 'object') {
            return { 
                error: ["Error en el tipo de dato pasado como parámetro."], 
                msg:"Los nuevos valores deben enviarse en formato objeto",
                data: {}
            };
        }
        try {
            const productFound = await this.coleccion.doc(`${id}`).get();
            const newProduct = { ...productFound.data(), id: productFound.id, ...nuevoElem }
            const productUpdate = await this.coleccion.doc(id).set({...newProduct});
            if (productUpdate) {
                return { error: false, msg: `Producto modificado Exitosamente. Id ${id}`, data:{} };
            } else {
                return { error: ["Ocurrio un error al buscar el producto"], msg:"Lo sentimos"  };
            }
        } catch (e) {
            return { error: [e.message], msg: "Lo sentimos. Ocurrio un error inseperado." };
        }
    }

    async delete(id) {
        try {
            const data = await this.coleccion.doc(id).delete();
            if (data) {
                return { error: false, msg: "Documento eliminado correctamente." };
            } else {
                return { error: [data.msg], msg: "No se encontró el documento." };
            }
        } catch (e) {
            return { error: [e.message], msg: "Lo sentimos. Ocurrio un error inesperado." };
        }
    }

    async deleteAll() {
        try {
            const data = await this.coleccion.doc().delete();
            if (data) {
                return { error: false, msg: "Documento vaciado correctamente." };
            } else {
                return { error: [data.msg], msg: "No se encontró el documento." };
            }
        } catch (e) {
            return { error: [e.message], msg: "Lo sentimos. Ocurrio un error inesperado." };
        }
    }

    async desconectar() {
    }
}

export default ContainerFirebase