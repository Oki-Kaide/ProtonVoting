<template>
  <div class="state-3-title">
    PICK YOUR CANDIDATE
  </div>

  <div class="state-3-key-container">
    <div class="state-3-key-title">
      Choose One:
    </div>

    <div v-for="choice of choices" :key="choice.value">
      <div class="divider"/>
      <div class="choice">
        <input type="radio" :value="choice.value" v-model="selectedChoice" class="choice-radio">
        <span class="choice-title">{{ choice.value }}</span>
        <span class="choice-subtitle">{{ choice.subtitle }}</span>
      </div>
    </div>
  </div>

  <div
    class="state-3-next-button"
    :class="{
      disabled: !selectedChoice
    }"
    @click="submit"
  >
    SUBMIT
  </div>
</template>

<script>
// Test
export default {
  name: 'State3',
  props: ['choices'],

  data () {
    return {
      selectedChoice: undefined
    }
  },

  methods: {
    submit () {
      if (!this.selectedChoice) return

      this.$emit('next-step', this.selectedChoice)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.state-3-title {
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

.state-3-key-container {
  width: calc(100% - 64px);
  padding: 32px;
  margin-top: 48px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.state-3-key-title {
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

.divider {
  margin: 17px 0px;
  width: 100%;
  height: 1px;
  opacity: 0.56;
  background-color: #cbd3e6;
}

.choice {
  text-align: left;
  display: flex;
  align-items: center;
}

.choice-radio {
  width: 22px;
  height: 22px;
  border: solid 2px #888e9d;
  cursor: pointer;
}

.choice-title {
  padding-left: 20px;
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}

.choice-subtitle {
  padding-left: 8px;
  font-family: HelveticaNeue;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #a1a5b1;
}

.state-3-next-button {
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
