const express = require('express')
const router = express.Router()

const {body} = require('express-validator')


const userController = require('../controller/users.controller')



router.route('/signup')
    .post([
        body('name').notEmpty().withMessage('UserName Is required').isLength({min: 3,max:20}).withMessage("Username Length should be between 3-20 Letters"),
        body('email').notEmpty().withMessage("email is required").isEmail().withMessage("invalid email address"),
        body('password').notEmpty().withMessage("password is required").isLength({min: 8}).withMessage("password at least 8 digits"),
        body('role').notEmpty().withMessage('role us required').isIn(['customer','baker'])
    ],
    userController.addNewUser)

router.route('/login')
    .post([
        body('email').isEmail().withMessage("invalid email address"),
        body('password').notEmpty().withMessage("password is required")
    ],
    userController.login)




module.exports = router;