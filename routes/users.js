const router = require('express').Router()
const User = require('../models/user')

// Page d'acceuil des users'
router.get('/', (req, res, next) => {

  User.getAll().then((results) => {
    res.format({
      html: () => {
        res.render('users/index', {
          users: results,
          count: results.length,
        })
      },
      json: () => {
        res.send({
          data: results,
          meta: {
            count: results.length
          }
        })
      }
    })
  }).catch(next)
})

// On édite un user
router.get('/:userId/edit', (req, res, next) => {
  res.format({
    html: () => {
      User.get(req.params.userId).then((user) => {
        if (!user) return next()
        res.render('users/edit', {
          user: user[0],
          action: `/users/${user[0]._id}?_method=put`
        })
      }).catch(next)
    },
    json: () => {
      let err = new Error('Bad Request')
      err.status = 400
      next(err)
    }
  })
})

// Page d'ajout d'un user
router.get('/add', (req, res, next) => {
  res.format({
    html: () => {
      res.render('users/edit', {
        user: {},
        action: '/users'
      })
    },
    json: () => {
      let err = new Error('Bad Request')
      err.status = 400
      next(err)
    }
  })
})

// Page de sélection d'un user'
router.get('/:userId', (req, res, next) => {
  User.get(req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => { res.render('users/show', { user: user[0] }) },
      json: () => { res.send({ data: user[0] }) }
    })
  }).catch(next)
})

// Ajout d'un user'
router.post('/', (req, res, next) => {
  if (
    !req.body.username || req.body.username === '' ||
    !req.body.mail || req.body.mail === '' ||
    !req.body.name || req.body.name === '' ||
    !req.body.password || req.body.name === ''
  ) {
    let err = new Error('Bad Request')
    err.status = 400
    return next(err)
  }

// On redirige après l'ajout d'un user
  User.insert(req.body).then(() => {
    res.format({
      html: () => {
        res.redirect('/users')
      },
      json: () => {
        res.status(201).send({ message: 'success' })
      }
    })
  }).catch(next)
})

// On supprime un user
router.delete('/:userId', (req, res, next) => {
  User.remove(req.params.userId).then(() => {
    res.format({
      html: () => { res.redirect('/users') },
      json: () => { res.send({ message: 'success' }) }
    })
  }).catch(next)
})

// On redirige après avoir édité un user
router.put('/:userId', (req, res, next) => {
  User.update(req.params.userId, req.body)
  res.format({
    html: () => { res.redirect('/users') },
    json: () => { res.send({ message: 'success' }) }
  })
})

module.exports = router
