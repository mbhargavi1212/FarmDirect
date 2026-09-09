import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = Number(process.env.API_PORT || 4000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmdirect';
const jwtSecret = process.env.JWT_SECRET || 'farmdirect-development-secret';

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
  profile: { type: Schema.Types.Mixed, default: {} },
  walletBalance: { type: Number, default: 0 },
}, { timestamps: true });
const productSchema = new Schema({
  farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });
const orderSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });
const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

const signToken = (user: any) => jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '7d' });
const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    req.auth = jwt.verify(token, jwtSecret);
    req.user = await User.findById(req.auth.id).lean();
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'farmdirect-api', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: signToken(user), user: { ...user.toObject(), passwordHash: undefined } });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, role = 'buyer', ...profile } = req.body;
    const user = await User.create({ email, displayName, role, profile, walletBalance: role === 'buyer' ? 50000 : 0, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: signToken(user), user: { ...user.toObject(), passwordHash: undefined } });
  } catch (error: any) { res.status(400).json({ message: error.code === 11000 ? 'Email already registered' : error.message }); }
});

app.get('/api/auth/me', auth, (req: any, res) => res.json({ ...req.user, passwordHash: undefined }));
app.patch('/api/auth/me', auth, async (req: any, res) => {
  const { displayName, walletBalance, ...profile } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { displayName, profile, ...(walletBalance !== undefined ? { walletBalance } : {}) }, { new: true }).lean();
  res.json({ ...user, passwordHash: undefined });
});

app.get('/api/products', async (_req, res) => res.json(await Product.find().lean()));
app.post('/api/products', auth, async (req: any, res) => res.status(201).json(await Product.create({ farmerId: req.user._id, data: req.body })));
app.patch('/api/products/:id', auth, async (req, res) => res.json(await Product.findByIdAndUpdate(req.params.id, { data: req.body }, { new: true }).lean()));
app.delete('/api/products/:id', auth, async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.status(204).end(); });

app.get('/api/orders', auth, async (req: any, res) => res.json(await Order.find({ $or: [{ buyerId: req.user._id }, { farmerId: req.user._id }] }).lean()));
app.post('/api/orders', auth, async (req: any, res) => {
  const { farmerId, totalAmount, items, ...data } = req.body;
  const order = await Order.create({ buyerId: req.user._id, farmerId, data: { ...data, items, totalAmount } });
  await User.findByIdAndUpdate(farmerId, { $inc: { walletBalance: Number(totalAmount || 0) - Number(data.transportationFee || 0) } });
  await Transaction.create({ userId: req.user._id, data: { type: 'purchase', orderId: order._id, amount: totalAmount, status: 'successful' } });
  res.status(201).json(order);
});

app.get('/api/transactions', auth, async (req: any, res) => res.json(await Transaction.find({ userId: req.user._id }).lean()));
app.post('/api/transactions/withdraw', auth, async (req: any, res) => {
  const amount = Number(req.body.amount || 0);
  if (amount <= 0 || amount > Number(req.user.walletBalance || 0)) return res.status(400).json({ message: 'Insufficient balance' });
  const user = await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: -amount } }, { new: true }).lean();
  const transaction = await Transaction.create({ userId: req.user._id, data: { type: 'withdrawal', amount, status: 'successful' } });
  res.json({ user: { ...user, passwordHash: undefined }, transaction });
});

mongoose.connect(mongoUri).then(() => app.listen(port, () => console.log(`FarmDirect API running on http://localhost:${port}`))).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
