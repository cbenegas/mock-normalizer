const socket = io.connect();

socket.on('products', data => {
    // TODO: aqui cargar los datos a mostrar
    console.log(`[index] data: ${data}`);
})