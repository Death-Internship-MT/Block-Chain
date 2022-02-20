const hash = require('crypto-js/sha256');

class Block {
    constructor(prevHash, data) {
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.calculatorHash();
        this.mineCount = 0;
    }
    calculatorHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.prevHash + this.mineCount).toString();
    }
    mine(code, difficulty) {
        while (!this.hash.startsWith(code.repeat(difficulty))) {
            this.mineCount++;
            this.hash = this.calculatorHash();
        }
    }
}
class BlockChain {
    constructor(code, difficulty) {
        const genesisBlock = new Block(code.repeat(difficulty), { isGenesis: true })
        this.code = code;
        this.difficulty = difficulty;
        this.chain = [genesisBlock];
    }
    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }
    addBock(data) {
        const lastBlock = this.getLastBlock();
        const newBlock = new Block(lastBlock.hash, data);
        console.log('Start mine ...');
        console.time('mine');
        newBlock.mine(this.code, this.difficulty);
        console.timeEnd('mine')
        console.log('Finish mine', newBlock);
        this.chain.push(newBlock);
    }
    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if (currentBlock.hash.indexOf(this.code.repeat(this.difficulty)) === -1 || currentBlock.hash !== currentBlock.calculatorHash() || currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
//-------------- hacked block
class hackBlock {
    constructor(blockchain) {
        this.block = blockchain.chain;
        this.code = blockchain.code;
        this.difficulty = blockchain.difficulty;
        const genesisBlock = new Block(this.code.repeat(this.difficulty), { isHacked: true })
        this.chain = [genesisBlock];
    }
    changeBlock(index, data) {
        const thisBlock = new Block(this.block[index - 1].hash, data);
        thisBlock.mine(this.code, this.difficulty);
        this.block[index].data = data;
        this.block[index].hash = this.block[index].calculatorHash();
        this.chain.push(thisBlock);
        this.refreshBlock(index);
    }
    refreshBlock(index) {
        for (let i = index + 1, j = 1; i < this.block.length; i++) {
            let nextBlock = new Block(this.chain[j].hash, this.block[i].data)
            nextBlock.mine(this.code, this.difficulty);
            this.chain.push(nextBlock);
            j++;
        }
        while (this.block.length > index) {
            this.block.pop();
        }
        for (let i = 1; i < this.chain.length; i++) {
            this.block.push(this.chain[i]);
        }
    }
}
//--------------
const code = '60205',
    difficulty = 2
const block = new BlockChain(code, difficulty);
const hack = new hackBlock(block, code, difficulty);
console.log(block);
block.addBock({
    form: 'Shinigami',
    to: 'Death Intership',
    account: 1000
})
block.addBock({
        messages: 'Kill all',
        isSend: true,
        isRep: false
    })
    // console.log('check', block.isValid());
block.addBock({
    result: "Failed"
})
console.log('--------- before hack or change bock ---------');
hack.changeBlock(1, {
    form: 'Shinobi',
    to: 'Killer',
    time: Date.now()
});
console.log(block.chain);
console.log('check Valid', block.isValid(''));
console.log('--------- after hack or change bock ---------');
