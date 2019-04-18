const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let albumsDivEl;
let loadButtonEl;

function createPhotos(content) {
    let photos = document.createElement('p');
    let title = document.createElement('h3');
    title.innerHTML = "Photos";
    photos.appendChild(title);

    for (let i = 0; i < content.length; i ++) {
        const photo = content[i];

        const a = document.createElement('a');
        a.href = photo.url;
        const thumbnail = document.createElement('img');
        thumbnail.src = photo.thumbnailUrl;
       
        a.appendChild(thumbnail)
        photos.appendChild(a);
    }
    return photos;
}

function createComment(comments) {
    let commentList = document.createElement('ul');
    let title = document.createElement('h3');
    title.innerHTML = "Comments";
    commentList.appendChild(title);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        const oneComment = document.createElement('li');
        
        const comTitle = document.createElement('strong');
        comTitle.setAttribute('postId', comment.postId);
        comTitle.setAttribute('id', comment.id);
        comTitle.innerHTML = comment.name;

        const comEmail = document.createElement('i');
        comEmail.innerHTML = '<br>' + comment.email + '<hr>';

        const comBody = document.createElement('p');
        comBody.innerHTML = comment.body;

        oneComment.appendChild(comTitle);
        oneComment.appendChild(comBody);
        oneComment.appendChild(comEmail);

        commentList.appendChild(oneComment);

    }
    return commentList;
}

function onPhotosReceived() {
    const text = this.responseText;
    const content = JSON.parse(text);

    const albumId = content[0].albumId;

    const album = document.getElementById('albumId'+albumId);
    debugger;
    const albumList = album.parentElement.parentElement.childNodes;

    for (let i = 0; i < albumList.length; i ++) {
        const check = albumList[i].firstChild;
        if (check.childElementCount>0) {
            check.removeChild(check.lastChild);
            if (check.isEqualNode(album)) {
                return;
            }
        }
    }
    album.appendChild(createPhotos(content));
}

function onCommentsReceived() {
    
    const text = this.responseText;
    const comments = JSON.parse(text);

    //error handling... not done
    if (comments.length > 0) {
        var postId = comments[0].postId;
    } else {
        return;
    }
    //---
 
    const post = document.getElementById('postNumber'+postId);
    const postList = post.parentElement.parentElement.childNodes;

    for (let i = 0; i < postList.length; i++) {
        const check = postList[i].firstChild;
        if (check.childElementCount>1) {
            check.removeChild(check.lastChild);
            if (check.isEqualNode(post)) {
                return;
            }
        }
    }
    post.appendChild(createComment(comments));
}

function onLoadComments() {
    postId = this.getAttribute('postId');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function onLoadPhotos() {
  //  debugger;
    albumId = this.getAttribute('albumId');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPhotosReceived);
    xhr.open('GET',BASE_URL + '/photos?albumId=' + albumId);
    xhr.send();
}

function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const strongEl = document.createElement('strong');
        const albumId = album.id;

        strongEl.innerHTML = album.title;
        strongEl.setAttribute('id', 'albumId'+albumId);
        strongEl.setAttribute('albumId', albumId);

        strongEl.addEventListener('click', onLoadPhotos);

        const liEl = document.createElement('li');

        liEl.appendChild(strongEl);
        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong'); 
        postId = post.id;   
        strongEl.textContent = post.title;
        strongEl.setAttribute('postId', postId);
      
        const pEl = document.createElement('p');
        pEl.setAttribute('id', 'postNumber'+postId);
        
        pEl.appendChild(strongEl);
       
        pEl.appendChild(document.createTextNode(`: ${post.body}`));
        strongEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);   
    }
    return ulEl;
}

function onAlbumsReceived() {
    postsDivEl.style.display = 'none';
    albumsDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('albums-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}

function onPostsReceived() {
    albumsDivEl.style.display = 'none';
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadAlbums() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL+ '/albums?userId=' + userId);
    xhr.send();
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        const dataUserIdAttrAlbum = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;
        dataUserIdAttrAlbum.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = 'show posts';
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const loadAlbumsButton = document.createElement('button');
        loadAlbumsButton.textContent = 'show albums'; 
        loadAlbumsButton.setAttributeNode(dataUserIdAttrAlbum);
        loadAlbumsButton.addEventListener('click', onLoadAlbums);
     
       
        const nameTdEl = document.createElement('td');
        nameTdEl.textContent = user.name;

        const buttonTdEl = document.createElement('td');

        buttonTdEl.appendChild(buttonEl);
        buttonTdEl.appendChild(loadAlbumsButton);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(buttonTdEl);

        tbodyEl.appendChild(trEl);
    }
    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    albumsDivEl = document.getElementById('albums');
    loadButtonEl = document.getElementById('load-users');
    loadAlbumsButton = document.getElementById('load-albums');
    loadButtonEl.addEventListener('click', onLoadUsers);
});