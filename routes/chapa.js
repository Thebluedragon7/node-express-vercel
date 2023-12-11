const express = require("express");
const cors =  require('cors');
const router = express.Router();
const Chapa = require('chapa')

let myChapa = new Chapa('CHASECK_TEST-MxHx9fSnnfX0WvvcE6VuknG9YHsF882D')

router.use(cors())
router.post("/", async (req, res, next) => {
    const { first_name,amount,email="",phone_number,title="",return_url,description=""} = req.body
    const TEXT_REF = "tx-emwa12345" + Date.now()
   console.log(req.body)


    // form data
    const customerInfo = {
        amount: amount, 
        currency: 'ETB',
        email: email,
        first_name: first_name,
        last_name: first_name,
        tx_ref: TEXT_REF,
        callback_url: 'https://chapa.co', 
        return_url: return_url + TEXT_REF,
        phone_number:phone_number,
        customization: {
            title: title,
            description: description
        } 
    }



myChapa.initialize(customerInfo, { autoRef: true }).then(response => {
 
    return res.status(200).json({
       response:response
      });

}).catch(e => res.send(e))  
});

router.get("/verify-payment/:id",async(req,res,next)=>{
    console.log(req.params.id)
    myChapa.verify(req.params.id).then(response => {
        return res.status(200).json({
            response:response
           });
    }).catch(e => res.send(e))    
})

module.exports = router;



// async/await
// let response = await myChapa.initialize(customerInfo, { autoRef: true })

// myChapa.verify('txn-reference').then(response => {
//     console.log(response) // if success
// }).catch(e => console.log(e)) // catch errors

// // async/await
// let response = await myChapa.verify('txn-reference')