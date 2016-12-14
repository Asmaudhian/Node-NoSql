const router = require('express').Router()
const Todo = require('../models/todos')

// Page des todos
router.get('/', (req, res, next) => {
  Todo.getAll().then((results) => {
    res.format({
      html: () => {
        res.render('todos/todos', {
          todos: results,
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

// Page d'ajout des todos'
router.get('/add', (req, res, next) => {
  res.format({
    html: () => {
      res.render('todos/edit', {
        task: {},
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

// Page lorsqu'on selectionne une todo
router.get('/:taskId', (req, res, next) => {
  Todo.get(req.params.taskId).then((task) => {
    if (!task) return next()

    res.format({
      html: () => { res.render('todos/show', { task: task[0] }) },
      json: () => { res.send({ data: user[0] }) }
    })
  }).catch(next)
})

// Redirection de la page d'ajout vers la liste des todos'
router.post('/', (req, res, next) => {
  Todo.insert(req.body).then(() => {
    res.format({
      html: () => {
        res.redirect('/todos')
      },
      json: () => {
        res.status(201).send({ message: 'success' })
      }
    })
  }).catch(next)
})

// On édite une todos
router.get('/:taskId/edit', (req, res, next) => {
  res.format({
    html: () => {
      Todo.get(req.params.taskId).then((task) => {
        if (!task) return next()
        res.render('todos/edit', {
          task: task[0],
          action: `/todos/${task[0]._id}?_method=put`
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

// On supprime une todo
router.delete('/:taskId', (req, res, next) => {
  Todo.remove(req.params.taskId).then(() => {
    res.format({
      html: () => { res.redirect('/todos') },
      json: () => { res.send({ message: 'success' }) }
    })
  }).catch(next)
})

// Redirection de la page d'édition vers la page de todos'
router.put('/:taskId', (req, res, next) => {
  Todo.update(req.params.taskId, req.body)
  res.format({
    html: () => { res.redirect('/todos') },
    json: () => { res.send({ message: 'success' }) }
  })
})

module.exports = router
