const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyeto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');
    const database = client.db('doctors_portal');
    const appointmentsCollection = database.collection('appointments');



    app.get('/appointments', async (req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      console.log(email);
      const query = { "initialInfo.email": email, date: date }

      console.log(query);

      const cursor = appointmentsCollection.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments);
    })


    app.post('/appointments', async (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      const result = await appointmentsCollection.insertOne(appointment);
      console.log(result)
      // res.json({ message: 'hello' })
      res.json(result)
    });
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Doctors Portal World!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})



// app.get('/users')
// app.post('/users')
// app.get('/users/:id')
// app.put('/users/:id');
// app.delete('/users/:id')
// users: get
// users: post