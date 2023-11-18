const express = require('express')
const app = express()
require('dotenv').config();

app.use(express.json())

const mongoose = require('mongoose')

const userRoute = require('./router/users.routes')
const productRoute = require('./router/product.routes')
const bakersRoute = require('./router/bakers.routes')
const oredersRoute = require('./router/orders.routes');


mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("connected to DB Server Successfuly")
})




app.get("/",(req,res)=>{res.json({status: "success", msg: "Welcome to The Home Page"})})

app.use('/api/users',userRoute)
app.use('/api/products',productRoute)
app.use('/api/bakers',bakersRoute)
app.use('/api/orders',oredersRoute)




app.listen(process.env.PORT,()=>{
    console.log(`app is Running on port ${process.env.PORT}`)
})

