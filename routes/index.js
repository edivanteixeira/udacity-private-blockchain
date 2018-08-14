var express = require('express');
var router = express.Router();
var Block = require('../Modules/Blockchain/Block.js')
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { check, validationResult } = require('express-validator/check');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/api-docs')
});

router.post('/block/', [
  // body must be not empty
  body('body').not().isEmpty().trim().escape()
], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  Promise.resolve()
    .then(() => {
      if (req.body.body)
        return blockchain.addBlock(new Block(req.body.body))
    })
    .then((block) => {
      return res.json(block)
    })
});

router.get('/block/:blockHeight', (req, res, next) => {
  Promise.resolve()
    .then(() => blockchain.getBlock(req.params.blockHeight))
    .then((block) => {
      return res.json(block)
    })
    .catch(error => errorResult(res, error))
})

module.exports = router;