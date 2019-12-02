import { getBlogId } from './getBlogId.js';

export async function createPost(post) {

    //console.log(post)
    const idBlog = await getBlogId();
    const url = `https://www.googleapis.com/blogger/v3/blogs/${idBlog}/posts/`;
    const toJSON = JSON.stringify({
        "kind": "blogger#post",
        "blog": {
            "id": idBlog
        },
        "title": post.title,
        "content": post.content,
        "labels" : post.labels
    });
    
    const createFetch = fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: toJSON
    });
    
}