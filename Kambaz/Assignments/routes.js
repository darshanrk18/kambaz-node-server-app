import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const assignments = await dao.findAssignmentsForCourse(courseId);
      console.log(`Found ${assignments.length} assignments for course ${courseId}`);
      res.json(assignments);
    } catch (error) {
      console.error("Error finding assignments:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const findAssignmentById = async (req, res) => {
    const { courseId, assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(courseId, assignmentId);
    res.json(assignment);
  };

  const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    const assignment = req.body;
    const newAssignment = await dao.createAssignment(courseId, assignment);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { courseId, assignmentId } = req.params;
    const status = await dao.deleteAssignment(courseId, assignmentId);
    res.send(status);
  };

  const updateAssignment = async (req, res) => {
    const { courseId, assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(courseId, assignmentId, assignmentUpdates);
    res.send(status);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/courses/:courseId/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.delete("/api/courses/:courseId/assignments/:assignmentId", deleteAssignment);
  app.put("/api/courses/:courseId/assignments/:assignmentId", updateAssignment);
}

