const express = require("express");
const cors =  require('cors');
const router = express.Router();
const Chapa = require('chapa')

let myChapa = new Chapa('CHASECK_TEST-MxHx9fSnnfX0WvvcE6VuknG9YHsF882D')

router.use(cors())
router.post("/", async (req, res, next) => {
    const requestData = req.body;
    let amount = requestData.amount??"100"
const customerInfo =  {
    amount: amount,
    currency: 'ETB',
    email: 'abebe@bikila.com',
    first_name: 'Abebe',
    last_name: 'Bikila',
    callback_url: 'https://chapa.co', // your callback URL
    customization: {
        title: 'I love e-commerce',
        description: 'It is time to pay'
    }
}


myChapa.initialize(customerInfo, { autoRef: true }).then(response => {
 
    return res.status(200).json({
       response:response
      });

}).catch(e => console.log(e)) // catch errors

  
});

module.exports = router;



// async/await
// let response = await myChapa.initialize(customerInfo, { autoRef: true })

// myChapa.verify('txn-reference').then(response => {
//     console.log(response) // if success
// }).catch(e => console.log(e)) // catch errors

// // async/await
// let response = await myChapa.verify('txn-reference')