export async function createPost(post) {
    
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
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: toJSON
    });
    
}

export async function deletePost(idBlog, idPost) {

    const url = `https://www.googleapis.com/blogger/v3/blogs/${idBlog}/posts/${idPost}`;


    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
}

export async function getBlogId() {
    let response = await fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess")
        },
    });

    let responseJSON = await response.json();
    return responseJSON.items[0].id;
}

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




export async function getLanguages() {
    const dataFetch = await fetch("http://server247.cfgs.esliceu.net/bloggeri18n/blogger.php", {
        method: 'POST',
        body: JSON.stringify({
            MethodName: 'languages',
            params: ''
        }),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })

    const languages = await dataFetch.json();
    return languages;
}

export async function translate(source, target, text) {
    const dataFetch = await fetch("http://server247.cfgs.esliceu.net/bloggeri18n/blogger.php", {
        method: 'POST',
        body: JSON.stringify({
            MethodName: 'translate',
            params: {
                source: source,
                target: target,
                text: text
            }
        }),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    const translate = await dataFetch.json();
    return translate;
}

export async function updatePost(post) {

    const url = `https://www.googleapis.com/blogger/v3/blogs/${post.idBlog}/posts/${post.idPost}`;

    const toJSON = JSON.stringify({
        "id": post.idPost,
        "kind": "blogger#post",
        "blog": {
            "id": post.idBlog
        },
        "author": post.author,
        "published": post.published,
        "url": post.url,
        "selfLink": url,
        "title": post.title,
        "content": post.content,
        "labels": post.labels
    });

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: toJSON
    });

}