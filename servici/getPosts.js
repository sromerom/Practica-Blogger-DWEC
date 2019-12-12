import { Post } from "../model/post.js";

export async function getPost(blogId) {
    const url = 'https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess")
        },
    });

    let responseJSON = await response.json();
    
    //(idPost, idBlog, author, published, updated, url, title, content)
    let fetchToObject = responseJSON.items.map(post=> {
        return new Post(post.id, post.blog.id, post.author, post.published, post.updated, post.url, post.title, post.content, post.labels);
    })

    return fetchToObject;
}