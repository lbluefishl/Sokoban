const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.static('public')); // Serve static files from the 'public' directory
const path = require('path');

// ...

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const { MongoClient } = require('mongodb');
const uri =
  'mongodb+srv://lbluefishl:txfIlHN82yiAG9bs@cluster0.sznmr3p.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the connectToMongoDB function to establish the connection
connectToMongoDB().then(() => {
  // Start the server after the MongoDB connection is established
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

app.post('/complete-level', async (req, res) => {
  const playerId = req.body.playerId;
  console.log('User ID:', playerId);

  // Access the MongoDB collection
  const db = client.db('Sokoban'); // Replace 'Sokoban' with your actual database name
  const collection = db.collection('level1'); // Replace 'playerData' with your collection name

  // Create a new document with the playerId and insert it into the collection
  try {
    const result = await collection.insertOne({ playerId });
    console.log('Document inserted:', result.insertedId);
  } catch (err) {
    console.error('Error inserting document:', err);
  }

  res.sendStatus(200);
});
