require("dotenv").config();

const app = require('express')();
var http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');

// app.use('/',function(req,res) {
//     res.json({Hello: "I am alive. Masud!!"})
// });
app.use('/',paymentRoute);

http.listen(3000, function(){
    console.log('Server is running');
});