var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/Database');
var db = mongoose.connection;

db.on('error', ()  => console.log('---FAILED to connect to Database'));
db.once('open', () => console.log('+++Connected to Database'));


app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var age = req.body.age;
    var email =req.body.email;
    var phone = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;
    var data = {
        "name":name,
        "age":age,
        "email":email,
        "phone":phone,
        "gender":gender,
        "password":password,
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    return res.redirect('signup_successful.html');
});

app.get('/', (req, res) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    })
    return res.redirect('index.html');
}).listen(3000);

console.log('Server running at http://localhost:3000/');