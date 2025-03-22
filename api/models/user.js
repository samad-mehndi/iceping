const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  major: {
    type: String,
    required: false,
  },
  skills: {
    type: [String], // Example: ["Python", "React"]
    required: false,
  },
  interests: {
    type: [String], // Example: ["Gaming", "Hackathons"]
    required: false,
  },
  others: {
    type: [String], // flexible for any extra fields (e.g., LinkedIn, pronouns, etc.)
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
