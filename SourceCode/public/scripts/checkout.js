// var express = require('express');
// var request = require('request');
// // Add your credentials:
// // Add your client ID and secret
// var CLIENT =
//     'AUJoKVGO3q1WA1tGgAKRdY6qx0qQNIQ6vl6D3k7y64T4qh5WozIQ7V3dl3iusw5BwXYg_T5FzLCRguP8';
// var SECRET =
//     'EOw8LNwDhM7esrQ3nHfzKc7xiWnJc83Eawln4YLfUgivfx1LGzu9Mj0F5wlarilXDqdK9Q5aHVo-VGjJ';
// var PAYPAL_API = 'https://api-m.sandbox.paypal.com';

// express().post('/my-api/create-payment/', function(req, res) {
//     request.post(PAYPAL_API + '/v1/payments/payment', {
//         auth: {
//             user: CLIENT,
//             pass: SECRET
//         },
//         body: {
//             intent: 'sale',
//             payer: {
//                 payment_method: 'paypal'
//             },
//             transactions: [{
//                 amount: {
//                     total: '5.99',
//                     currency: 'USD'
//                 }
//             }],
//             redirect_urls: {
//                 return_url: 'https://example.com',
//                 cancel_url: 'https://example.com'
//             }
//         },
//         json: true
//     }, function(err, response) {
//         if (err) {
//             console.error(err);
//             return res.sendStatus(500);
//         }
//         // 3. Return the payment ID to the client
//         res.json({
//             id: response.body.id
//         });
//     });
// }).post('/my-api/execute-payment/', function(req, res) {
//     // 2. Get the payment ID and the payer ID from the request body.
//     var paymentID = req.body.paymentID;
//     var payerID = req.body.payerID;
//     // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
//     request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
//         '/execute', {
//             auth: {
//                 user: CLIENT,
//                 pass: SECRET
//             },
//             body: {
//                 payer_id: payerID,
//                 transactions: [{
//                     amount: {
//                         total: '10.99',
//                         currency: 'USD'
//                     }
//                 }]
//             },
//             json: true
//         },
//         function(err, response) {
//             if (err) {
//                 console.error(err);
//                 return res.sendStatus(500);
//             }
//             // 4. Return a success response to the client
//             res.json({
//                 status: 'success'
//             });
//         });
// }).listen(3000, function() {
//     console.log('Server listening at http://localhost:3000/');
// });



const paymentForm = document.querySelector('#payment-form');

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    window.alert("You have submited your payment");
    window.location.href = "index.html";

});