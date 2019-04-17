const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let albumsDivE1;
let loadButtonEl;
let loadAlbumsButton;

function createComment(comments) {
    let commentString = document.createElement('ul');
    for (i=0; i < comments.length; i++) {
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

        commentString.appendChild(oneComment);

    }
    return commentString;
}

function onCommentReceived() {
    
    const text = this.responseText;
    const comments = JSON.parse(text);

    //error handling... not done
    if (comments.length != 0) {
        var postId = comments[1].postId;
    } else {
        return;
    }
    //---
 
    const post = document.getElementById('postNumber'+postId);
    const postList = post.parentElement.parentElement.childNodes;

    for (i=0; i<postList.length; i++) {
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
    xhr.addEventListener('load', onCommentReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
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

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
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
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

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

function createAlbumsTable(albums) {
    return document.createElement('p');

}

function onUsersReceived() {
    loadButtonEl.remove();
    albumsDivE1.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onAlbumsReceived() {
    loadAlbumsButton.remove();
    postsDivEl.remove();

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divE1 = document.getElementById('albums-content');
    divE1.appendChild(createAlbumsTable(albums));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

function onLoadAlbums() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL+ '/albums');
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    albumsDivE1 = document.getElementById('albums');
    loadButtonEl = document.getElementById('load-users');
    loadAlbumsButton = document.getElementById('load-albums');
    loadButtonEl.addEventListener('click', onLoadUsers);
    loadAlbumsButton.addEventListener('click', onLoadAlbums);
});