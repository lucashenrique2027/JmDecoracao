import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const hashed = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hashed });
    res.status(201).json({ msg: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro no cadastro', detalhes: err });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ erro: 'Senha inválida' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ msg: 'Login realizado', token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhes: err });
  }
};

export const protectedRoute = (req, res) => {
  res.json({ msg: 'Você acessou uma rota protegida!', userId: req.userId });
};
