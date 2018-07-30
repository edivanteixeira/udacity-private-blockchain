const Blockchain = require('./src/Blockchain.js')
const Block = require('./src/Block.js')
var sync = require('sync');


//Add blocks
sync(async function () {
    let blockchain = new Blockchain();
    for (var i = 0; i <= 10; i++) {
        var newBlock = await blockchain.addBlock(new Block("test data " + i));
        console.log('Block with hash #' + newBlock.hash + ' inserted');
    }
    await blockchain.validateChain();

    console.error("Starting to create errors");
    //Create Errors
    let inducedErrorBlocks = [2, 4, 7];
    for (var i = 0; i < inducedErrorBlocks.length; i++) {
        let block = await blockchain.getBlock(inducedErrorBlocks[i]);
        block.data = 'induced chain error';
        await blockchain.saveData(block);
    }
    await blockchain.validateChain();
});