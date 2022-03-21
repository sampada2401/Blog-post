const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");
 
const app = express();
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
 
 
app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
});
 
mailchimp.setConfig({
    apiKey: 'c75cd93da1384880344455a3fd6c4419-us14',
    server: 'us14'
});
 
 
app.post("/", function(req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const listId = '3d953001ab';
 
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
 
 
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, {
          members: [{
              email_address:subscribingUser.email,
              status: "subscribed",
              merge_fields: {
                  FNAME: subscribingUser.firstName,
                  LNAME: subscribingUser.lastName
              }
          }],
        }).then(responses => {
            console.log(responses);
            if(responses.id !== "") {
                res.sendFile(__dirname+"/success.html");
            }
 
          }).catch(err => {
                res.sendFile(__dirname+"/failure.html");
                console.log(err)
          });
 
      };
//
      run();
 
});
 
app.post("/failure", function(req, res) {
    res.redirect("/");
});
 
app.listen(process.env.PORT||3000, function() {
    console.log("Server is running at port 3000");
});
 








// 3d953001ab
// apiKey: "a75cd93da1384880344455a3fd6c4419-us14",
//   server: "us14",