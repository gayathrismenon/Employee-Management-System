const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use("/assets",express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sweetie5",
    database: "db"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});
app.set('views', './views');
app.set('view engine','ejs');
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
    global.username = req.body.username;
    global.password = req.body.password;
    connection.query("select * from admin_details where admin_mail = ? and admin_password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
                    res.render('welcome',{items:results[0]})
                    
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

app.get('/welcome', (req, res) => {
    connection.query("select * from admin_details where admin_mail = ? and admin_password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
                    res.render('welcome',{items:results[0]})
                    
        } else {
            res.redirect("/");
        }
        res.end();
    })
   });


app.get('/emp', (req, res) => {
    connection.query("select * from emp_details",function(error,results,fields){
        if(error) throw error
        else {
            res.render('emp',{employees:results})
        }
    })
   });

app.get('/delete', (req, res) => {
    
            res.render('delete')
   });

app.post("/d",encoder, function(req,res){
    var userid = req.body.userid;

    connection.query("delete from emp_details where emp_id = ?",[userid],function(error,results,fields){
        res.render('result',{mssg:'Employee record deleted succesfully!'})
        res.end();
    })
})

app.get('/insert', (req, res) => {
    
    res.render('insert')
});

app.post("/i",encoder, function(req,res){
var emp_name = req.body.emp_name;
var emp_dob = req.body.emp_dob;
var emp_gender = req.body.emp_gender;
var emp_pos = req.body.emp_pos;
var emp_sal = req.body.emp_sal;
var emp_mob = req.body.emp_mob;
var emp_mail = req.body.emp_mail;
var Ssno = req.body.Ssno;
var emp_Bno = req.body.emp_Bno;

connection.query("insert into emp_details(emp_name,emp_dob,emp_gender,emp_pos,emp_sal,emp_mob,emp_mail,Ssno,emp_Bno) values (?,?,?,?,?,?,?,?,?)",[emp_name,emp_dob,emp_gender,emp_pos,emp_sal,emp_mob,emp_mail,Ssno,emp_Bno],function(error,results,fields){
res.render('result',{mssg:'Employee added succesfully!'})
res.end();

})
})

app.get('/salary', (req, res) => {
    
    res.render('salary')
});

app.get('/result', (req, res) => {
    
    res.render('result')
});

app.post("/s",encoder, function(req,res){
    var userid = req.body.userid;
    var bonus = req.body.bonus;
    connection.query("update emp_details set emp_sal=emp_sal+? where emp_id = ?",[bonus,userid],function(error,results,fields){
        res.render('result',{mssg:'Salary updated succesfully!'})
        res.end();
    })
})

app.get('/leave', (req, res) => {
    connection.query("select * from leaves",function(error,results,fields){
        if(error) throw error
        else {
            res.render('leave',{leaves:results})
        }
    })
   });

app.post("/l",encoder, function(req,res){
    var userid = req.body.userid;
    var inputValue = req.body.vote;
    if (inputValue == "ACCEPT") {
        connection.query("update leaves set status='Approved' where leaveid=?",[userid],function(error,results,fields){
            if(error) throw error
            res.render('result',{mssg:'Status updated succesfully!'})
            res.end();
        })
    } else if (inputValue == "REJECT") {
        connection.query("update leaves set status='Rejected' where leaveid=?",[userid],function(error,results,fields){
            if(error) throw error
            res.render('result',{mssg:'Status updated succesfully!'})
            res.end();

        })
    } 
})

// set app port 
app.listen(2000);