const express = require('express');
const path = require("path")
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 4000;
const routes = express.Router();
const secret = process.env.SECRET || "some secret passphrase here for local development"
let User = require('./model/user');
let Blog = require('./model/blog');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")));

let url = 'mongodb://admin:vAbZXmJ39qkDaViy@SG-mernMongo-25278.servers.mongodirector.com:27017/admin';

mongoose.connect(process.env.PROD_MONGODB || url, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

routes.route('/getAllBlogs').get(function (req, res) {
    Blog.find(function (err, api) {
        if (err) {
            console.log(err);
        } else {
            res.json(api);
        }
    });
});

routes.route('/getAllUsers').get(function (req, res) {
    User.find(function (err, api) {
        if (err) {
            console.log(err);
        } else {
            res.json(api);
        }
    });
});

routes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Blog.findById(id, function (err, blog) {
        res.json(blog);
    });
});

routes.route('/users/:id').get(function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        res.json(user);
    });
});

routes.route('/createBlog').post(function (req, res) {
    let blog = new Blog(req.body);
    blog.save()
        .then(blog => {
            res.status(200).json({ 'blog': 'blog added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new blog failed');
        });
});

routes.route('/addUser').post(function (req, res) {

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        else {

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

routes.route('/updateBlog/:id').post(function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (!blog)
            res.status(404).send("data is not found");
        else {
            User.findById(blog.blog_writer, function (err, user) {
                if (user.logged_in) {
                    blog.blog_title = req.body.blog_title;
                    blog.blog_category = req.body.blog_category;
                    blog.blog_data = req.body.blog_data;
                    blog.blog_description = req.body.blog_description;
                    blog.blog_state = req.body.blog_state;
                    blog.save().then(blog => {
                        res.json('Blog updated!');
                    }).catch(err => {
                        res.status(400).send("Update not possible");
                    });
                }
                else {
                    res.status(401).send("Unauthorized access");
                }
            })
        }
    });
});

routes.route('/updateUser/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user)
            res.status(404).send("user is not found");
        else {
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

routes.route('/login').get(function(req, res){

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };// Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            }
            else {
                return res.status(400).json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
})

routes.route('/deleteBlog/:id').post(function (req, res) {
    var id = req.params.id;
    Blog.findById(id, function(err, blog){
        User.findById(blog.blog_writer, function(err, user){
            if(user.logged_in){
                Blog.deleteOne({ _id: new mongoose.Types.ObjectId(id) }, function (err, results) {
                    if (!results) {
                        console.log("unable to delete");
                    }
                    else {
                        res.json({ success: id })
                        console.log("deleted successfully");
                    }
                });
            }
            else{
                res.status(401).send("Unauthorized access");
            }
        })
    })

});

app.use('/api', routes);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, function () {
    console.log("Server is running on Port: " + port);
});
