const { Api, JsonRpc, JsSignatureProvider, Key } = require('@proton/js')
const fetch = require('node-fetch')
const { CHAIN_ID, CONTRACT, VOTE_ACTION, RELAYER_ACTOR, RELAYER_PERMISSION, ENDPOINT } = require('./constants')
const { ec } = require('elliptic')
const fs = require('fs').promises;

if (!process.env.PRIVATE_KEY) throw new Error('No PRIVATE_KEY provided in .env file')
const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY]);
const rpc = new JsonRpc(ENDPOINT, { fetch: fetch })
const api = new Api({ rpc, signatureProvider })

const digestFromSerializedData = (
    chainId,
    serializedTransaction,
    serializedContextFreeData,
    e = new ec('secp256k1')
) => {
    const signBuf = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(serializedTransaction),
        Buffer.from(
            serializedContextFreeData
                ? new Uint8Array(e.hash().update(serializedContextFreeData).digest()) 
                : new Uint8Array(32)
        ),
    ]);
    return e.hash().update(signBuf).digest();
};

const getAccountKeys = async (actor, permission) => {
    try {
        const { permissions } = await rpc.get_account(actor)
        const relevantPermission = permissions.find(({ perm_name }) => perm_name === permission)
        if (relevantPermission) {
            return relevantPermission.required_auth.keys.map(({ key }) => Key.PublicKey.fromString(key).toString())
        }
    } catch (e) {
        console.log(e)
    }

    return []
}

const checkIfKeysMatchTransaction = async ({
    actor,
    permission,
    transaction,
    signatures
}) => {
    const keys = await getAccountKeys(actor, permission)
    transaction.context_free_actions = await api.serializeActions(transaction.context_free_actions || []),
    transaction.actions = await api.serializeActions(transaction.actions)
    const serializedTransaction = api.serializeTransaction(transaction);
    const serializedContextFreeData = api.serializeContextFreeData(transaction.context_free_data);

    const digest = digestFromSerializedData(CHAIN_ID, serializedTransaction, serializedContextFreeData)
    const verified = Key.Signature.fromString(signatures[0]).verify(digest, Key.PublicKey.fromString(keys[0]), false)
    return verified
}

const checkIfPreviouslyVoted = async (accountName, pollId) => {
    const key = pollId + ":" + accountName
    const savedUsers = await fs.readFile('list.json')
    const parsedSavedUsers = JSON.parse(savedUsers)
    return parsedSavedUsers[key]
}

const addToVotedList = async (accountName, pollId) => {
    const key = pollId + ":" + accountName
    const savedUsers = await fs.readFile('list.json')
    const parsedSavedUsers = JSON.parse(savedUsers)
    parsedSavedUsers[key] = true
    await fs.writeFile('list.json', JSON.stringify(parsedSavedUsers, null, 4))
}

const pushVoteTransaction = async (voteTransaction) => {
    const transaction = {
        actions: [{
            account: CONTRACT,
            name: VOTE_ACTION,
            data: voteTransaction.actions[0].data,
            authorization: [{ actor: RELAYER_ACTOR, permission: RELAYER_PERMISSION }]
        }]
    }
    return api.transact(transaction, {
        useLastIrreversible: true,
        expireSeconds: 300
    })
}

module.exports = {
    checkIfKeysMatchTransaction,
    checkIfPreviouslyVoted,
    addToVotedList,
    pushVoteTransaction
}