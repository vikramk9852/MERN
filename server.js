const express = require('express');
const path = require("path")
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config()
const app = express();
const port = process.env.PORT || 4000;
const routes = express.Router();
const secret = process.env.SECRET || "some secret passphrase here for local development"
let Todo = require('./todo.model');
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

// export function getById(id) {

//     routes.route(`/:${id}`).get(function (req, res) {
//         let id = req.params.id;
//         Todo.findById(id, function (err, todo) {
//             return res.json(todo);
//         });
//     });
// }

// routes.route('/getTodo').get(function (req, res) {
//     Todo.find(function (err, api) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(api);
//         }
//     });
// });

routes.route('/getAllBlogs').get(function (req, res) {
    Blog.find(function (err, api) {
        if (err) {
            console.log(err);
        } else {
            res.json(api);
        }
    });
});

routes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Blog.findById(id, function (err, todo) {
        res.json(todo);
    });
});

// routes.route('/:id').get(function (req, res) {
//     let id = req.params.id;
//     Todo.findById(id, function (err, todo) {
//         res.json(todo);
//     });
// });

// routes.route('/add').post(function (req, res) {
//     let todo = new Todo(req.body);
//     todo.save()
//         .then(todo => {
//             res.status(200).json({ 'todo': 'todo added successfully' });
//         })
//         .catch(err => {
//             res.status(400).send('adding new todo failed');
//         });
// });

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

routes.route('/updateBlog/:id').post(function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (!blog)
            res.status(404).send("data is not found");
        else {
            blog.blog_title = req.body.blog_title;
            blog.blog_category = req.body.blog_category;
            blog.blog_publish_date = req.body.blog_publish_date;
            blog.blog_data = req.body.blog_data;
            blog.blog_description = req.body.blog_description;

            blog.save().then(blog => {
                res.json('Blog updated!');
            }).catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

routes.route('/deleteBlog/:id').post(function (req, res) {
    var id = req.params.id;
  
    Blog.deleteOne({ _id: new mongoose.Types.ObjectId(id) }, function (err, results) {
        if(!results){
            console.log("unable to delete");
        }
        else{
            console.log("deleted successfully");
        }
    });
  
    res.json({ success: id })
});

// routes.route('/update/:id').post(function (req, res) {
//     Todo.findById(req.params.id, function (err, todo) {
//         if (!todo)
//             res.status(404).send("data is not found");
//         else {
//             todo.todo_description = req.body.todo_description;
//             todo.todo_responsible = req.body.todo_responsible;
//             todo.todo_priority = req.body.todo_priority;
//             todo.todo_completed = req.body.todo_completed;

//             todo.save().then(todo => {
//                 res.json('Todo updated!');
//             }).catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//         }
//     });
// });


app.use('/api', routes);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, function () {
    console.log("Server is running on Port: " + port);
});
