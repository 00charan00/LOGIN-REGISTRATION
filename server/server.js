const express = require("express");
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
// const salt = 10;


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1030",
  database: "harrypotterdb"
});

app.post('/register',(req,res)=>{
    const q="INSERT INTO registertable(name,email,password) VALUE(?)";
    const salt=bcrypt.genSaltSync(10);
    const hash=bcrypt.hashSync(req.body.password,salt);

    const values=[
        req.body.name,
        req.body.email,
        hash
    ]

    db.query(q,[values],(err,data)=>{
        if(err)
        {
            console.log(err);
            return;
        }
        return res.status(200).json("User created");
    })

    

})

app.post('/login',(req,res)=>{
    const sql="SELECT * FROM registertable WHERE `email` = ?";
    db.query(sql,[req.body.email],(err,data)=>{
        if(err){
            return res.json("ERROR");
        }
        if(data.length > 0){
            const checkpassword=bcrypt.compareSync(req.body.password,data[0].password)

            if(!checkpassword)
            {
                return res.status(403).json("Wrong credentials");
            }
            return res.status(200).json("user logged in ")
            
        }
        else{
            return res.json("Failure");
        }
    })
})



app.get('/',(req,res)=>{
    //function to check if backend is running in browser
    res.json("Hii charan");
})
app.listen(8080, () => {
  console.log("listening in 8080");
});

