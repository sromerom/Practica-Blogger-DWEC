import { getBlogId } from './getBlogId.js';
import { Post } from "../model/post.js";

export async function getPostById(postId) {
    const idBlog = await getBlogId();
    const url = `https://www.googleapis.com/blogger/v3/blogs/${idBlog}/posts/${postId}`;

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess")
        },
    });

    let post = await response.json();
    return new Post(post.id, post.blog.id, post.author, post.published, post.updated, post.url, post.title, post.content, post.labels);
}