export async function updatePost(post) {

    console.log("idPost: " + post.idPost);
    console.log("idBlog: " + post.idBlog);
    console.log("author: " + post.author);
    console.log("published: " + post.published)
    console.log("updated: " + post.updated)
    console.log("url: " + post.url);
    console.log("title: " + post.title);
    console.log("content: " + post.content);
    console.log("labels: " + post.labels);

    //const idBlog = await getBlogId();

    const url = `https://www.googleapis.com/blogger/v3/blogs/${post.idBlog}/posts/${post.idPost}`;


    /*
    const toJSON = JSON.stringify({
        "kind": "blogger#post",
        "id": post.idPost,
        "blog": {
         "id": post.idBlog
        },
        "url": post.url,
        "selfLink": url,
        "title": post.title,
        "content": post.content
    });
*/

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


    const createFetch = fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: toJSON
    });

}