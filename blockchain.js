const SHA256 = require('crypto-js/sha256');


/* 
Block-Objekt mit folgenden Eigenschaften:
(Position eines Blocks erkannbar an Position im Array)
- Timestemp/Zeitstempel: Block-Erstellung/Transaktionszeitpunkt
- Transaction/Transaktion: Inhalt der Transaktion; Krypto-Betrag und Empfänger
- PreHash: Hash des vorherigen Blocks
- Hash: Hash des altuellen Blocks
*/
class Block {
    constructor(timestemp, transaction, preHash = '') {
        this.timestemp = timestemp;
        this.transaction = transaction;
        this.preHash = preHash;
        this.hash = '';
        this.nonce = 0;
        // "Nonce" = "number used once"; gibt vor, das der Hash-Wert mit einer bestimmten Anzahl von Nullen beginnt -> Difficulty
    }

    // Hash mit SHA256-Funktion kalkulieren (mit importierter Libary: crypto-js)
    calcHash() {
        return SHA256(this.preHash + this.timestemp + JSON.stringify(this.transaction) + this.nonce).toString();
    }

    mine(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calcHash();
        }
        console.log("Gemineter Block: " + this.hash);
    }

}



// Blockchain Objekt
class Blockchain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
        this.difficulty = 2;
    }

    // Genisis-Block erstellen
    createGenisisBlock() {
        //const heute = new Date();
        const utc = new Date().toUTCString();
        let today = utc;
        return new Block(today, "Genisis-Block", "0");
    }

    // Den letzten Block der Blockchain zurückgeben (um ihn mit einem neuen Block verketten zu können)
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Einen neuen Block zu der Blockchain hinzufügen
    addBlock(newBlock) {
        newBlock.preHash = this.getLatestBlock().hash;
        newBlock.mine(this.difficulty);
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
test.addBlock(new Block("18/11/2022", { amount: 20 }));
test.addBlock(new Block("19/11/2022", { amount: 13 }));

console.log(JSON.stringify(test, null, 4));

/* console.log("Block 1 minen...");
test.addBlock(new Block("18/11/2022", { amount: 20 }));

test.chain[1].transaction = { amount: 1000 }; // Versuch einen bestehenden Block zu verändern
test.chain[1].hash = test.chain[1].calcHash(); // Versuch den veränderten Block mit einem neuen (zur Änderung passenden) Hash "zu tarnen"
console.log("Ist die Blockchain valide? " + test.isChainValid()); // Output: false
console.log("Block 2 minen...");
test.addBlock(new Block("19/11/2022", { amount: 13 }));
 */

// Anzeige in HTML
const recipient = document.getElementById('recipient');
const amount = document.getElementById('amount');
const sentbtn = document.getElementById('sentbtn');

sentbtn.onclick = function () {
    const pRecipient = recipient.value;
    const pAmount = amount.value;

    if (pRecipient && pAmount) {
        let testchain = new Blockchain();
        testchain.addBlock(new Block(today, { amount: pAmount, recipient: pRecipient }));
    }
}

for (let i = 0; i < testchain.length; i++) {
    const outTransaction = testchain[i].transaction;

    modellOutput.innerHTML += `<div class="block"><h3>Transaktions-Details:</h3><br />${outTransaction}</div>`;
}