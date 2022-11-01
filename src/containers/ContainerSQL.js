import knex from 'knex'

class ContainerSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async list(id) {

    }

    async listAll(criterio = {}) {
 
    }

    async save(elem) {

    }

    async update(elem) {
 
    }

    async delete(id) {

    }

    async deleteAll(criterio = {}) {

    }
}

export default ContainerSQL