export async function updatePost(post) {


    const idBlog = await getBlogId();
    
    const url = `https://www.googleapis.com/blogger/v3/blogs/${idBlog}/posts/${post.idPost}`;
    
    const toJSON = JSON.stringify({
        "kind": "blogger#post",
        "blog": {
            "id": idBlog
        },
        "title": title,
        "content": content
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