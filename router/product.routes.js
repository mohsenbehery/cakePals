const express = require('express')
const router = express.Router()

const {body} = require('express-validator')
const isAllow = require('../middleware/isAllowed')
const verifyToken = require("../middleware/verfiyToken");




const productController = require('../controller/product.controller')


router.route("/")
    .get(verifyToken,productController.getAllProduct)
    .post(verifyToken,isAllow('baker'),[
        body('name').notEmpty().withMessage("name is required"),
        body('bakingTime').notEmpty().withMessage("bakingTime is required"),
        body('type').notEmpty().withMessage("type is required")],productController.addNewProduct)

router.route('/:productId')
    .delete(verifyToken,isAllow("baker"),productController.deleteProduct)
    .put(verifyToken,isAllow("baker"),productController.updateProduct)

module.exports = router;