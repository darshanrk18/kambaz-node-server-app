import "dotenv/config";
import mongoose from "mongoose";
import userSchema from "./Kambaz/Users/schema.js";
import courseSchema from "./Kambaz/Courses/schema.js";
import enrollmentSchema from "./Kambaz/Enrollments/schema.js";
import assignmentSchema from "./Kambaz/Assignments/schema.js";
import gradeSchema from "./Kambaz/Grades/schema.js";

// Connect to MongoDB
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

await mongoose.connect(CONNECTION_STRING);
console.log("Connected to MongoDB");

// Create models
const User = mongoose.model("UserModel", userSchema);
const Course = mongoose.model("CourseModel", courseSchema);
const Enrollment = mongoose.model("EnrollmentModel", enrollmentSchema);
const Assignment = mongoose.model("AssignmentModel", assignmentSchema);
const Grade = mongoose.model("GradeModel", gradeSchema);

// Import data
import usersData from "./Kambaz/Database/users.js";
import coursesData from "./Kambaz/Database/courses.js";
import modulesData from "./Kambaz/Database/modules.js";
import enrollmentsData from "./Kambaz/Database/enrollments.js";
import assignmentsData from "./Kambaz/Database/assignments.js";
import gradesData from "./Kambaz/Database/grades.js";

console.log("\n=== Starting Data Migration ===\n");
console.log(`Found ${usersData.length} users`);
console.log(`Found ${coursesData.length} courses`);
console.log(`Found ${modulesData.length} modules`);
console.log(`Found ${enrollmentsData.length} enrollments`);
console.log(`Found ${assignmentsData.length} assignments`);
console.log(`Found ${gradesData.length} grades\n`);

// ============================================
// 1. Import Users
// ============================================
console.log("1. Importing Users...");
await User.deleteMany({});
let userSuccessCount = 0;
let userErrorCount = 0;

for (const user of usersData) {
  try {
    await User.create(user);
    userSuccessCount++;
  } catch (error) {
    console.error(`Error importing user ${user.username}:`, error.message);
    userErrorCount++;
  }
}
console.log(`   Imported ${userSuccessCount} users`);
if (userErrorCount > 0) {
  console.log(`   Errors: ${userErrorCount} users`);
}

// ============================================
// 2. Import Courses with Embedded Modules
// ============================================
console.log("\n2. Importing Courses with Embedded Modules...");
await Course.deleteMany({});
let courseSuccessCount = 0;
let courseErrorCount = 0;

for (const course of coursesData) {
  try {
    // Find all modules for this course
    const courseModules = modulesData.filter((module) => module.course === course._id);
    
    // Transform modules to embedded format (remove 'course' field, keep lessons)
    const embeddedModules = courseModules.map((module) => ({
      _id: module._id,
      name: module.name,
      description: module.description,
      lessons: module.lessons || [], // Lessons are already in the correct format
    }));

    // Create course document with embedded modules
    const courseDocument = {
      ...course,
      modules: embeddedModules,
    };

    // Insert into MongoDB
    await Course.create(courseDocument);
    console.log(`   Created course ${course._id} (${course.name}) with ${embeddedModules.length} modules`);
    courseSuccessCount++;
  } catch (error) {
    console.error(`   Error processing course ${course._id}:`, error.message);
    courseErrorCount++;
  }
}
console.log(`   Imported ${courseSuccessCount} courses`);
if (courseErrorCount > 0) {
  console.log(`   Errors: ${courseErrorCount} courses`);
}

// ============================================
// 3. Import Enrollments
// ============================================
console.log("\n3. Importing Enrollments...");
await Enrollment.deleteMany({});
let enrollmentSuccessCount = 0;
let enrollmentErrorCount = 0;

for (const enrollment of enrollmentsData) {
  try {
    await Enrollment.create(enrollment);
    enrollmentSuccessCount++;
  } catch (error) {
    console.error(`Error importing enrollment ${enrollment._id}:`, error.message);
    enrollmentErrorCount++;
  }
}
console.log(`   Imported ${enrollmentSuccessCount} enrollments`);
if (enrollmentErrorCount > 0) {
  console.log(`   Errors: ${enrollmentErrorCount} enrollments`);
}

// ============================================
// 4. Import Assignments
// ============================================
console.log("\n4. Importing Assignments...");
await Assignment.deleteMany({});
let assignmentSuccessCount = 0;
let assignmentErrorCount = 0;

// Convert assignments data to proper assignment format
// The _id in assignments.js matches course IDs, so we use _id as the course reference
for (const item of assignmentsData) {
  try {
    // Create assignment object with course field set to the _id
    // Remove course-specific fields (number, credits, department, startDate, endDate)
    const assignment = {
      _id: `A${item._id}`, // Prefix with 'A' to make it unique
      name: item.name,
      description: item.description,
      points: item.points || 100,
      dueDate: item.endDate || item.dueDate || "",
      availableFrom: item.startDate || item.availableFrom || "",
      availableUntil: item.endDate || item.availableUntil || "",
      course: item._id, // Link to course using the _id
    };
    
    await Assignment.create(assignment);
    assignmentSuccessCount++;
  } catch (error) {
    console.error(`Error importing assignment for course ${item._id}:`, error.message);
    assignmentErrorCount++;
  }
}

console.log(`   Imported ${assignmentSuccessCount} assignments`);
if (assignmentErrorCount > 0) {
  console.log(`   Errors: ${assignmentErrorCount} assignments`);
}

// ============================================
// 5. Import Grades
// ============================================
console.log("\n5. Importing Grades...");
await Grade.deleteMany({});
let gradeSuccessCount = 0;
let gradeErrorCount = 0;

for (const grade of gradesData) {
  try {
    await Grade.create(grade);
    gradeSuccessCount++;
  } catch (error) {
    console.error(`Error importing grade ${grade._id}:`, error.message);
    gradeErrorCount++;
  }
}
console.log(`   Imported ${gradeSuccessCount} grades`);
if (gradeErrorCount > 0) {
  console.log(`   Errors: ${gradeErrorCount} grades`);
}

// ============================================
// 6. Verification
// ============================================
console.log("\n=== Verification ===");
const totalUsers = await User.countDocuments();
const totalCourses = await Course.countDocuments();
const totalEnrollments = await Enrollment.countDocuments();
const totalAssignments = await Assignment.countDocuments();
const totalGrades = await Grade.countDocuments();

console.log(`Total users in database: ${totalUsers}`);
console.log(`Total courses in database: ${totalCourses}`);
console.log(`Total enrollments in database: ${totalEnrollments}`);
console.log(`Total assignments in database: ${totalAssignments}`);
console.log(`Total grades in database: ${totalGrades}`);

// Test queries
const testUser = await User.findOne({ username: "iron_man" });
if (testUser) {
  console.log(`\nTest user found: ${testUser.username}`);
} else {
  console.log("\nTest user 'iron_man' not found!");
}

const testCourse = await Course.findOne({ _id: "RS101" });
if (testCourse) {
  console.log(`Test course found: ${testCourse.name}`);
  console.log(`  Modules: ${testCourse.modules?.length || 0}`);
  if (testCourse.modules && testCourse.modules.length > 0) {
    console.log(`  First module: ${testCourse.modules[0].name}`);
    console.log(`  Lessons in first module: ${testCourse.modules[0].lessons?.length || 0}`);
  }
} else {
  console.log("\nTest course 'RS101' not found!");
}

const testEnrollment = await Enrollment.findOne();
if (testEnrollment) {
  console.log(`Test enrollment found: ${testEnrollment._id}`);
} else {
  console.log("\nNo enrollments found!");
}

// ============================================
// Summary
// ============================================
console.log("\n=== Migration Complete ===");
console.log(`Users: ${userSuccessCount} imported`);
console.log(`Courses: ${courseSuccessCount} imported (with embedded modules)`);
console.log(`Enrollments: ${enrollmentSuccessCount} imported`);
console.log(`Assignments: ${assignmentSuccessCount} imported`);
console.log(`Grades: ${gradeSuccessCount} imported`);

if (userErrorCount > 0 || courseErrorCount > 0 || enrollmentErrorCount > 0 || gradeErrorCount > 0) {
  console.log(`\nErrors occurred during migration. Check logs above.`);
}

await mongoose.disconnect();
console.log("\nDisconnected from MongoDB");
process.exit(0);

