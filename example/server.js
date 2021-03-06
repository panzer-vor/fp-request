const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false,
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: 'hello'
  })
})

router.get('/error/get', function(req, res) {
  res.json({
    msg: 'hello'
  })
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: 'hello'
    })
  }, 4000)
})

router.post('/config/post', function(req, res) {
  res.json(req)
})

router.get('/cancel/get', function(req, res) {
  setTimeout(() => {
    res.json('hello')
  }, 1000)
})

router.post('/cancel/post', function(req, res) {
  setTimeout(() => {
    res.json(req.body)
  }, 1000)
})

app.use(router)

const port = process.env.PORT || 8080

module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})