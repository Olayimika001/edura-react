import api from './api';

const courseService = {
  getAllCourses: async (filters = {}) => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getUserCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },
};

export default courseService;