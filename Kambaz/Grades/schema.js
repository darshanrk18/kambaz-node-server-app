import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    _id: String,
    student: { type: String, ref: "UserModel" },
    assignment: { type: String, ref: "AssignmentModel" },
    grade: Number,
  },
  { collection: "grades" }
);

export default gradeSchema;
