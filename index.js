import express from 'express';
import { createConnection } from 'mysql';

const app = express();

const connection = createConnection({
  host: "localhost",
  user: "root",
  password: "youbiaya.17032005",
  database: "datab",
  connectTimeout: 10000
});


const authenticate = (req, res, next) => {
  // verifier si l'utilisateur est autorisée
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "pas autorisé" });
  }
};
//pour la securité

app.post('/api/get', authenticate, (req, res) => {
    const { user_id } = req.session.user;
    const { favorite_id, book_id } = req.body;
  
    const sql = 'INSERT INTO favorite (FAVORITE_ID, BOOK_ID, USER_ID) VALUES (?, ?, ?)';
    connection.query(sql, [user_id, favorite_id, book_id], (error, results) => {
      if (error) {
        console.error('Error inserting favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Favorite added successfully' });
      }
    });
  });
  
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });





