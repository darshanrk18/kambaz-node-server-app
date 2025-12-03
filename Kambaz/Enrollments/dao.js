import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const enrollUserInCourse = (userId, courseId) => {
    const { enrollments } = db;
    // Check if already enrolled
    const existingEnrollment = enrollments.find(
      (e) => e.user === userId && e.course === courseId
    );
    if (existingEnrollment) {
      return existingEnrollment;
    }
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    const { enrollments } = db;
    db.enrollments = enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );
  };

  const findEnrollmentsForUser = (userId) => {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
  };

  const findEnrollmentsForCourse = (courseId) => {
    const { enrollments } = db;
    return enrollments.filter((e) => e.course === courseId);
  };

  const findUsersForCourse = (courseId) => {
    const { enrollments, users } = db;
    const enrolledUserIds = enrollments
      .filter((e) => e.course === courseId)
      .map((e) => e.user);
    return users.filter((u) => enrolledUserIds.includes(u._id));
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findUsersForCourse,
  };
}