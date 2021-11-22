const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Registrasi_Login_Biasa = require('../models/Biasa/loginRegisBiasa');

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check empty body request
  if (email === '' || password === '') {
    res.render('../views/Warga/loginBiasa.ejs', {
      message: 'All field cannot be empty!',
    });
    res.status(400);
    return res;
  }

  console.log(email);
  console.log(password);

  // Check email exist
  const cekDB = await Registrasi_Login_Biasa.findOne({ email });
  if (!cekDB) {
    res.render('../views/Warga/loginBiasa.ejs', {
      message: 'Email doesnt exist!',
    });
    res.status(400);
    return res;
  }

  // Check password match
  const isMatch = await bcrypt.compare(password, cekDB.password);
  if (!isMatch) {
    res.render('../views/Warga/loginBiasa.ejs', {
      message: 'Password didnt match!',
    });
    res.status(400);
    return res;
  }

  // Generate token
  const authTokens = {};
  const token = jwt.sign({ id: cekDB._id }, process.env.SECRET_KEY);
  authTokens[token] = cekDB;
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000,
  });

  // Redirect
  res.redirect('/home_biasa');
  return res.status(200);
};

module.exports = login;