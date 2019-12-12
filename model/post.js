export class Post {
    constructor(idPost, idBlog, author, published, updated, url, title, content, labels) {
        this.idPost = idPost;
        this.idBlog = idBlog;
        this.author = author;
        this.published = published;
        this.updated = updated;
        this.url = url;
        this.title = title;
        this.content = content;
        this.labels = labels;
    }
}