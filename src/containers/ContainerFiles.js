import { promises as fs } from 'fs'
import config from '../config.js'

class ContainerFile {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async list(id) {
        try {
            const content = await this.readFile();
            let element = content.find( obj => obj.id === id)
            return element
        }catch {
            console.error("Error al obtener el elemento")
        }  
    }

    async listAll() {
        return await this.readFile()
    }

    async save(obj) {
        let obj = { ...newObj };
        try{
            let data = await this.readFile();
            let id = 1;
            if ( data.length > 0 ){
                const lastId = data[data.length-1].id
                id = lastId + 1;
            } else {
                data = [];
            }
            obj['id'] = id;
            console.log(typeof(data))
            data.push(obj);
            console.log(data);
            await this.saveFile(JSON.stringify(data));
        }catch(er){
            console.error("Archivo no actualizado.", er)
        }
    }

    async update(elem) {
        try {
            const content = await this.readFile();
            let elements = content.filter( obj => obj.id !== id);
            let element = content.find( obj => obj.id === id);
            if (element) {
                element = {...newObj, id: id}
                elements.push(element);
                elements.sort(function (a, b) {
                    if (a.id > b.id) { return 1 }
                    if (a.id < b.id) { return -1 }
                });
                await this.saveFile(elements);
            } else {
                return null;
            }
        } catch{
            console.error("Error al editar el elemento")
        }
    }

    async delete(id) {
        try {
            const content = await this.readFile();
            const element = content.filter( obj => obj.id !== id)
            await this.saveFile(JSON.stringify(element))
        }catch {
            console.error("Error al eliminar el elemento")
        }
    }

    async deleteAll() {
        try{
            await this.saveFile('');
            console.log("Archivo borrado correctamente")
        }catch {
            console.error(`Error al borrar el contenido.`)
        }
    }
}


export default ContainerFile