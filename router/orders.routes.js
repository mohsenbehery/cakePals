const express = require('express')
const router = express.Router()

const {body} = require('express-validator')
const isAllow = require('../middleware/isAllowed')
const verifyToken = require("../middleware/verfiyToken");


const ordersController = require('../controller/orders.controller')


router.route('/')
    .get(verifyToken,ordersController.getBakersOrders)
    .post(verifyToken,[
        body('productId').notEmpty().withMessage("productId is required"),
        body('paymentMethod').notEmpty().withMessage("paymentMethod is required"),
        body('collectionTime').notEmpty().withMessage("collectionTime is required")
    ],ordersController.addNewOrder)

router.route('/accept/:orderId').post(verifyToken,isAllow("baker"),ordersController.acceptOrder)
router.route('/reject/:orderId').post(verifyToken,isAllow("baker"),ordersController.rejectOrder)
router.route('/fulfill/:orderId').post(verifyToken,isAllow("baker"),ordersController.fulfillOrder)

router.route('/rate/:orderId').post(verifyToken,ordersController.addRating)


module.exports = router;