//express
const express = require('express')
const app = express()
const port = 3000

//BODY PARSER
//commented out: (i replaced this with app.use(express.json()))
// var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();


//promisify (redis adapter)
const { promisify } = require("util");


//redis
const redis = require('redis');
const client = redis.createClient(); //creates a new client

client.on("error", function(error) {
  console.error(error);
});

//why did we do this?
const getAsync = promisify(client.get).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const delAsync = promisify(client.del).bind(client);

// let listOfKeys = [];


// client.set("dinner", "burger");
// client.get("dinner", function(err, reply) {
//   console.log(reply);
// });
// client.get("breakfast", function(err, reply) {
//   console.log(reply);
// });
// client.keys('*', function(err, reply) {
//   console.log(reply);
// })


  // console.log('before generate lists');
  // await generateLists();
  // console.log('done generate lists');
  // console.log(listOfValues);

  //PROBLEM: This is not being "waited for". this processes before listOfKeys is generated.

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


 
console.log('hi there');


app.use(express.static('public'));
app.use(express.json());
//serves index.html
app.get('/', (req, res) => {
    res.sendFile('index.html');
})


app.get('/list', async (req, res) => {
  // keysAsync('*').then(response => {
  //   console.log(response);
  // })

  const keysResponse = await keysAsync('listitem*');
  console.log(keysResponse);
  let listOfValues = [];
  for(i=0;i<keysResponse.length;i++)  {
    let valueResponse = await getAsync(keysResponse[i]);
    listOfValues.push(valueResponse);
  }
  let object = {};
  object.keys = keysResponse;
  object.values = listOfValues;
  res.send(object);
});


//post request handler
app.post('/list', function (req, res) {
  console.log(req.body);
  client.set(req.body.newItem[0], req.body.newItem[1])
 
  // res.send(`${req.body.values[0]} saved to database`);
  res.json({
    'status': 'success'
  }); //maybe this needs to be json
})


//delete request handler
app.delete('/list', function (req, res) {
  console.log(req.body);
  console.log(req.body.toDelete.length);
  for (i=0;i<req.body.toDelete.length;i++) {
    delAsync(req.body.toDelete[i]);
  }

  //does this send body need to be in json? 
  //When i used postman it showed the message which was merely a string...
  res.send(
    {'message': 'delete request handled, database updated'}
    )
  // res.end();
})


//COMMENTED OUT, THIS WAS MY ORIGINAL CODE BUT DID NOT WORK DUE TO ASYNC
//serves listitems from database
//THIS WORKS? IS THIS DOING AN AWAIT SOMEHOW?
// app.get('/api/list', async (req, res) => {
//     // res.send(listOfKeys);
    
//     console.log('before generate lists');
//     // await retrieveKeys();

//     console.log('beginning retrieveKeys');

//     keysAsync('*', function(err,reply) { //needs awaited
//       console.log('client.keys callback. THIS FIRST');
//       for (i=0;i<reply.length;i++) {
//         listOfKeys.push(reply[i]);
//       }
//       console.log('THIS SECOND')
      
//       // getValues(listOfKeys);

//       console.log('beginning getValues');
//       for(i=0;i<listOfKeys.length;i++) {
//         client.get(listOfKeys[i], function(err, reply) {
//         listOfValues.push(reply);
//         console.log('getValues listOfValues', listOfValues);
//       });
//     }  

//       console.log('done generate lists');
//       console.log('THIS THIRD');
//       res.send(listOfValues);

//     });
//   });


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })


//functions

// async function generateLists() {
//   await retrieveKeys();
//   console.log("list of values: " + listOfValues); //demonstrates asynchronousity
//   // console.log(listOfValues);
// }

// async function retrieveKeys() {
//   console.log('beginning retrieveKeys');
//   client.keys('*', function(err,reply) { //needs awaited
//     console.log('client.keys callback. THIS FIRST');
//     for (i=0;i<reply.length;i++) {
//       listOfKeys.push(reply[i]);
//     }
//     console.log('THIS SECOND')
    
//     // getValues(listOfKeys);

//     console.log('beginning getValues');
//     for(i=0;i<listOfKeys.length;i++) {
//       client.get(listOfKeys[i], function(err, reply) {
//       listOfValues.push(reply);
//       console.log('getValues listOfValues', listOfValues);
//     });
//   }  
//   });
// }

// function getValues(key) {
//   console.log('beginning getValues');
//   for(i=0;i<key.length;i++) {
//       client.get(key[i], function(err, reply) {
//       listOfValues.push(reply);
//       console.log('getValues listOfValues', listOfValues);
//     });
//   }  
// }

