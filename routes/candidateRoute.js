const express = require('express');

const { AddCandidateController, UpdateCandidateController, DeleteCandidateController, ListofCandidateController } = require('../controller/candidateController');
const adminAuth = require('../middleware/adminMiddleware');
const router = express.Router();

// Add a candidate
router.post('/add',adminAuth, AddCandidateController)
router.put('/update/:id',adminAuth,UpdateCandidateController)
router.delete('/delete/:id',adminAuth,DeleteCandidateController)
router.get('/showall',ListofCandidateController)


module.exports = router