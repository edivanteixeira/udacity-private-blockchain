const Block = require('./Block.js')
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
const SHA256 = require('crypto-js/sha256');

module.exports = class BlockChain {

    constructor() {
        (async () => {
            this.currentHeight = (await this.getBlockHeight()) - 1;
            if (this.currentHeight == -1)
                this.addBlock(new Block("First block in the chain - Genesis block :)"));
        }).bind(this)();
    }

    async addBlock(newBlock) {
        //this.currentHeight = await this.getBlockHeight();
        this.currentHeight++;
        newBlock.height = this.currentHeight;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (this.currentHeight > 0) {
            let previousBlock = await this.getBlock(this.currentHeight - 1);
            newBlock.previousBlockHash = previousBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        return await this.saveData(newBlock);
    }

    async saveData(newBlock) {
        await db.put(newBlock.height, JSON.stringify(newBlock));
        return newBlock;
    }

    async getBlockHeight() {
        return new Promise((resolve, reject) => {
            let i = 0;
            db.createReadStream().on('data', function (data) {
                i++;
            }).on('error', function (err) {
                reject();
                console.log('Unable to read data stream!', err)

            }).on('close', function () {
                resolve(i);
            });
        })
    }



    async getBlock(blockHeight) {

        const block = new Promise((resolve, reject) =>
            db.get(blockHeight, function (err, value) {
                if (err) return console.log('Not found!', err);
                resolve(JSON.parse(value))
            })
        )
        return await block;
    }


    async validateBlock(blockHeight) {

        let block = await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;
        let blockToCheck = Object.assign({}, block);
        // remove block hash to test block integrity
        blockToCheck.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(blockToCheck)).toString();
        // Compare
        return (blockHash === validBlockHash);
    }




    async validateChain() {
        let errorLog = [];

        //get current height
        let height = await this.getBlockHeight();

        for (var i = 0; i < height; i++) {
            //Check if current block is valid
            var isValid = await this.validateBlock(i);
            if (!isValid) {
                errorLog.push(i);
            }
            if (i < (height - 1)) {
                let currentBlock = await this.getBlock(i);
                let nextBlock = await this.getBlock(i + 1);

                if (nextBlock.previousBlockHash !== currentBlock.hash)
                    errorLog.push(i);
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