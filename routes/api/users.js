const express = require('express');
const router = express.Router();
const keys = require('../../config/keys')

//密码加密 中间件

const bcrypt = require('bcrypt')
//引入生成token中间件
const jwt = require('jsonwebtoken')
//引入gravatar生成一个图标
const gravatar = require('gravatar')
//引入数据库模型
const User = require('../../modles/Users')
const passport = require('passport');



//这是post 注册接口 

router.post('/register',(req,res)=>{
    // console.log(req.body)
    //注册的时候查询数据库 是否注册了这个邮箱用户名  
    User.findOne({email:req.body.email})
        .then((user)=>{
            //如果已经有该邮箱  就直接返回一个提示 否则直接将注册信息保存在mongoddb中
            if(user){
                return res.status(400).json({email:'邮箱已经被注册'})

            }else{
                //生成一个随机头像
                const  avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password,
                    identity:req.body.identity
                })
                //对密码进行加密 
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if(err) throw err;
                        newUser.password = hash
                        newUser.save()
                            .then((user)=> res.json(user))
                            .catch(err=> console.log(err))
                        
                    });
                });
            }

        })


    

})
//这是登录接口 post请求 登录生成token

router.post('/login',(req,res)=>{

    //先拿到用户的登录信息  然后在数据库里面查找对应的登录信息  
    //如果没有则登录失败  有就验证登录信息并且给前端返回一个登录的token  这里验证信息 需要验证一加密之后密码  所以这里用到了 jsonwebtoken
    const email = req.body.email
    const password = req.body.password
    User.findOne({email})
        .then((user)=>{
            if(!user){
                return res.status(404).json('用户不存在')
                
            }
            //用户存在的情况验证用户登录信息
            bcrypt.compare(password, user.password)
                    .then((isMatch)=>{
                        if(isMatch){
                            const rule ={
                                id:user.id,
                                name:user.name,
                                avatar:user.avatar,
                                identity:user.identity
                            }
                            //使用jsonwebtoken生成一个token
                            jwt.sign(rule,keys.secretOrKey,{ expiresIn: 3600 },(err,token)=>{
                                if(err) throw err
                                res.json({
                                    success:true,
                                    token: 'Bearer '+token
                                })
                            })
                        }else{
                            return res.status(404).json('密码错误')
                        }
                    })
        })
})

//获取/current 信息需要进行token验证
router.get('/current',passport.authenticate('jwt', { session: false }),(req,res)=>{
    //这里获取用户信息需要做两件事
    //（1）验证用户登录之后的token是否正确  这里需要用到一个验证token的中间件  passportnpm install passport-jwt
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
})
module.exports = router