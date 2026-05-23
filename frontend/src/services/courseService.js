import api from "./api";

const enrollCourse = (courseData) => {
  return api.post("/courses/enroll", courseData);
};

const getMyCourses = () => {
  return api.get("/courses");
};

const updateLesson = (courseId, lessonId, completed) => {
  return api.patch(`/courses/${courseId}/lessons/${lessonId}`, {
    completed,
  });
};

const deleteCourse = (courseId) => {
  return api.delete(`/courses/${courseId}`);
};

const courseService = {
  enrollCourse,
  getMyCourses,
  updateLesson,
  deleteCourse,
};

export default courseService;