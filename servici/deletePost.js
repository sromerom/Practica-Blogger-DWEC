export async function deletePost(idBlog, idPost) {

    const url = `https://www.googleapis.com/blogger/v3/blogs/${idBlog}/posts/${idPost}`;


    const createFetch = fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
}