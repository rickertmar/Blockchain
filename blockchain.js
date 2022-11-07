class Block {
    constructor(index, timestemp, data, previousHash = '') {
        this.index = index;
        this.timestemp = timestemp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestemp + JSON.stringify(this.data)).toString();
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
    }

    createGenisisBlock() {
        return new Block(0, "07.11.2022", "Genisis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = newBlock.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}