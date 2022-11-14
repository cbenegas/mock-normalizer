import { normalize, schema }  from 'normalizr';
import util from 'util';



const msgs = [{
    _id: '6371aaeae8d5b8494c8689f5',
    id: 'benegascristian@gmail.com',
    name: 'Cristian',
    lastname: 'Benegas',
    age: 'asdf',
    alias: 'asdf',
    avatar: 'asfdasfasfasdfasf',
    text: 'asdfasdfasdf',
    __v: 0
  },{
    _id: '6371ab5de8d5b8494c8689f9',
    id: 'benegascristian@gmail.com',
    name: 'Cristian',
    lastname: 'Benegas',
    age: 'asdf',
    alias: 'asdf',
    avatar: 'asfdasfasfasdfasf',
    text: '<sd<sd<zsd',
    __v: 0
  }]

const data = msgs.map( ({ _id, id, name, lastname, age, alias, avatar, text },ind) => {
              return (
                      { ind,
                        author: {
                          id,
                          name,
                          lastname,
                          age,
                          alias,
                          avatar
                      },
                        text: {
                          text,
                          _id
                        }
                      })}
                    );



const rawData = {
  id: 'mensajes',
  post: data
}
const authorSchema = new schema.Entity('authors',{},{idAtribute: 'email'});
const textSchema = new schema.Entity('text',{},{idAtribute: '_id'});
const postSchema = new schema.Entity('posts',{
    author: authorSchema,
    text: [textSchema]
});

const normalizedData = normalize(rawData || [], postSchema);
console.log(`GET_ALL_MSG: ${util.inspect(normalizedData,false,12,true)}`)