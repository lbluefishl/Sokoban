const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.static(__dirname));
const path = require('path');



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
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
  const { playerId, durationAfterBreak, durationBeforeBreak, durationToBeatGame, durationBreak, levelNumber, condition, completedLevel, beforeBreakMovesets, afterBreakMovesets, difficulty, stuck, scrollCount } = req.body;

  // Access the MongoDB collection based on the level number
  const collectionName = `level${levelNumber}`;
  const db = client.db('Sokoban1'); 
  const collection = db.collection(collectionName);

  // Check if the player id exists in the collection
  const existingDocument = await collection.findOne({ playerId });
  console.log(stuck);
  console.log(difficulty);
  if (existingDocument) {
    // Update the existing document with the new time intervals
    try {
      const result = await collection.updateOne(
        { playerId },
        { $set: { durationAfterBreak, durationBeforeBreak, durationToBeatGame, durationBreak, condition, completedLevel, beforeBreakMovesets, afterBreakMovesets, difficulty, stuck, scrollCount } }
      );
      console.log('Document updated:', result.modifiedCount);
    } catch (err) {
      console.error('Error updating document:', err);
      res.sendStatus(500);
      return;
    }
  } else {
    // Create a new document with the playerId and time intervals and insert it into the collection
    try {
      console.log(stuck);
      console.log(difficulty);
      const result = await collection.insertOne({
        playerId,
        durationAfterBreak,
        durationBeforeBreak,
        durationToBeatGame,
        durationBreak,
        condition,
        completedLevel,
        beforeBreakMovesets,
        afterBreakMovesets,
         difficulty,
         stuck,
         scrollCount
      });
      console.log('Document inserted:', result.insertedId);
    } catch (err) {
      console.error('Error inserting document:', err);
      res.sendStatus(500);
      return;
    }
  }

  res.sendStatus(200);
});




app.post('/submit-survey', async (req, res) => {
  const { enjoyment, relaxation, absorption, puzzleWork, mindWander, playerId, levelNumber } = req.body;

  // Access the MongoDB collection based on the level number
  const collectionName = `level${levelNumber}`;
  const db = client.db('Sokoban1'); // Replace 'Sokoban' with your actual database name
  const collection = db.collection(collectionName);

  // Check if a document with the same playerId already exists in the collection
  try {
    const existingDocument = await collection.findOne({ playerId });

    if (existingDocument) {
      // If a document with the playerId exists, update it with the new survey data
      const result = await collection.updateOne(
        { playerId },
        { $set: { enjoyment, relaxation, absorption, puzzleWork, mindWander } }
      );
      console.log('Survey data updated:', result.modifiedCount);
    } else {
      // If no document with the playerId exists, create a new one with the survey data
      const result = await collection.insertOne({
        enjoyment, 
        relaxation, 
        absorption, 
        puzzleWork,
        mindWander,
        playerId
      });
      console.log('Survey data inserted:', result.insertedId);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Error inserting/updating survey data:', err);
    res.sendStatus(500);
  }
});

app.post('/submit-summary', async (req, res) => {
  const { age, gender, handedness, videoGameHours, smartphoneHours, sokobanFamiliarity, digitalDeviceHours, comments, playerId } = req.body;

  // Access the MongoDB collection based on the level number
  const db = client.db('Sokoban1'); // Replace 'Sokoban' with your actual database name
  const collection = db.collection('surveys');

  // Check if a document with the same playerId already exists in the collection
  try {
    const existingDocument = await collection.findOne({ playerId });

    if (existingDocument) {
      // If a document with the playerId exists, update it with the new survey data
      const result = await collection.updateOne(
        { playerId },
        { $set: { age, gender, handedness, videoGameHours, smartphoneHours, sokobanFamiliarity, digitalDeviceHours, comments, playerId } }
      );
      console.log('Survey data updated:', result.modifiedCount);
    } else {
      // If no document with the playerId exists, create a new one with the survey data
      const result = await collection.insertOne({
        age,
        gender,
        handedness,
        videoGameHours,
        smartphoneHours,
        sokobanFamiliarity,
        digitalDeviceHours,
        comments,
        playerId
      });
      console.log('Survey data inserted:', result.insertedId);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Error inserting/updating survey data:', err);
    res.sendStatus(500);
  }
});






app.post('/complete-level-pilot', async (req, res) => {
  const { playerId, durationToBeatGame, levelNumber, checkStuck, checkSkip } = req.body;

  // Access the MongoDB collection based on the level number
  const collectionName = `level${levelNumber}`;
  const db = client.db('Sokoban-pilot3'); 
  const collection = db.collection(collectionName);

  // Check if the player id exists in the collection
  const existingDocument = await collection.findOne({ playerId });

  if (existingDocument) {
    // Update the existing document with the new time intervals
    try {
      const result = await collection.updateOne(
        { playerId },
        { $set: { durationToBeatGame, checkStuck, checkSkip } },
        
      );
      console.log('Document updated:', result.modifiedCount);
    } catch (err) {
      console.error('Error updating document:', err);
      res.sendStatus(500);
      return;
    }
  } else {
    // Create a new document with the playerId and time intervals and insert it into the collection
    try {
      const result = await collection.insertOne({
        playerId,
        durationToBeatGame,
        checkStuck,
        checkSkip
      });
      console.log('Document inserted:', result.insertedId);
    } catch (err) {
      console.error('Error inserting document:', err);
      res.sendStatus(500);
      return;
    }
  }

  res.sendStatus(200);
});


