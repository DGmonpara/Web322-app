/********************************************************************************* * 
 * WEB322 – Assignment 03 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. 
 * Name: Darshan Gunvantbhai Monpara 
 * Student ID: 158984195
 * Date: 16th June, 2022 
 * Online (Heroku) Link: https://dgmon-web322app.herokuapp.com/
 * * ********************************************************************************/

const express = require('express')
const app = express()
const path = require('path');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const { 
    initialize, 
    getCategories, 
    addPost, 
    getPosts, 
    getPostById, 
    getPostsByCategory,
    getPostsByMinDate, 
    getPublishedPosts, 
} = require('./blog-service')

// cloudinary configurations
cloudinary.config({ 
    cloud_name: 'dgmon', 
    api_key: '374636562118241', 
    api_secret: 'l_pTTf00Ud6JRP3QEu6NLHzjfjw',
    secure: true 
  });

const upload = multer();
app.use(express.static('public'));

// routes

app.get('/',(req,res) => {
    res.redirect('/about')
})

app.get('/about',function(req,res) {
    res.sendFile(path.join(__dirname+'/views/about.html'));
});

app.get('/blog', async (req,res)=> {
    getPublishedPosts()
    .then((posts) => res.json(posts))
    .catch((err)=> console.log(err))
})

app.get('/posts', async (req,res)=> {
    if(req.query.category != null){
        getPostsByCategory(req.query.category)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    }

    if(req.query.minDate != null){
        getPostsByMinDate(req.query.minDate)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    }

    getPosts()
    .then((posts) => res.json(posts))
    .catch((err)=> console.log(err))
})

app.get('/categories', async (req,res)=> {
    getCategories()
    .then((categories) => res.json(categories))
    .catch((err)=> console.log(err))
})

// Add post route

app.get('/posts/add',function(req,res) {
    res.sendFile(path.join(__dirname+'/views/addPost.html'));
});

app.post('/posts/add',upload.single("featureImage"),function(req,res) {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded)=> {
        req.body.featureImage = uploaded.url;
        const { title, body, category, published, featureImage  } = req.body;
        post = {
            title, 
            body, 
            category, 
            published, 
            featureImage
        }
        addPost(post)
        .then((data) => res.json(data))
        .catch((err)=> console.log(err))
    });
});



app.get('/posts/:value', async (req,res)=> {
    if(req.params.value != null){
        getPostById(req.params.value)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    } else {
        console.log('Value not found')
    }
    
})


app.use((req, res) => {
    res.status(404).send("404")
})

const port = process.env.PORT || 8080

initialize().then(({msg}) => {
    app.listen(port, () => console.log(`${msg}!, Server is Running on port ${port}`))
}).catch((err)=> {
    console.log(err);
})

