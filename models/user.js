const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('../models/session')
var Schema = mongoose.Schema;

// On crée un schéma pour les users
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true},
  mail: { type: String, required: true},
  created_at: Date,
  updated_at: {type: Date, default: '0'} ,
  teamId: { type: String, default: '0'}
});

// On récupère le schéma défini au dessus
var User = mongoose.model('User', userSchema);

// On hash le mot de passe
function encryptPassword(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

module.exports = {
  // On récupère un utilisateur via son ID
  get: (userId) => {
    return User.find({_id:userId}).exec()
  },

  // On récupère tous les utilisateurs dans la collection
  getAll: () => {
      return User.find().exec()
  },

  // On crée un nouvel utilisateur
  insert: (params) => {
    var newUser = User({
      name: params.name,
      username: params.username,
      mail: params.mail,
      password: encryptPassword(params.password),
      createdAt: Date.now(),
    });

    // On sauvegarde le nouvel utilisateur
    return newUser.save();
  },

  // On met à jour un utilisateur
  update: (userId, params) => {

    User.update({_id:userId}, {
          name: params.name,
          username: params.username,
          mail: params.mail,
          updatedAt: Date.now()
        }, function(error, rowAffected){
      console.log(rowAffected)
      if (rowAffected.nModified) {
        let err = new Error('Not Found')
        err.status = 404
        return Promise.reject(err)
      }
    })
  },

  // On supprime un utilisateur
  remove: (userId) => {
     return User.findOneAndRemove({_id:userId}, function(error){
       if(error){
         let err = new Error('Bad request')
         err.status = 400
         return Promise.reject(err)
       }
     })
  },

  // On se connecte
  login: (params) => {
    hash = encryptPassword(params.password)
  return User.find({username: params.username}).exec(function(err, user) {

        if (user[0] !== undefined) {
            bcrypt.compare(params.password, user[0]['password'], function(err, res) {
              if(res)
              {
                require('crypto').randomBytes(48, function(err, buffer){
                  if(!err)
                  {
                    let token = buffer.toString('hex')
                    session.insert(user[0]['_id'], token)
                    return token
                  }
                })
              }
            })
        }
    })
  }

}
