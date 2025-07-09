import express from 'express';
import cookieParser from "cookie-parser";
import session from "express-session";
const app = express();
app.use(express.json());
app.use(cookieParser());

const courses = [
  { id: 'c1', name: 'Math 101' },
  { id: 'c2', name: 'Physics 101' },
  { id: 'c3', name: 'History 101' }
];

const enrolledByUser = {};

function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  req.userId = userId;
  if (!enrolledByUser[userId]) enrolledByUser[userId] = [];
  next();
}

app.get('/courses', authMiddleware, (req, res) => {
  res.json(courses);
});

app.post('/courses', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId is required' });
  }

  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (enrolledByUser[userId].includes(courseId)) {
    return res.status(400).json({ error: 'Already enrolled in this course' });
  }

  enrolledByUser[userId].push(courseId);

  res.cookie('lastEnrolledCourse', courseId, { maxAge: 2 * 60 * 1000, httpOnly: true });

  res.json({ message: `Enrolled in ${course.name} successfully!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
