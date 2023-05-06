const { Key, Numeric } = require('@proton/js')

const assert = require('assert');

const ATOM_WASM_PATH = `${__dirname}/../../atom/atom.wasm`;
const ATOM_ABI_PATH = `${__dirname}/../../atom/atom.abi`;

async function wait (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

describe("Atom", function (eoslime) {
    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(15000);

    let atomContract;
    let tokensHolder;
    let pollsTable;

    before(async () => {
        let accounts = await eoslime.Account.createRandoms(2);
        tokensIssuer = accounts[0];
        tokensHolder = accounts[1];
    });

    beforeEach(async () => {
        atomContract = await eoslime.Contract.deploy(ATOM_WASM_PATH, ATOM_ABI_PATH);
        pollsTable = atomContract.tables.polls;
        votesTable = atomContract.tables.votes;
    });

    const createPollHelper = async () => {
        await atomContract.actions.createpoll([
            tokensHolder.name,
            [
                { value: "Donald Trump", subtitle: "(Republican)" },
                { value: "Joe Biden", subtitle: "(Democrat)" },
            ],
            1603980933,
            1604990000,
            "2020 US Elections"
        ], { from: tokensHolder })
    }

    const voteHelper = async (privateKey, publicKey) => {
        await atomContract.actions.vote([
            atomContract.name,
            0,
            "Donald Trump",
            publicKey.toString(),
            privateKey.sign('0' + ":" + "Donald Trump", true).toString()
        ], { from: atomContract.account })
    }

    it("Create a poll", async () => {
        await createPollHelper()
        const polls = await pollsTable.find()
        assert.deepEqual(polls, [{
            index: 0,
            creator: tokensHolder.name,
            choices: [
               { value: 'Donald Trump', votes: 0, subtitle: '(Republican)' },
               { value: 'Joe Biden', votes: 0, subtitle: '(Democrat)' }
            ],
            description: "2020 US Elections",
            starts_at: 1603980933,
            ends_at: 1604990000
        }])
    }); 

    it("Vote", async () => {
        await createPollHelper()
        const { privateKey, publicKey } = Key.generateKeyPair(Numeric.KeyType.k1, { secureEnv: true })
        await voteHelper(privateKey, publicKey)

        const polls = await pollsTable.find()
        assert.deepEqual(polls, [{
            index: 0,
            creator: tokensHolder.name,
            choices: [
                { value: 'Donald Trump', votes: 1, subtitle: '(Republican)' },
                { value: 'Joe Biden', votes: 0, subtitle: '(Democrat)' }
            ],
            description: "2020 US Elections",
            starts_at: 1603980933,
            ends_at: 1604990000
        }])

        const votes = await votesTable.scope('0').find()
        assert.deepEqual(votes, [{
            index: 0,
            choice: 'Donald Trump',
            key: publicKey.toLegacyString(),
            txid: votes[0].txid
        }])
    });

    it("Fail if voting twice", async () => {
        await createPollHelper()
        const { privateKey, publicKey } = Key.generateKeyPair(Numeric.KeyType.k1, { secureEnv: true })
        await voteHelper(privateKey, publicKey)
        await wait(1000)
        await voteHelper(privateKey, publicKey)
    }); 
});
