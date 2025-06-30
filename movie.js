import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', rating: 9 },
  { id: 2, title: 'The Godfather', genre: 'Crime', rating: 10 },
  { id: 3, title: 'The Dark Knight', genre: 'Action', rating: 9 }
];

let nextId = 4;


app.get('/movies', (req, res) => {
  res.send(movies);
});


app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).send('Movie not found.');
  }

  res.send(movie);
});


app.post('/movies', (req, res) => {
  const { title, genre, rating } = req.body;

  if (!title || !genre || rating === undefined || rating < 1 || rating > 10) {
    return res.status(400).send('Invalid input. Ensure title, genre, and rating (1–10) are provided.');
  }

  const newMovie = {
    id: nextId++,
    title,
    genre,
    rating
  };

  movies.push(newMovie);
  res.send(`Movie added successfully:\n${JSON.stringify(newMovie)}`);
});


app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).send('Movie not found.');
  }

  const { title, genre, rating } = req.body;

  if (rating !== undefined && (rating < 1 || rating > 10)) {
    return res.status(400).send('Rating must be between 1 and 10.');
  }

  if (title !== undefined) movie.title = title;
  if (genre !== undefined) movie.genre = genre;
  if (rating !== undefined) movie.rating = rating;

  res.send(`Movie updated successfully:\n${JSON.stringify(movie)}`);
});


app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);

  if (index === -1) {
    return res.send(`No movie found with ID ${id}. Nothing was deleted.`);
  }

  const deleted = movies.splice(index, 1);
  res.send(`Movie deleted successfully:\n${JSON.stringify(deleted[0])}`);
});


app.listen(PORT, () => {
  console.log(`Movie library app is running at http://localhost:${PORT}`);
});
