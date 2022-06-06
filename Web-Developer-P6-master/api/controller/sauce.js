
const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked:[],
      usersDisliked: [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce)
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce =>  res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
      console.log(sauce)
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}))
}

exports.likeSauce = (req, res, next ) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (req.body.like == 1) {
        sauce.likes +=1
        sauce.usersLiked.push(req.body.userId)
      } else if (req.body.like == 0) {
          if (sauce.usersLiked.indexOf(req.body.userId) > -1) {
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId))
            sauce.likes -= 1
          }
          if (sauce.usersDisliked.indexOf(req.body.userId) > -1) {
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId))
            sauce.dislikes -= 1
          }
        }
        else {
          sauce.dislikes +=1
          sauce.usersDisliked.push(req.body.userId)
        }
      sauce.save()
      console.log(req.body.like)
      console.log(sauce)
      res.status(200).json(sauce)
      
    })
    .catch(error => res.status(400).json({ error }));
}