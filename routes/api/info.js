const express = require('express');
const router = express.Router();

// const keys = require('../../config/keys')
//引入数据库模型
// const User = require('../../modles/Users')
// const jwt = require('jsonwebtoken')
const passport = require('passport');

const Info = require('../../modles/Info');


//测试
// router.get('/test',passport.authenticate('jwt', { session: false }),(req,res)=>{
//     res.json({msg:'info works'})

// })  


// passport.authenticate('jwt', { session: false }), 验证token失败的原因是token 过期了  重新获取一下就可以了


//添加信息接口  添加信息  
// url  /api/infos/add

router.post('/add',passport.authenticate('jwt', { session: false }),(req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Info(profileFields).save().then(profile => {
      res.json(profile);
    });
  })

// @route  GET api/infos
// @desc   获取所有信息 首页
// @access Private
router.get('/',(req,res)=>{
    Info.find()
    .then((infos)=>{
        if(!infos){
           return res.status(404).json({msg:'用户信息不存在'})

        }
        res.status(200).json(infos)

    })
    .catch(err=>res.status(404).json(err))

})

 // @route  GET api/infos/:id
// @desc   获取单条数据
// @access Private
router.get('/:id',(req,res)=>{
    Info.findOne({_id:req.params.id})
    .then((infos)=>{
        if(!infos){
           return res.status(404).json({msg:'用户信息不存在'})
        }
        res.status(200).json(infos)
    })
    .catch(err=>res.status(404).json(err))

})


// @route  POST api/profiles/edit
// @desc   编辑信息接口
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const profileFields = {};
  
      if (req.body.type) profileFields.type = req.body.type;
      if (req.body.describe) profileFields.describe = req.body.describe;
      if (req.body.income) profileFields.income = req.body.income;
      if (req.body.expend) profileFields.expend = req.body.expend;
      if (req.body.cash) profileFields.cash = req.body.cash;
      if (req.body.remark) profileFields.remark = req.body.remark;
  
      Info.findOneAndUpdate(
        { _id: req.params.id },
        { $set: profileFields },
        { new: true }
      ).then(info => res.json(info));
    }
  );

// @route  POST api/profiles/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Info.findOneAndRemove({ _id: req.params.id })
        .then(profile => {
          profile.save().then(info => res.json(info));
        })
        .catch(err => res.status(404).json('删除失败!'));
    }
  );

module.exports = router