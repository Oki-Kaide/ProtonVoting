<template>
  <div class="state-2-title">
    SAVE YOUR VOTING KEYS
  </div>
  <div class="state-2-desc">
    We created a private and public key on your local device. Nobody has access to the private key except you.
  </div>

  <div class="state-2-key-container">
    <div class="state-2-key-title">
      Public Key
    </div>
    <div class="state-2-key-holder">
      {{ publicKey.toString() }}
    </div>

    <div class="state-2-key-title" style="margin-top: 15px;">
      Private Key
    </div>
    <div class="state-2-key-holder">
      {{ privateKey.toString() }}
    </div>

    <div class="state-2-email-button" @click="email">
      EMAIL TO YOURSELF
    </div>
  </div>

  <div class="state-2-next-button" @click="$emit('next-step')">
    NEXT
  </div>
</template>

<script>
export default {
  name: 'State2',
  props: ['publicKey', 'privateKey'],

  methods: {
    email () {
      window.open(
        'mailto:you@gmail.com?' +
        'subject=' + encodeURIComponent('Voting Keys for Election') +
        '&body=' + encodeURIComponent(
          `Public Key: ${this.publicKey}\r\n` +
          `Private Key: ${this.privateKey}`          
        )
      );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.state-2-title {
  padding-top: 32px;

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

.state-2-desc {
  padding-top: 16px;

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

.state-2-key-container {
  max-width: calc(100vw - 64px);
  width: calc(100% - 64px);
  padding: 32px;
  margin-top: 48px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.state-2-key-title {
  margin-bottom: 5px;
  text-align: left;
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}

.state-2-key-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  width: 100%;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  border: solid 1px #e2e3e9;

  font-family: HelveticaNeue;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #a1a5b1;
}

.state-2-email-button {
  cursor: pointer;
  margin-top: 40px;
  padding-top: 4px;
  padding-bottom: 4px;
  color: #3947a3;
  width: 100%;
  height: 32px;
  display: grid;
  align-items: center;
  justify-content: center;

  object-fit: contain;
  border-radius: 4px;
  border: solid 2px rgb(57,71,163,0.2);

  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: 0.88px;
  text-align: center;
}

.state-2-next-button {
  cursor: pointer;
  margin-top: 40px;

  width: 100%;
  height: 48px;
  background-color: #3947a3;
  color: white;
  opacity: 1;
  display: grid;
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
