const router = require('express').Router()
const user = require('../models/user')

/* Page d'accueil */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mon projet' })
})

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Connexion'})
})

router.post('/login', function(req, res, next) {
    if(req.body.username != '' && req.body.password != ''){
      user.login(req.body).then((isValid) => {
        if(isValid != ''){
          res.format({
            html: () => {
              res.cookie('accessToken', isValid)
              res.redirect('todos')
            },
            json: () => {
              res.send({
                accessToken: isValid,
              })
            }
          })
      }
      else {
        res.redirect('/login')
      }
    })
  }
})

router.get('/todos', (req, res, next) => {
  res.format({
    html: () => {
      res.render('todos', {
        user: {},
        action: '/todos'
      })
    },
    json: () => {
      let err = new Error('Bad Request')
      err.status = 400
      next(err)
    }
  })
})
module.exports = router
