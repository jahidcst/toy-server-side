const express = require('express')
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 7000;

// middleware 
app.use(cors())
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncm3v5o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const toyCollection = client.db('toyDB').collection('toys')

        // app.get('/hello', (req, res) =>{
        //     res.send('all is well')
        // })

        // post to toyDb
        app.post('/allToys', async(req, res) =>{
            const newToy = req.body
            const result = await toyCollection.insertOne(newToy)
            res.send(result)
            
        });

        // get from toyDB
        app.get('/allToys', async(req, res) =>{
            const myToys = await toyCollection.find().toArray()
            res.send(myToys)
        })

        // get single Data
        app.get('/allToys/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query)
            res.send(result)
        })
        // delete from toyDB
        app.delete('/allToys/:id', async(req, res) =>{
          try{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.deleteOne(query)
            res.send(result)
          }
          catch(err){
            res.send(err.massge)
          }
        });

        // patch to toyDB
        app.patch('/allToys/:id', async(req, res) =>{
            const id = res.params.id
            const updatedToyData = req.body
            const filter = {_id : new ObjectId(id)}
            const updateDoc = {
                $set: {
                    ...updatedToyData
                }
            }
            const result = await toyCollection.updateOne(filter, updateDoc)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('toy is running')
})

app.listen(port, () => {
    console.log(`Toy server is running on port ${port}`)
})