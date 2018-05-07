var express = require('express');
var paypal = require('paypal-rest-sdk');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

var app = express();

//config express
dotenv.load({ path: '.env' });
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//config mongoose
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

//config paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id':process.env.PAYPAL_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

//config mongoose schema, add orderSchema to orderModel
var orderSchema = new mongoose.Schema({
    name: String,
    price: Number,
    currency: String,
    phone: String,
    paymentid: String,
    lastupdatetime: Date,
    status: String
})

var orderModel = mongoose.model('order', orderSchema);


//index route
app.get('/', function (req, res) {
    res.render('app');
});


//when submit order
app.post('/submitOrder', function (req, res) {

    //careate paypal requert
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.PAYPAL_RETURN_URL,
            "cancel_url": process.env.PAYPAL_CANCEL_URL
        },
        "transactions": [{
            "amount": {
                "currency": req.body.currency,
                "total": req.body.price
            },    
            "item_list":
            {
              "items": [
              {
                "quantity": "1",
                "name": "payment mock test item",
                "price": req.body.price,
                "currency": req.body.currency,
                "description": "payment mock test item",
              }]
            },
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            return console.log(error)
        } 

        for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {

                //when paypal return paymentid and get approvalurl, write order to mongo
                var newOrder = new orderModel({
                    name: req.body.name,
                    price: req.body.price,
                    currency: req.body.currency,
                    phone: req.body.phone,
                    paymentid: payment.id,
                    status: 'open',
                    lastupdatetime: new Date()
                })
                newOrder.save(function (error, data) {
                    if (error) {
                        return console.log(error)
                    }
                })

                //redirect to paypal
                res.redirect(payment.links[i].href);
            }
        }
    
    });
});

//when payment success
app.get('/success', function (req, res) {

    var paymentId = req.query.paymentId;

    var payerId = {
        'payer_id': req.query.PayerID
    };

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            return console.log(error);
        } 
        if (payment.state === 'approved') {
            orderModel.findOne({
                paymentid: req.query.paymentId
            }, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                data.status = 'approved';
                data.save();

                //pass data to ejs to show payment code popup
                var popup = {};
                popup.type = 'order_code';
                popup.paymentId = req.query.paymentId;
                res.render('app', {
                    popup: popup
                });
            });
        } else {
            res.send('payment not successful');
        }
    });
});

//when submit check order
app.post('/submitCheck', function (req, res) {
    orderModel.find({
        paymentid: req.body.check_code,
        name: req.body.check_name,
        status: 'approved'
    }, function (error, data) {
        if (error) {
            return console.log(error);
        }
        var popup = {};
        if (data.length != 0) {
            //pass data to ejs to show order detail popup
            popup = data[0];
            popup.type = 'order_valid';
            res.render('app', {
                popup: popup
            });
        } else {
            //pass data to ejs to show record not found popup
            popup.type = 'order_invalid';
            res.render('app', {
                popup: popup
            });
        }
    });

});


app.listen(process.env.PORT || 3000, function () {
    console.log('app is listening at port 3000');
});