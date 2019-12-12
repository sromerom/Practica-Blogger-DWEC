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