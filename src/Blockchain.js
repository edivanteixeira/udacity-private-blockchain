const Block = require('./Block.js')
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
const SHA256 = require('crypto-js/sha256');

module.exports = class BlockChain {

    constructor() {

    }
    async addBlock(newBlock) {
        let currentHeight = await this.getBlockHeight();
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (currentHeight > 0) {
            let previousBlock = await this.getBlock(currentHeight);
            newBlock.previousBlockHash = previousBlock.hash;
            currentHeight++;
        } else {
            currentHeight = 1;
        }

        newBlock.height = currentHeight;
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        // Adding block object to chain
        return await this.saveData(newBlock);
    }
    
    async saveData(newBlock){
        await db.put(newBlock.height, JSON.stringify(newBlock));
        return newBlock;
    }

    async getBlockHeight() {
        return new Promise((resolve, reject) => {
            let i = 0;
            db.createReadStream().on('data', function (data) {
                i++;
            }).on('error', function (err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function () {
                resolve(i);
            });
        })
    }



    async getBlock(blockHeight) {
        var blockJson = await db.get(blockHeight);
        return JSON.parse(blockJson);
    }


    validateBlock(block) {
        // get block hash
        let blockHash = block.hash;
        let blockToCheck = Object.assign({}, block);

        // remove block hash to test block integrity
        blockToCheck.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(blockToCheck)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('Block #' + block.height + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    async validateBlockByHeight(blockHeight) {
        // get block object
        let block = await this.getBlock(blockHeight);
        return this.validateBlock(block);
    }



    async validateChain() {
        let errorLog = [];
        let maxtHeight = (await this.getBlockHeight() - 1);

        for (var i = 0; i < maxtHeight; i++) {

            let currentBlock = await this.getBlock(i + 1);
            let nextBlock = await this.getBlock(i + 2);
            let valid = this.validateBlock(currentBlock);

            if (!valid) errorLog.push(i + 1);


            // compare blocks hash link
            let blockHash = currentBlock.hash;
            let previousHash = nextBlock.previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i + 1);
            }
        }
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
        } else {
            console.log('No errors detected');
        }
    }

}