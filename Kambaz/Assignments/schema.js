import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    points: Number,
    dueDate: String,
    availableFrom: String,
    availableUntil: String,
    course: { type: String, ref: "CourseModel" },
  },
  { collection: "assignments" }
);

export default assignmentSchema;
