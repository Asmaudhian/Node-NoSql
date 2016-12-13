const mongoose = require('mongoose')
var Schema = mongoose.Schema

// On crée un schéma pour les todo
var todoSchema = new Schema({
  desc: String,
  for: String,
  state: Boolean,
  created_at: Date,
  updated_at: {type: Date, default: '0'} ,
  teamId: { type: String, default: '0'}
});

// On récupère le schéma défini au dessus
var Todo = mongoose.model('Todo', todoSchema);

module.exports = {
  // On récupère une tache via son ID
  get: (taskId) => {
    return Todo.find({_id:taskId}).exec()
  },

  // On récupère toutes les taches dans la collection
  getAll: () => {
      return Todo.find().exec()
  },

  // On crée une nouvelle tache
  insert: (params) => {
    var newTodo = Todo({
      desc: params.desc,
      for: params.for,
      state: params.state,
      teamId: params.teamId,
      createdAt: Date.now()
    });

    // On sauvegarde la nouvelle tache
    return newTodo.save();
  },

  // On met à jour une tache
  update: (taskId, params) => {

    Todo.update({_id:taskId}, {
          desc: params.desc,
          for: params.for,
          state: params.state,
          teamId: params.teamId,
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

  // On supprime une tache
  remove: (taskId) => {
     return Todo.findOneAndRemove({_id:taskId}, function(error){
       if(error){
         let err = new Error('Bad request')
         err.status = 400
         return Promise.reject(err)
       }
     })
  }
}
