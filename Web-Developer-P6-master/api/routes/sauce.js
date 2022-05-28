const express = require('express')
const router = express.Router()

const sauceCtrl = require('../controller/sauce')

router.post('/api/sauce', sauceCtrl.createSauce);

router.put('/api/sauce/:id', sauceCtrl.modifySauce);

router.delete('/api/sauce/:id', sauceCtrl.deleteSauce);

router.get('/api/sauce/:id', sauceCtrl.getOneSauce);

router.get('/api/sauce/', sauceCtrl.getAllSauce);