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