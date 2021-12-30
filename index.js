const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;



const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fobb8.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
        await client.connect();
        const database = client.db('ease-store');
        const productsCollection = database.collection('products');

        // Get all products 
        app.get('/products',async(req,res)=>{
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });
        
        // Get single product by id
        app.get('/product/:id',async(req,res) =>{
            const id= req.params.id;
            query ={ _id: ObjectId(id)}
            const cursor = await productsCollection.findOne(query);
            res.json(cursor);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/',async(req,res)=>{
    res.send('getting info from index.js of ease store')
})

app.listen(port, ()=>{
    console.log(`listenning at ${port}`)
})