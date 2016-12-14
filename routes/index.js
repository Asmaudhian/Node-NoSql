const router = require('express').Router()
const user = require('../models/user')

// Page d'acceuil'
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Mon projet NodeJs - NoSql' })
})

// Page de login
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Connexion' })
})

// Si l'identifiant et le mot de passe sont bon, redirige vers la page d'acceuil
router.post('/login', function (req, res, next) {
    if (req.body.username != '' && req.body.password != '') {
        user.login(req.body).then((isValid) => {
            if (isValid != '') {
                res.format({
                    html: () => {
                        res.cookie('accessToken', isValid)
                        res.redirect('/')
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


module.exports = router
