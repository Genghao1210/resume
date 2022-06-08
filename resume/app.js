var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mysql = require('mysql')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '001210',
  database: 'resume'
})
app.post('/create', (req, res) => {
  const user = req.body.user
  const desc = req.body.desc
  const imag = req.body.image
  const info = req.body.info
  const education = req.body.education
  const experience = req.body.experience
  const skill = req.body.skill
  db.query('INSERT INTO mytable (`user`,`desc`,image,info,education,experience,skill) VALUES(?,?,?,?,?,?,?)',
    [user, desc, imag, info, education, experience, skill],
    (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send("Values inserted")
      }
    })
})

app.get('/items', (req, res) => {
  db.query("SELECT * FROM  mytable", (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.send(result)
    }
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
