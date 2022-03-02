const express = require('express')
const bodyParser = require('body-parser')
const cors=require('cors')

const app = express()
require("dotenv").config();
const SSLCommerzPayment = require('sslcommerz-lts')

app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())
app.use(cors())

const store_id = process.env.SSL_STORE_ID
const store_passwd = process.env.SSL_PASSWORD
const is_live = false //true for live, false for sandbox
console.log(store_id)
console.log(store_passwd)

const port = 8000

app.use("/ssl-request",async(req,res,next)=>{
    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: 'http://localhost:8000/success',
        fail_url: 'http://localhost:8000/failure',
        cancel_url: 'http://localhost:8000/cancel',
        ipn_url: 'http://localhost:8000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
})

app.post("/ssl-payment-success", async (req,res,next)=>{
    return res.status(200).json({
        data:req.body
    })
})
app.post("/ssl-payment-failure", async (req,res,next)=>{
    return res.status(400).json({
        data:req.body
    })
})
app.post("/ssl-payment-cancel", async (req,res,next)=>{
    return res.status(200).json({
        data:req.body
    })
})
app.post("/ssl-payment-ipn", async (req,res,next)=>{
    return res.status(200).json({
        data:req.body
    })
})

app.listen(port, () => {
    console.log(`My app listening at http://localhost:${port}`)
})