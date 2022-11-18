const SHA256 = require('crypto-js/sha256');


/* 
Block-Objekt mit folgenden Eigenschaften:
- Index: hier um die Position des Blocks in der Blockchain darzustellen
- Timestemp/Zeitstempel: Block-Erstellung/Transaktionszeitpunkt
- Transaction/Transaktion: Inhalt der Transaktion; Krypto-Betrag und Empfänger
- PreHash: Hash des vorherigen Blocks
- Hash: Hash des altuellen Blocks
*/
class Block {
    constructor(index, timestemp, transaction, preHash = '') {
        this.index = index;
        this.timestemp = timestemp;
        this.transaction = transaction;
        this.preHash = preHash;
        this.hash = '';
    }

    // Hash mit SHA256-Funktion kalkulieren (mit importierter Libary: crypto-js)
    calcHash() {
        return SHA256(this.index + this.preHash + this.timestemp + JSON.stringify(this.transaction)).toString();
    }

}

// Blockchain Objekt
class Blockchain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
    }

    // Genisis-Block erstellen
    createGenisisBlock() {
        const heute = new Date();
        const utc = new Date().toUTCString();
        let today = utc;
        return new Block(0, today, "Genisis-Block", "0");
    }

    // Den letzten Block der Blockchain zurückgeben (um ihn mit einem neuen Block verketten zu können)
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Einen neuen Block zu der Blockchain hinzufügen
    addBlock(newBlock) {
        newBlock.preHash = newBlock.getLatestBlock().hash;
        newBlock.hash = newBlock.calcHash();
        this.chain.push(newBlock);
    }

    /* 
    Sobald Blöcke zu der Blockchain hinzugefügt worden sind,
    sind diese nicht mehr änderbar
    --> Integrität der Blockchain verifizieren
    */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]; // letzter Block der Blockchain
            const preBlock = this.chain[i - 1]; // vorletzter Block der Blockchain

            // Prüfen, ob Hash des altuellen Blocks ungleich einem, für diesen Block neu berechneten Hash ist
            // Wenn dies der Fall ist, ist die Blockchain nicht valide
            if (currentBlock.hash !== currentBlock.calcHash()) {
                return false;
            }

            // Prüfen, ob der Hash des vorherigen Blocks im aktuellen Block nicht als Referenz gespeichert ist
            // Wenn dies der Fall ist, ist die Blockchain nicht valide
            if (currentBlock.preHash !== preBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let test = new Blockchain();
test.addBlock(new Block("1", "18/11/2022", { amount: 20 }));
test.addBlock(new Block("2", "19/11/2022", { amount: 13 }));

console.log("Ist die Blockchain valide? " + test.isChainValid()); // Output: true

test.chain[1].data = { amount: 1000 }; // Versuch einen bestehenden Block zu verändern
test.chain[1].hash = test.chain[1].calcHash(); // Versuch den veränderten Block mit einem neuen (zur Änderung passenden) Hash "zu tarnen"
console.log("Ist die Blockchain valide? " + test.isChainValid()); // Output: false


