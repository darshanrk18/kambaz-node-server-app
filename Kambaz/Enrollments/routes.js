import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // These routes are now handled in Courses/routes.js to match frontend expectations
  // Keeping this file for backward compatibility but routes are moved

  return;
}
