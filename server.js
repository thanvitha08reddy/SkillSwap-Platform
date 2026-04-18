const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',// ⚠️ Set your MySQL password here before running 
  database: 'skillswap',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);
pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL ✅");
    conn.release();
  })
  .catch(err => {
    console.error("MySQL Connection Error ❌", err);
  });
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, teach, learn FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('GET /api/users error', error);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name,email, teach, learn } = req.body;
  if (!name || !teach || !learn) {
    return res.status(400).json({ error: 'name, teach and learn are required' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE name = ? AND teach = ? AND learn = ?',
      [name, teach, learn]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name,email, teach, learn) VALUES (?,?, ?, ?)',
      [name, email, teach, learn]
    );

    const [newRecord] = await pool.query('SELECT id, name, teach, learn FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('POST /api/users error', error);
    res.status(500).json({ error: 'Unable to add user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/:id error', error);
    res.status(500).json({ error: 'Unable to delete user' });
  }
});

app.listen(port, () => {
  console.log(`SkillSwap API running at http://localhost:${port}`);
});
