const fs = require("fs"); 

let posts = []
let categories = []

function initialize(){
    posts = JSON.parse(fs.readFileSync('./data/posts.json').toString());
    categories = JSON.parse(fs.readFileSync('./data/posts.json').toString());

    return new Promise((resolve, reject)=> {
        if (posts && categories) {
            resolve({msg: 'Success'})
        } else {
            reject({msg: 'Unable to read file'})
        }
    })
}

function getPosts(){
    return new Promise((resolve, reject)=> {
        if (posts.length != 0) {
            resolve(posts)
        } else {
            reject({msg: 'No Data'})
        }
    })
}

function getPublishedPosts(){
   return new Promise((resolve, reject)=> {
        if (posts.length != 0) {
            resolve(posts.filter(post => post.published == true))
        } else {
            reject({msg: 'No Data'})
        }
    })
}

function getCategories(){
    return new Promise((resolve, reject)=> {
        if (categories.length != 0) {
            resolve(categories)
        } else {
            reject({msg: 'No Data'})
        }
    })
}

function addPost(post){
    return new Promise((resolve, reject)=> {
        if(post!= null){
            if (post.published == undefined) {
                post.published = false
            } 
            post.id = posts.length+1;
            posts.push(post)
            resolve(post)
        } else {
            reject({msg: 'No Data'})
        }
    })
}

function getPostById(id){
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
            postIds = posts.filter(post => post.id == id)
             resolve(postIds)
         } else {
             reject({msg: 'No Data'})
         }
     })
 }

 function getPostsByCategory(category){
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
             let categoryPost = posts.filter(post => post.category == category)
             resolve(categoryPost)
         } else {
             reject({msg: 'No Data'})
         }
     })
 }

 function getPostsByMinDate(minDateStr){
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
            datedPosts = posts.filter(post => post.postDate >= minDateStr)
             resolve(datedPosts)
         } else {
             reject({msg: 'No Data'})
         }
     })
 }

module.exports = { 
    initialize, 
    getPosts, 
    getPublishedPosts, 
    getCategories, 
    addPost, 
    getPostById, 
    getPostsByCategory, 
    getPostsByMinDate 
}