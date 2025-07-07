const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const students = {}; 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'student-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);


app.post('/register', (req, res) => {
  const { rollNo, name, password } = req.body;

  if (!rollNo || !name || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (students[rollNo]) {
    return res.status(409).json({ message: 'Student already exists.' });
  }

  students[rollNo] = { name, password };
  res.status(201).json({ message: 'Student registered successfully.' });
});


app.post('/login', (req, res) => {
  const { rollNo, password } = req.body;
  const student = students[rollNo];

  if (!student || student.password !== password) {
    return res.status(401).json({ message: 'Invalid roll number or password.' });
  }

  req.session.student = { rollNo, name: student.name };

  res.cookie('studentPortalAccess', rollNo, {
    maxAge: 3 * 60 * 1000, 
    httpOnly: true,
  });

  res.json({ message: 'Login successful.' });
});


function isAuthenticated(req, res, next) {
  if (req.session.student) {
    return next();
  }
  return res.status(401).json({ message: 'Access denied: please login to view results.' });
}


app.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({
    message: `Welcome ${req.session.student.name}`,
    rollNo: req.session.student.rollNo,
  });
});


app.get('/result', isAuthenticated, (req, res) => {
  const name = req.session.student.name;
  res.json({ message: `Hi ${name}, your results are available.` });
});


app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out.' });
    }
    res.clearCookie('studentPortalAccess');
    res.json({ message: 'Logout successful.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
