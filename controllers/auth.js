const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authController = require('express').Router()

const User = require('../models/user')
const verifyToken = require('../middlewares/verifyToken')
const secret = process.env.JWT_SECRET

authController.post('/register', async (req, res) => {
  try {
    const isExisting = await User.findOne({ email: req.body.email })

    if (isExisting) {
      console.log("Email already registered")
      return res.status(500).json({ msg: 'Email is already registered' })
    }
    const isExistingUsername = await User.findOne({ username: req.body.username })

    if (isExistingUsername) {
      console.log("username already registered")
      return res.status(500).json({ msg: 'username is already registered' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = await User.create({ ...req.body, password: hashedPassword })

    const { password, ...others } = newUser._doc

    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '4h' })

    return res.status(201).json({ user: others, token })
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

authController.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      console.log('wrong credentials. Try again')
      return res.status(500).json('wrong credentials. Try again')
    }

    const comparePass = await bcrypt.compare(req.body.password, user.password)
    if (!comparePass) {
      console.log('wrong credentials. Try again')
      return res.status(500).json('wrong credentials. Try again')
    }

    const { password, ...others } = user._doc
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '4h' })


    return res.status(200).json({ user: others, token })
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = authController