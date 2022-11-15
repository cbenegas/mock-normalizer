import { schema } from "normalizr";

const authorSchema = new schema.Entity('authors',{}, {idAttribute: 'email'});
const textSchema = new schema.Entity('texts',{},{idAttribute: 'ind'});
const articlesSchema = new schema.Entity('chats', {
    author: authorSchema,
    text: textSchema
});
const postSchema = new schema.Entity('posts',{
    posts: [articlesSchema]
})

export default postSchema