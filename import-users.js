import "dotenv/config";
import mongoose from "mongoose";
import userSchema from "./Kambaz/Users/schema.js";

// Connect to MongoDB
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

await mongoose.connect(CONNECTION_STRING, { dbName: "kambaz" });
const dbName = mongoose.connection.db?.databaseName || "unknown";
console.log("Connected to MongoDB database:", dbName);

// Create User model
const User = mongoose.model("UserModel", userSchema);

// Import users data
import usersData from "./Kambaz/Database/users.js";

console.log(`Found ${usersData.length} users to import`);

// Clear existing users (optional - comment out if you want to keep existing)
console.log("Clearing existing users...");
await User.deleteMany({});
console.log("Cleared existing users");

// Import users
let successCount = 0;
let errorCount = 0;

for (const user of usersData) {
  try {
    await User.create(user);
    console.log(`Imported user: ${user.username}`);
    successCount++;
  } catch (error) {
    console.error(`Error importing user ${user.username}:`, error.message);
    errorCount++;
  }
}

console.log("\n=== Import Complete ===");
console.log(`Successfully imported: ${successCount} users`);
console.log(`Errors: ${errorCount} users`);

// Verify the import
const totalUsers = await User.countDocuments();
console.log(`\nTotal users in database: ${totalUsers}`);

// Test query
const testUser = await User.findOne({ username: "iron_man" });
if (testUser) {
  console.log(`\n✓ Test user found: ${testUser.username}`);
  console.log(`  Password matches: ${testUser.password === "stark123" ? "YES" : "NO"}`);
} else {
  console.log("\n✗ Test user 'iron_man' not found!");
}

await mongoose.disconnect();
console.log("\nDisconnected from MongoDB");
process.exit(0);

