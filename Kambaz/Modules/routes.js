import ModulesDao from "./dao.js";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModule = (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = dao.createModule(module);
    res.send(newModule);
  };

  const deleteModule = (req, res) => {
    const { moduleId } = req.params;
    dao.deleteModule(moduleId);
    res.sendStatus(204);
  };

  const updateModule = (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    dao.updateModule(moduleId, moduleUpdates);
    res.sendStatus(204);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModule);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}