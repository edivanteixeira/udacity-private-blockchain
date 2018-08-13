var express = require('express');
var router = express.Router();
var Block = require('../Modules/Blockchain/Block.js')
/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/api-docs')
});

router.post('/block/', (req, res, next) => {
  Promise.resolve()
    .then(() =>
      blockchain.addBlock(new Block(req.body.body))
    )
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