const User = require('../models/user');

exports.registerUser = async (req, res) => {
  try {
    const { email, name, major, skills, interests, others } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
        name,
        email,
        major,
        skills: skills || [],       // fallback in case undefined
        interests: interests || [],
        others: others || []
      });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
