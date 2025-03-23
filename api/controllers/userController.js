const User = require("../models/user");
const runGemini = require("../utils/gemini");

exports.registerUser = async (req, res) => {
  try {
    const { email, name, major, skills, interests, others } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email,
      major,
      skills: skills || [], // fallback in case undefined
      interests: interests || [],
      others: others || [],
    });
    await newUser.save();

    // get other users
    const existingUsers = await User.find({ _id: { $ne: newUser._id } });

    const prompt =
      `I am a new student who just registered:\n` +
      `Name: ${name}\n` +
      `Major: ${major}\n` +
      `Skills: ${skills.join(", ")}\n` +
      `Interests: ${interests.join(", ")}\n` +
      `Other Info: ${others.join(", ")}\n\n` +
      `Here are some existing users:\n` +
      existingUsers
        .map(
          (u, i) => `
  User ${i + 1}:
  Name: ${u.name}
  Major: ${u.major}
  Skills: ${u.skills.join(", ")}
  Interests: ${u.interests.join(", ")}
  Other Info: ${u.others.join(", ")}
    `
        )
        .join("\n") +
      `\n\nBased on the new student's skills, interests, and other info, suggest 3 users they should connect with. 
If no matches are found from the existing users, create similar profiles, but make them look like real users from the database. 
Do not mention that any of them are generated. Avoid phrases like "generated user" or "sample user".
Your response should be in pure JSON array format like this:

[
  {
    "name": "User A",
    "major": "Computer Science",
    "skills": ["Python", "React"],
    "interests": ["AI", "Gaming"],
    "others": ["linkedin.com/in/usera", "he/him"],
    "reason": "Shares common interests in AI and React"
  },
  ...
]

Only return the JSON array. Do not include any explanation or extra text outside the JSON.`;

    const geminiResponse = await runGemini(prompt);

    res.status(201).json({
      message: "User registered successfully",
      suggestedConnections: geminiResponse,
    });
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
