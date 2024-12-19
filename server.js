import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from env. file

// Check if MongoDB string is provided in env. file
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL is not defined in the .env file.");
  process.exit(1); // Stop the app if MONGO_URL is not defined
} else {
  console.log("Mongo URL loaded successfully!");
}

// Connect to Mongo Atlas using connection string from env. file
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if connection fails
  });

// Setting a Schema and model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", thoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start route
app.get("/", (request, response) => {
  const endpoints = listEndpoints(app); // Fetch all available routes
  response.json({
    message:
      "Welcome to the Happy Thoughts API! Below are the available endpoints",
    endpoints: endpoints, // Send the list of endpoints as JSON
  });
});

// Get all thoughts (sorted by most recent)
app.get("/thoughts", async (request, response) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    response.status(200).json(thoughts);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

// Create a new thought
app.post("/thoughts", async (request, response) => {
  console.log(request.body); // Log the incoming request body
  const { message } = request.body;

  try {
    const newThought = await Thought.create({ message });
    response.status(201).json(newThought);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

/// Like a specific thought
app.post("/thoughts/:thoughtId/like", async (request, response) => {
  const { thoughtId } = request.params; // Get the thoughtId from the URL params
  console.log(`Received request to like thought with ID: ${thoughtId}`);

  try {
    const thought = await Thought.findById(thoughtId); // Find the thought by its ID

    if (!thought) {
      return response.status(404).json({ error: "Thought not found" });
    }

    thought.hearts += 1; // Increment the hearts count
    await thought.save(); // Save the updated thought

    console.log(
      `Thought liked: ${thought.message} | Hearts: ${thought.hearts}`
    ); // Log the updated hearts count

    response.status(200).json(thought); // Respond with the updated thought
  } catch (error) {
    console.error("Error updating thought:", error);
    response.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
