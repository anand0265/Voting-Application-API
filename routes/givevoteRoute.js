const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { GiveVoteController, votecountController } = require('../controller/GiveVoteController');

const router = express.Router();

// Sign up
router.post('/:candidateId',authMiddleware,GiveVoteController)
router.get('/count',votecountController)

module.exports = router