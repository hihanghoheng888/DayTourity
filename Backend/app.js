require('dotenv').config();
const express  = require('express');
const mysql    = require('mysql2/promise');
const crypto   = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const app  = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const db = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASS     || '',
  database:           process.env.DB_NAME     || 'honkai_star_retail',
  waitForConnections: true,
  connectionLimit:    10,
});

// Cast MySQL DECIMAL/INT strings to JS numbers in every response
const num  = v => parseFloat(v ?? 0) || 0;
const int_ = v => parseInt(v  ?? 0) || 0;

function castP(p) {   // product
  return !p ? p : { ...p, price: num(p.price), stock: int_(p.stock),
    is_promo: int_(p.is_promo) };
}
function castO(o) {   // order
  return !o ? o : { ...o, quantity: int_(o.quantity),
    total_price: num(o.total_price) };
}
function castF(f) {   // feedback
  return !f ? f : { ...f, rating: num(f.rating) };
}
function castC(c) {   // cart item
  return !c ? c : { ...c, price: num(c.price), stock: int_(c.stock),
    cart_qty: int_(c.cart_qty) };
}
function castU(u) {   // user
  return !u ? u : { ...u, lorepay_credits: num(u.lorepay_credits) };
}
function withImg(p, host) {
  return { ...castP(p), image_url: p.image_url
    ? (p.image_url.startsWith('http') ? p.image_url : `${host}${p.image_url}`)
    : null };
}


// ── Token helper — 64 alphanumeric chars (>20) ───────────────
function generateToken() {
  const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes  = crypto.randomBytes(64);
  return Array.from(bytes).map(b => chars[b % 62]).join('');
}

// ── Bearer token middleware ───────────────────────────────────
async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }
  const token = header.slice(7);
  const [rows] = await db.query('SELECT * FROM users WHERE token = ?', [token]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid or expired token.' });
  req.user = rows[0];
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });
  next();
}

// ============================================================
// AUTH
// ============================================================

// POST /auth/login — username + email login
app.post('/auth/login', async (req, res) => {
  const { username, email, role } = req.body;

  // Validation
  if (!username || !email || !role) {
    return res.status(400).json({ error: 'username, email, and role are required.' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be user or admin.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND email = ?', [username, email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials.' });

    const user = rows[0];
    if (user.role !== role) {
      return res.status(401).json({ error: 'Wrong role selected for this account.' });
    }

    const token = generateToken();
    await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    return res.json({
      token,
      role:     user.role,
      username: user.username,
      id:       user.id,
      lorepay_credits: num(user.lorepay_credits),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// POST /auth/google — Google OAuth (web + mobile)
app.post('/auth/google', async (req, res) => {
  const { idToken, email: directEmail, name: directName, role } = req.body;

  let email, name;

  // Try idToken verification (mobile)
  if (idToken) {
    try {
      const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket  = await client.verifyIdToken({ idToken });
      const payload = ticket.getPayload();
      email = payload.email;
      name  = payload.name || email.split('@')[0];
    } catch (err) {
      console.log('idToken verify failed:', err.message);
    }
  }

  // Web fallback: use email/name sent directly from google_sign_in
  if (!email && directEmail) {
    email = directEmail;
    name  = directName || directEmail.split('@')[0];
  }

  if (!email) {
    return res.status(400).json({ error: 'Google authentication failed. No email received.' });
  }

  try {
    let [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    if (!rows.length) {
      const [result] = await db.query(
        'INSERT INTO users (username,email,role,oauth_provider,lorepay_credits) VALUES (?,?,?,?,60000)',
        [name, email, role || 'user', 'google']);
      const [newRows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newRows[0];
    } else {
      user = rows[0];
    }

    const token = generateToken();
    await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    return res.json({
      token,
      role:     user.role,
      username: user.username,
      id:       user.id,
      lorepay_credits: num(user.lorepay_credits),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during Google login.' });
  }
});

// POST /auth/logout — invalidate token
app.post('/auth/logout', auth, async (req, res) => {
  await db.query('UPDATE users SET token = NULL WHERE id = ?', [req.user.id]);
  res.json({ message: 'Logged out.' });
});

// ============================================================
// PRODUCTS — GET (2 GET requests cover requirement)
// ============================================================

// GET /products — list all (with optional sort/filter)
// Bearer token required — covers "at least bearer token verification in 1 request"
app.get('/products', auth, async (req, res) => {
  const { sort, min_price, max_price } = req.query;
  let sql  = 'SELECT * FROM products WHERE 1=1';
  const args = [];

  if (min_price) { sql += ' AND price >= ?'; args.push(parseFloat(min_price)); }
  if (max_price) { sql += ' AND price <= ?'; args.push(parseFloat(max_price)); }

  const orderMap = {
    price_asc:  'price ASC',
    price_desc: 'price DESC',
    stock_asc:  'stock ASC',
    stock_desc: 'stock DESC',
  };
  sql += ' ORDER BY ' + (orderMap[sort] || 'id ASC');

  const [rows] = await db.query(sql, args);
  res.json(rows.map(castP));
});

// GET /products/:id — single product detail
app.get('/products/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Product not found.' });
  res.json(castP(rows[0]));
});

// GET /products/:id/feedback
app.get('/products/:id/feedback', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM feedback WHERE product_id = ? ORDER BY created_at DESC', [req.params.id]);
  res.json(rows.map(castF));
});

// GET /promos
app.get('/promos', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE is_promo = 1');
  res.json(rows.map(castP));
});

// POST /products — admin create
app.post('/products', auth, adminOnly, async (req, res) => {
  const { name, description, price, stock, image_url, is_promo } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'name and price are required.' });
  }
  const [result] = await db.query(
    'INSERT INTO products (name,description,price,stock,image_url,is_promo) VALUES (?,?,?,?,?,?)',
    [name, description || '', parseFloat(price), parseInt(stock) || 0, image_url || null, is_promo ? 1 : 0]);
  const [newRows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
  res.status(201).json(newRows[0]);
});

// PUT /products/:id — admin update
app.put('/products/:id', auth, adminOnly, async (req, res) => {
  const { name, description, price, stock, image_url, is_promo } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'name and price are required.' });
  }
  await db.query(
    'UPDATE products SET name=?,description=?,price=?,stock=?,image_url=?,is_promo=? WHERE id=?',
    [name, description, parseFloat(price), parseInt(stock), image_url || null, is_promo ? 1 : 0, req.params.id]);
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(castP(rows[0]));
});

// DELETE /products/:id — admin delete
app.delete('/products/:id', auth, adminOnly, async (req, res) => {
  await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Product deleted.' });
});

// ============================================================
// ORDERS
// ============================================================

// GET /orders — admin gets all
app.get('/orders', auth, adminOnly, async (req, res) => {
  const [rows] = await db.query(
    'SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC');
  res.json(rows.map(castO));
});

// GET /orders/my — user gets their own
app.get('/orders/my', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows.map(castO));
});

// POST /orders — place order
app.post('/orders', auth, async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'product_id and quantity are required.' });
  }
  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1.' });
  }

  const [prodRows] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
  if (!prodRows.length) return res.status(404).json({ error: 'Product not found.' });

  const product = prodRows[0];
  if (product.stock < quantity) {
    return res.status(400).json({ error: `Insufficient stock. Only ${product.stock} left.` });
  }

  const total = parseFloat(product.price) * quantity;
  const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const user = userRows[0];

  if (parseFloat(user.lorepay_credits) < total) {
    return res.status(400).json({ error: 'Insufficient Lorepay Credits.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
    await conn.query('UPDATE users SET lorepay_credits = lorepay_credits - ? WHERE id = ?', [total, req.user.id]);
    const [result] = await conn.query(
      'INSERT INTO orders (user_id,product_id,product_name,quantity,total_price,status) VALUES (?,?,?,?,?,?)',
      [req.user.id, product_id, product.name, quantity, total, 'masuk']);
    await conn.commit();
    conn.release();
    res.status(201).json({ message: 'Order placed.', order_id: result.insertId, total });
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
});

// PATCH /orders/:id/status — admin update status
app.patch('/orders/:id/status', auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['masuk','terkirim','selesai'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'Status updated.' });
});

// ============================================================
// CART
// ============================================================

// GET /cart
app.get('/cart', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id as cart_id, c.quantity as cart_qty,
            p.id, p.name, p.price, p.stock, p.image_url, p.description
     FROM cart c INNER JOIN products p ON c.product_id=p.id
     WHERE c.user_id=? ORDER BY c.added_at DESC`, [req.user.id]);
  res.json(rows.map(castC));
});

// POST /cart — add item
app.post('/cart', auth, async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required.' });
  const qty = parseInt(quantity) || 1;
  await db.query(
    `INSERT INTO cart (user_id,product_id,quantity) VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
    [req.user.id, product_id, qty, qty]);
  res.json({ message: 'Added to cart.' });
});

// PATCH /cart/:id — update quantity
app.patch('/cart/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    await db.query('DELETE FROM cart WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    return res.json({ message: 'Removed.' });
  }
  await db.query('UPDATE cart SET quantity=? WHERE id=? AND user_id=?',
    [quantity, req.params.id, req.user.id]);
  res.json({ message: 'Updated.' });
});

// DELETE /cart/:id
app.delete('/cart/:id', auth, async (req, res) => {
  await db.query('DELETE FROM cart WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  res.json({ message: 'Removed.' });
});

// DELETE /cart — clear cart
app.delete('/cart', auth, async (req, res) => {
  await db.query('DELETE FROM cart WHERE user_id=?', [req.user.id]);
  res.json({ message: 'Cart cleared.' });
});

// ============================================================
// FAVORITES
// ============================================================

// GET /favorites
app.get('/favorites', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.* FROM products p
     INNER JOIN favorites f ON p.id=f.product_id
     WHERE f.user_id=?`, [req.user.id]);
  res.json(rows.map(castP));
});

// POST /favorites — toggle
app.post('/favorites', auth, async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required.' });
  const [rows] = await db.query(
    'SELECT id FROM favorites WHERE user_id=? AND product_id=?', [req.user.id, product_id]);
  if (rows.length) {
    await db.query('DELETE FROM favorites WHERE user_id=? AND product_id=?',
      [req.user.id, product_id]);
    res.json({ favorited: false });
  } else {
    await db.query('INSERT INTO favorites (user_id,product_id) VALUES (?,?)',
      [req.user.id, product_id]);
    res.json({ favorited: true });
  }
});

// ============================================================
// FEEDBACK
// ============================================================

// GET /feedback — admin
app.get('/feedback', auth, adminOnly, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
  res.json(rows.map(castF));
});

// GET /feedback/stats — admin stats
app.get('/feedback/stats', auth, adminOnly, async (req, res) => {
  const [masuk]    = await db.query("SELECT COUNT(*) as c FROM orders WHERE status='masuk'");
  const [terkirim] = await db.query("SELECT COUNT(*) as c FROM orders WHERE status='terkirim'");
  const [selesai]  = await db.query("SELECT COUNT(*) as c FROM orders WHERE status='selesai'");
  const [rating]   = await db.query("SELECT COALESCE(AVG(rating),0) as avg FROM feedback");
  res.json({
    masuk:    masuk[0].c,
    terkirim: terkirim[0].c,
    selesai:  selesai[0].c,
    rating:   parseFloat(num(rating[0].avg).toFixed(1)),
  });
});

// POST /feedback
app.post('/feedback', auth, async (req, res) => {
  const { product_id, rating, comment } = req.body;
  if (!product_id || rating == null) {
    return res.status(400).json({ error: 'product_id and rating are required.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }
  await db.query(
    'INSERT INTO feedback (user_id,product_id,username,rating,comment) VALUES (?,?,?,?,?)',
    [req.user.id, product_id, req.user.username, parseFloat(rating), comment || '']);
  res.status(201).json({ message: 'Feedback submitted.' });
});

// ============================================================
// NOTIFICATIONS
// ============================================================

// GET /notifications
app.get('/notifications', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

// PATCH /notifications/read — mark all read
app.patch('/notifications/read', auth, async (req, res) => {
  await db.query('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.id]);
  res.json({ message: 'Marked as read.' });
});

// ============================================================
// USER PROFILE
// ============================================================

// GET /profile
app.get('/profile', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id,username,email,role,lorepay_credits,oauth_provider FROM users WHERE id=?',
    [req.user.id]);
  res.json(castU(rows[0]));
});

// PUT /profile — update username/email
app.put('/profile', auth, async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'username and email are required.' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  await db.query('UPDATE users SET username=?, email=? WHERE id=?',
    [username, email, req.user.id]);
  const [rows] = await db.query(
    'SELECT id,username,email,role,lorepay_credits FROM users WHERE id=?', [req.user.id]);
  res.json(castU(rows[0]));
});

// ============================================================
// FAQ
// ============================================================

// GET /faq — public (no auth needed)
app.get('/faq', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM faq ORDER BY id');
  res.json(rows);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Honkai Star Retail API running on port ${PORT}`));