const Express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = Express();

//引入路由用户
const users = require('./routes/api/users');
//引入信息路由
const infos = require('./routes/api/info');

//引入数据库地址
const dbUrl = require('./config/keys').dbUrl

//连接数据库 
mongoose
    .connect(dbUrl)
    .then(()=>{ 
        console.log('mongoose is connected!')
    })
    .catch((err)=>{
        console.log(err)
    })

//使用中间件body-parser 
app.use(bodyParser.urlencoded({extened:false}))
app.use(bodyParser.json());
//使用路由
app.use('/api/users', users);

app.use('/api/infos', infos);


const port = 3000;



app.listen(port,()=>{
    console.log('server is running!')
})