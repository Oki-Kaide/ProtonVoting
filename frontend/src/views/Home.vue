<template>
<div class="background">
  <img
    alt="White House"
    src="@/assets/shutterstock_113019124.jpg"
    class="white-house-img"
  />

  <div class="body">
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <div class="logo-line-left"/>
      <img src="@/assets/star.png" style="z-index: 3; width: 28px; height: 28px;"/>
      <img src="@/assets/homepage-logo.png" style="z-index: 3; width: 80px; height: 80px; padding: 0 16px;"/>
      <img src="@/assets/star.png" style="z-index: 3; width: 28px; height: 28px;"/>
      <div class="logo-line-right"/>
    </div>
    <div class="title">
      BLOCKCHAIN VOTING DEMO ON PROTON
    </div>

    <div class="sub-title">
      Secure. Private. Verifiable.
    </div>

    <div class="button-container">
      <div class="connect-wallet-button" @click="vote">
        VOTE NOW
      </div>
      <div class="see-results-button" @click="seeResults">
        SEE RESULTS
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const DEFAULT_POLL_ID = 0

export default {
  name: 'Home',

  computed: {
    ...mapState({
      actor: state => state.user.actor
    })
  },

  methods: {
    ...mapActions({
      login: 'user/login'
    }),

    async vote () {
      await this.login()
      if (this.actor) {
        this.$router.push(`/vote/${DEFAULT_POLL_ID}`)
      }
    },

    seeResults () {
      this.$router.push(`/results/${DEFAULT_POLL_ID}`)
    }
  }
}
</script>

<style>
.connect-wallet-button {
  cursor: pointer;
  z-index: 2;
  width: 40vw;
  min-width: 150px;
  max-width: 203px;
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
</style>

<style scoped>
.button-container {
  display: flex;
}

.see-results-button {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  cursor: pointer;
  width: 40vw;
  min-width: 150px;
  max-width: 203px;
  height: 44px;
  border-radius: 2px;
  border: solid 2px #3947a3;

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

.background {
  background-image: radial-gradient(circle at 50% 51%, #262969, #191b45 86%);
  width: 100vw;
  height: 100vh;
}

.white-house-img {
  height: 100%;
  width: 100%;
  opacity: 0.2;
  mix-blend-mode: overlay;
  position: absolute;
  left: 0;
}

.title {
  z-index: 2;

  font-family: HelveticaNeue;
  font-size: 40px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 2px;
  text-align: center;
  color: #ffffff;
  max-width: 550px;
}

.sub-title {
  z-index: 2;
  padding-top: 16px;
  margin-bottom: 46px;

  font-family: BreeSerif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
}

.body {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo-line-left {
  z-index: 3;
  max-width: 150px;
  width: 15vw;
  height: 4px;
  background-color: #3947a3;
  margin-right: 16px;
}

.logo-line-right {
  z-index: 3;
  max-width: 150px;
  width: 15vw;
  height: 4px;
  background-color: #3947a3;
  margin-left: 16px;
}
</style>