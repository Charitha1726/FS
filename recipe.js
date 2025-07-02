import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/styles', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  const recipe = {
    image: '/assets/pancake.jpg',
    ingredients: [
      { item: 'Flour', highlight: true },
      { item: 'Eggs', highlight: true },
      { item: 'Milk', highlight: true },
      { item: 'Sugar', highlight: true },
      { item: 'Baking Powder', highlight: true }
    ],
    steps: [
      'Mix the dry ingredients together.',
      'Add eggs and milk, stir until smooth.',
      'Heat a frying pan and pour batter to form pancakes.',
      'Cook until bubbles appear, then flip and cook until golden.',
      'Serve warm with syrup or toppings of choice.'
    ]
  };

  res.render('recipe', { recipe });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



