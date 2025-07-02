import express from 'express';
const app = express();
const port = 3000;
const movies = [
  { title: 'Inception', rating: 8.8 },
  { title: 'Interstellar', rating: 8.6 },
  { title: 'The Room', rating: 3.7 },
  { title: 'Parasite', rating: 8.6 }
];

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('layout', { movies });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
