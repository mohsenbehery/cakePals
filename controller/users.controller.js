const User = require('../model/user.model')
const Baker = require('../model/baker.model')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { validationResult } = require("express-validator")



const addNewUser = async (req,res,next)=>{
    
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status((400).json({status: "fail",data :errors.array()}))
    }

    const {name,email,password,role,location,} = req.body;

    if (!role){
        return res.status(400).json({ error: 'role is Required' });
    }else if (role !== 'customer' && role !== 'baker'){
        return res.status(400).json({ error: 'Invalid role' });
      }

    try {
        const existingUser = await User.findOne({email: email});

        if (existingUser) {
            return res.status(400).json({error: "Email address already in Use"})
        }

        let newUser ;

        const hashedPassword = await bcrypt.hash(password,10);

        if (role === 'customer') {
            newUser = new User({
              name,
              email,
              password: hashedPassword,
            });
          } else if (role === 'baker') {
            newUser = new Baker({
              name,
              email,
              password: hashedPassword,
              location,
            });
          }
        const token = JWT.sign({ id: newUser._id,name: newUser.name, email: newUser.email, role: role }, process.env.SECRET_KEY);

        newUser.token = token;

        await newUser.save()
        
        res.status(201).json({status: "Success", msg: "User Registered Succesfully"})
    } catch (err) {
        res.status(500).json({status: "ERROR", msg: err})
    }
    
}

const login = async (req,res)=>{

    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status((400).json({status: "fail",data :errors.array()}))
    }
    const {email , password} = req.body;

   try {
    const user = await User.findOne({email: email})
    if (user) {
      const comparedPassword =   bcrypt.compare(password, user.password)
      if (comparedPassword){
        const token = JWT.sign({ id: user._id,name: user.name, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: "30m" })
        res.status(200).json({status: "success", data: {token}})
      } else{
        res.json({status: "faild", msg: "Wrong Password"})
      }
    } else{
        res.json({status: "faild", msg: "Invalid Email"})
    }
   } catch (err){
        res.status(500).json({status: "ERROR",msg: "Login Failed"})
   }
}





module.exports = {
    addNewUser,
    login
}