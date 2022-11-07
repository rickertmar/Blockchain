class Block {
    constructor(index, timestemp, transaction, preHash = '') {
        this.index = index;
        this.timestemp = timestemp;
        this.transaction = transaction;
        this.preHash = preHash;
        this.hash = '';
    }

    calcHash() {
        return SHA256(this.index + this.preHash + this.timestemp + JSON.stringify(this.transaction)).toString();
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
    }

    createGenisisBlock() {
        return new Block(0, "07.11.2022", "Genisis-Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.preHash = newBlock.getLatestBlock().hash;
        newBlock.hash = newBlock.calcHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const preBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calcHash()) {
                return false;
            }

            if (currentBlock.preHash !== preBlock.hash) {
                return false;
            }
        }
        return true;
    }

}