import bootServer from './bootServer.js'

const PORT = 8091
const server = bootServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))
