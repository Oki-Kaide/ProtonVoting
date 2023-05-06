require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const { CONTRACT, VOTE_ACTION } = require('./constants')
const { checkIfKeysMatchTransaction, checkIfPreviouslyVoted, pushVoteTransaction, addToVotedList } = require('./proton')

const router = express.Router();
const app = express();

// Cors
app.use(cors())

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/vote', async (request, response, next) => {
    if (
        !request || !request.body || 
        !request.body.signatures || !request.body.signatures.length || 
        !request.body.signer || !request.body.signer.actor || !request.body.signer.permission ||
        !request.body.transaction
    ) {
        return next('Invalid Body');
    }

    const { signatures, signer: { actor, permission }, transaction } = request.body
    const relevantAction = transaction.actions.find(action => action.account === CONTRACT && action.name === VOTE_ACTION)
    if (
        !relevantAction || !relevantAction.authorization || !relevantAction.authorization.length ||
        relevantAction.authorization[0].actor !== actor || relevantAction.authorization[0].permission !== permission
    ) {
        return response.send({ success: false, error: 'Invalid Authorization' })
    }
    const pollId = relevantAction.data.poll_id
    if (!pollId) {
        return response.send({ success: false, error: 'Invalid Poll ID' })
    }
    
    const transactionCopy = JSON.parse(JSON.stringify(transaction))
    const verified = await checkIfKeysMatchTransaction({ actor, permission, transaction, signatures })
    if (!verified) {
        return response.send({ success: false, error: 'Your signature does not match the signer information provided.' })
    }

    if (await checkIfPreviouslyVoted(actor, pollId)) {
        return response.send({ success: false, error: 'You have already voted on this poll in the past!' })
    }

    try {
        const res = await pushVoteTransaction(transactionCopy)
        if (!res) {
            return response.send({ success: false, error: 'Your vote was unsuccessful. Please try again later.' })
        }

        await addToVotedList(actor, pollId)

        return response.send({ success: true })
    } catch (e) {
        return response.send({ success: false, error: e })
    }
});

// add router in the Express app.
app.use("/", router);

app.listen(process.env.PORT)
console.log(`Running Vote Server on Port ${process.env.PORT}`)