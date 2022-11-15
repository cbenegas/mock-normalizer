import postSchema from "./daos/messages/postSchema.js";

const socket = io.connect();

async function render_msj(data) {
    console.log("🚀 ~ file: main.hbs ~ line 131 ~ render_msj ~ data", data)
    const desnormalize = await denormalize(data.result, postSchema, data.entities)
    console.log(desnormalize);
    const html = desnormalize.map( (msg) => `<li class="clearfix">
                                    <div class="message-data">
                                        <span class="fw-bold text-primary">${msg.email}</span>
                                        <span class="text-success">[${msg.name}]</span>
                                        <span class="fst-italic">${msg.text}</span>
                                    </div>
                                    </li>`).join(" ");
    document.getElementById("mensajes").innerHTML = html; 
}

function enviarMensaje(event) {
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const age = document.getElementById("age").value;
    const alias = document.getElementById("alias").value;
    const avatar = document.getElementById("avatar").value;
    const text = document.getElementById("chat_mensaje").value;
    document.getElementById("chat_mensaje").value = "";
    const data = {email,name,lastname,age,alias,avatar,text}
    socket.emit("new_msg", data);
    return false;
}

socket.on("mensajes", (data) => {
    render_msj(data);
});