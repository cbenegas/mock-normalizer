import { normalize, schema }  from 'normalizr';
import ContainerMongoDb from '../../containers/ContainerMongoDb.js';
import util from 'util';

const requiredFields = ['email','name','lastname','age','alias','avatar','text'];

class messagesDAOMongo extends ContainerMongoDb {

    constructor() {

        super('messages',{
            email: { type: String},
            name: { type: String},
            lastname: { type: String },
            age: { type: String },
            alias: { type: String },
            avatar: { type: String},
            text: { type: String}
    })
    }
    insertMessages(data) {
        try{
            requiredFields.forEach((element) => {
                if(data[element] === undefined) {
                    return {wasError: true, data: `${data[element]} undefined, field is required`}; 
            }})
            this.save({...data});
        }catch(e){
            throw new Error(e);
        }
    }

    async getAllMessages() {
        try{
            const messages = await this.listAll();
            const data = messages.map( ({ _id, email, name, lastname, age, alias, avatar, text },ind) => {
                return (
                    {   
                        id: _id,
                        author: {
                            email,
                            name,
                            lastname,
                            age,
                            alias,
                            avatar
                        },
                        text: {
                            text,
                            ind
                        }
                    })
                }
            );
            const rawData = {
                id: 'mensajes',
                posts: data
            }
            const authorSchema = new schema.Entity('authors',{}, {idAttribute: 'email'});
            const textSchema = new schema.Entity('texts',{},{idAttribute: 'ind'});
            const articlesSchema = new schema.Entity('chats', {
                author: authorSchema,
                text: textSchema
            });
            const postSchema = new schema.Entity('posts',{
                posts: [articlesSchema]
            })
            const normalizedData = normalize(rawData || [], postSchema);
            const normalizedDataJSON = JSON.parse(JSON.stringify(normalizedData));
            return normalizedDataJSON
        }catch(e){
            throw new Error(e);
        }
    }
}

export default messagesDAOMongo