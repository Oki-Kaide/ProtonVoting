<template>
  <div class="top-container">
    <div class="top-title">
      Current Results
    </div>

    <div class="divider"/>

    <div class="results-container">
      <template v-if="poll">
        <div v-for="(choice, index) of poll.choices" :key="choice.value" class="choice-title">
          <div style="display: flex;">
            <span class="vote-result-title">{{ choice.value }}</span>
            <span class="vote-result-counter">{{ choice.votes }} Votes</span>
          </div>
          <div style="display: flex; margin-top: 5px;">
            <div class="progress-bar">
              <span
                class="progress-bar-fill"
                :style="`
                  width: ${(choice.votes / totalVotes) * 100}%;
                  background-color: ${colors[index % 2]};
                `"
              />
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="loading" class="choice-title">
        Loading poll...
      </div>
      <div v-else class="choice-title">
        Poll with ID {{ id }} not found
      </div>
    </div>
  </div>

  <div
    class="bottom-container"
    :class="{
      'bottom-container-extension': publicKey
    }"
    v-if="poll || loading"
  >
    <template v-if="publicKey">
      <img src="@/assets/voting-2020-logohead.svg" class="voting-logo"/>
      <div class="bottom-title">
        YOU'VE VOTED
      </div>
      <div class="bottom-subtitle">
        Your vote has been registered under your public key. 
      </div>
      <div class="bottom-button" @click="seeVote">
        SEE VOTE
      </div>
    </template>
    <div v-else style="width: 100%; height: 100%; display: flex; justify-content: left; flex-direction: column;">
      <div class="top-title">
        Verify Vote
      </div>

      <div class="divider"/>

      <div class="results-container">
        <div class="public-key-title">Public Key</div>
        <div class="public-key-container">
          <input placeholder="Enter Public Key (PUB_K1...)" v-model="userEnteredPublicKey" class="public-key-input"/>
        </div>
        <div
          class="bottom-button"
          :class="{
            disabled: !userEnteredPublicKey
          }"
          @click="seeVote"
        >
          SEE VOTE
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchVoteByKey } from '../api/poll'
import { fetchPoll } from '../api/poll'
import { Key } from '@proton/js'

export default {
  name: 'Results',
  props: ['id', 'publicKey'],

  data () {
    return {
      poll: undefined,
      loading: true,
      colors: ['#f06464', '#618ce8'],
      userEnteredPublicKey: undefined
    }
  },

  computed: {
    totalVotes () {
      return this.poll.choices.reduce((acc, choice) => acc + choice.votes, 0)
    }
  },

  methods: {
    async seeVote () {
      const publicKey = Key.PublicKey.fromString(this.publicKey || this.userEnteredPublicKey)
      const vote = await fetchVoteByKey(publicKey, this.id)

      if (vote) {
        window.open(`https://proton.bloks.io/transaction/${vote.txid}`)
      } else {
        alert('No vote found with the provided public key')
      }
    }
  },

  async created () {
    console.log(this.publicKey)
    try {
      this.poll = await fetchPoll(this.id)
      console.log(this.poll)
    } catch (e) {
      console.log(e)
    }
    this.loading = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divider {
  height: 1px;
  opacity: 0.56;
  background-color: #cbd3e6;
}

.voting-logo {
  width: 120px;
  height: 122px;
  object-fit: none;
  border-radius: 60px;
  box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24), 0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
}

.top-container {
  max-width: calc(100vw - 64px);
  width: 500px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.bottom-container {
  max-width: calc(100vw - 64px);
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.bottom-container-extension {
  padding: 32px;
  box-sizing: border-box;
}

.bottom-title {
  padding-top: 33px;
  font-family: HelveticaNeue;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 1.6px;
  text-align: center;
  color: #0a1829;
}


.bottom-subtitle {
  padding-top: 20px;
  width: 328px;
  height: 48px;
  opacity: 0.4;
  font-family: BreeSerif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 1px;
  text-align: center;
  color: #191b45;
}

.bottom-button {
  cursor: pointer;
  margin-top: 30px;

  border-radius: 4px;
  width: 100%;
  height: 48px;
  background-color: #3947a3;
  color: white;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: 0.88px;
  text-align: center;
  color: #ffffff;
}

.top-title {
  padding: 15px 0px 17px 32px;
  text-align: left;
  font-family: HelveticaNeue;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #000000;
}

.results-container {
  padding: 0px 32px 32px 32px;
  background-color: #f7f9fd;
}

.choice-title {
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-top: 24px;
}

.vote-result-title {
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}

.vote-result-counter {
  margin-left: auto;
  font-family: HelveticaNeue;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: right;
  color: #a1a5b1;
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
}

.progress-bar-fill {
  display: block;
  height: 5px;
  border-radius: 3px;
  
  transition: width 500ms ease-in-out;
}

.public-key-title {
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}

.public-key-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;

  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  border: solid 1px #e2e3e9;
}

.public-key-input {
  width: 100%;
  border: none;
  padding-left: 10px;

  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #a1a5b1;
}
</style>
