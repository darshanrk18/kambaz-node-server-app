import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    const assignments = await model.find({ course: courseId }).lean();
    console.log(`DAO: Found ${assignments.length} assignments for course ${courseId}`);
    return assignments;
  }

  async function findAssignmentById(courseId, assignmentId) {
    return model.findOne({ _id: assignmentId, course: courseId }).lean();
  }

  async function createAssignment(courseId, assignment) {
    const newAssignment = { ...assignment, _id: uuidv4(), course: courseId };
    return model.create(newAssignment);
  }

  async function deleteAssignment(courseId, assignmentId) {
    return model.deleteOne({ _id: assignmentId, course: courseId });
  }

  async function updateAssignment(courseId, assignmentId, assignmentUpdates) {
    return model.updateOne(
      { _id: assignmentId, course: courseId },
      { $set: assignmentUpdates }
    );
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}

