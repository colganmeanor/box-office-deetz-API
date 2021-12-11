const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3001);
app.locals.favoriteMovies = []

app.get('/api/v1/favorite-movies', (request, response) => {
  const faves = app.locals.favoriteMovies;

  response.json({ faves });
});

app.get('/api/v1/favorite-movies/:id', (request, response) => {
    const id = request.params.id;
    const foundFave = app.locals.favoriteMovies.find(movie => movie.id === parseInt(id))

  response.status(200).json(foundFave)
});

app.post('/api/v1/favorite-movies', (request, response) => {
  const fave = request.body;

    for (let requiredParameter of ['id', 'poster_path', 'backdrop_path', 'title', 'average_rating', "release_date"]) {
    if (!fave[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { id: <Number>, poster_path: <String>, backdrop_path: <String>, title: <String>, average_rating: <String>, release_date: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  const { id, poster_path, backdrop_path, title, average_rating, release_date } = fave
  app.locals.favoriteMovies.push({ id, poster_path, backdrop_path, title, average_rating, release_date });
  response.status(201).json({ id, poster_path, backdrop_path, title, average_rating, release_date });
  console.log(app.locals.favoriteMovies)
});

app.delete('/api/v1/favorite-movies/:id', (request, response) => {
  const id = request.params.id
  const foundFave = app.locals.favoriteMovies.find(movie => movie.id === parseInt(id))

  app.locals.favoriteMovies.splice(foundFave)
  console.log(app.locals.favoriteMovies)
  response.send('DELETED')

  
});



app.listen(app.get('port'), () => {
  console.log(`Box Office Deetz API is running on http://localhost:${app.get('port')}.`);
});