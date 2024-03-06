const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path=require("path");
const methodoverride=require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: "qwerty"
  });


  let getrandomuser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
    ];
  };




// let q = "insert into user (id,username,email,password) values ?";


// let data =[];


// for(let i=0;i<=100;i++){
//   data.push(getrandomuser());   // 100 fake users
// }

// try {
//     connection.query(q,[data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         console.log(result.length);
//         console.log(result[0]);
//         console.log(result[1]);
//     })
// }
// catch(err){
//     console.log(err);
// }

// connection.end();


// Home Route
app.get("/", (req, res) => {
  let q = `select count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count=result[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  }
  catch (err) {
    console.log(err);
    res.send("Some error in datbase");
  }
});


// Show route
app.get("/user",(req,res)=>{
  let q=`select * from user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs",{users});
    });
  }
  catch (err) {
    console.log(err);
    res.send("Some error in datbase");
  }
});

// Edit Route
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  }
  catch (err) {
    console.log(err);
    res.send("Some error in datbase");
  }
});


// Update (DB) Route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let { password: formpass, username: newusername } = req.body;
  let q=`select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      if(formpass!=user.password){
        res.send("Wrong Password");
      }
      else{
        let q2=`update user set username='${newusername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })

      }
    });
  }
  catch (err) {
    console.log(err);
    res.send("Some error in datbase");
  }
});

// Add new user route
app.post("/add",(req,res)=>{
  res.render("addnew.ejs");
})

app.post("/add",(req,res)=>{
  let {username,password,email}=req.body;
  let id=uuidv4();
  let q3=`insert into user (username,password,email,id) values ('${username}','${password}','${email}','${id}')`;
  try {
    connection.query(q3, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/user");
    });
  }
  catch (err) {
    console.log(err);
    res.send("Some error in datbase");
  }
});



app.listen("8080",()=>{
  console.log("Server is listening to port 8080");
});
