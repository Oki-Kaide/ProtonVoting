<template>
  <StateGuide :state="step" @go-to-step="(oldStep) => step = oldStep"/>
  <State1 v-if="step === 1" @next-step="completedKyc"/>
  <State2 v-if="step === 2" @next-step="completedSavingKeys" :publicKey="publicKey" :privateKey="privateKey"/>
  <State3 v-if="step === 3" @next-step="submitChoice" :choices="poll.choices"/>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Key, Numeric } from '@proton/js'
import axios from 'axios'
import { fetchPoll } from '../api/poll'

import State1 from '@/components/State1'
import State2 from '@/components/State2'
import State3 from '@/components/State3'
import StateGuide from '@/components/StateGuide'

export default {
  name: 'Vote',

  props: ['id'],

  components: {
    State1,
    State2,
    State3,
    StateGuide
  },

  data () {
    return {
      step: 1,
      publicKey: undefined,
      privateKey: undefined,
      poll: undefined
    }
  },

  watch: {
    actor: {
      immediate: true,
      handler: function (newActor) {
        if (!newActor) {
          this.$router.push('/')
        }
      }
    }
  },

  computed: {
    ...mapState({
      actor: state => state.user.actor
    })
  },

  methods: {
    ...mapActions({
      transact: 'user/transact'
    }),

    completedKyc () {
      const { privateKey, publicKey } = Key.generateKeyPair(Numeric.KeyType.k1, { secureEnv: true })
      this.privateKey = privateKey
      this.publicKey = publicKey

      this.step = 2
    },

    completedSavingKeys () {
      this.step = 3
    },

    async submitChoice (selectedChoice) {
      const CONTRACT = 'protonvoting'
      const VOTE_ACTION = 'vote'

      const to_sign = `${this.id}:${selectedChoice}`

      const actions = [{
        account: CONTRACT,
        name: VOTE_ACTION,
        data: {
          relay: CONTRACT,
          poll_id: this.id,
          choice: selectedChoice,
          key: this.publicKey.toString(),
          signature: this.privateKey.sign(to_sign, true).toString()
        }
      }]

      const result = await this.transact({ actions, broadcast: false })
      const { signatures, signer, transaction } = result

      try {
        const res = await axios.post('https://www.api.bloks.io/proton-voting/vote', { signatures, signer, transaction })
        if (res.data.success) {
          this.poll = await fetchPoll()
          this.$router.push({
            name: `Results`,
            params: {
              id: this.id,
              publicKey: this.publicKey.toString()
            }
          })
        } else {
          const assertError = res.data.error && res.data.error.json && res.data.error.json.error.details[0].message.replace('assertion failure with message: ', '')
          alert(assertError || res.data.error)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },

  async created () {
    this.poll = await fetchPoll(this.id)
  }
}
</script>
