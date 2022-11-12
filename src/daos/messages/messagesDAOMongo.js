const {normalize, schema}  = require('normalizr');
const ContainerMongoDb = require('../../containers/ContainerMongoDb');

/* 
    {
        authors: { 
            id: "mail",
            name: "",
            lastname: "",
            age: "",
            alias: "",
            avatar: ""
        },
        text: "messages",
    }
*/

const requiredFields = ['email','name','lastname','age','alias','avatar','text'];

class messagesDAOMongo extends ContainerMongoDb {

    constructor() {
        
        super('messages',{
            id: { type: String},
            name: { type: String},
            lastname: { type: String },
            age: { type: String },
            alias: { type: String },
            avatar: { type: String},
            text: { type: String}
    })
    }

    getAllMessages() {
        const messages = this.listAll();
        if (messages.wasError){
            return {wasError: true, data: messages.data} 
        }
        const authorSchema = new schema.Entity('authors',{},{idAtribute: 'email'});
        const textSchema = new schema.Entity('text');
        const postSchema = new schema.Entity('posts',{
            author: authorSchema,
            text: [textSchema]
        });
        const normalizedData = normalize(messages.data || {}, postSchema);
        // console.log(normalizedData)
        return {wasError: false, data: normalizedData}
    }
    insertMessages(data) {
        requiredFields.forEach((element) => {
            if(data[element] === undefined) {
                return {wasError: true, data: `${data[element]} undefined, field is required`}; 
        }})
        this.save({...data});
        const messages = this.listAll();
        if (messages.wasError){
            return {wasError: true, data: messages.data} 
        }
        const authorSchema = new schema.Entity('authors', {idAtribute: 'email'});
        const textSchema = new schema.Entity('text');
        const postSchema = new schema.Entity('posts',{
            author: authorSchema,
            text: [textSchema]
        });
        const normalizedData = normalize(messages.data || {}, postSchema);
        console.log(normalizedData)
        return {wasError: false, data: normalizedData}
    }
}

module.exports = messagesDAOMongo