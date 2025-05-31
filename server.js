require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// Ana route'a basit mesaj
app.get('/', (req, res) => {
  res.json({ message: 'Trafik API Sunucusu Çalışıyor' });
});

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'trafikdb'
  });

// Kullanıcı Kaydı
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
  }
  try {
    // Kullanıcı var mı kontrol et
    const [user] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (user.length > 0) {
      return res.status(409).json({ message: 'Kullanıcı adı veya email zaten kayıtlı.' });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kaydet
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(201).json({ message: 'Kayıt başarılı.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Kullanıcı Girişi
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
  }
  try {
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const validPass = await bcrypt.compare(password, user[0].password);
    if (!validPass) {
      return res.status(401).json({ message: 'Şifre hatalı.' });
    }
    // JWT Token oluştur
    const token = jwt.sign({ id: user[0].id, username: user[0].username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, message: 'Giriş başarılı.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));