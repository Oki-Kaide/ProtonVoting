<template>
  <div class="state-container">
    <img src="@/assets/state-1-1.svg" v-if="state === 1" class="state" :class="{ cursor: state > 1 }" @click="goToStep(1)"/>
    <img src="@/assets/state-completed.svg" v-else class="state" :class="{ cursor: state > 1 }" @click="goToStep(1)"/>

    <img src="@/assets/state-connector-grey.svg" v-if="state === 1" class="state-connector"/>
    <img src="@/assets/state-connected.svg" v-else class="state-connector"/>

    <img src="@/assets/state-1-2.svg" v-if="state === 1" class="state" :class="{ cursor: state > 2 }" @click="goToStep(2)"/>
    <img src="@/assets/state-2-2.svg" v-else-if="state === 2" class="state" :class="{ cursor: state > 2 }" @click="goToStep(2)"/>
    <img src="@/assets/state-completed.svg" v-else-if="state === 3" class="state" :class="{ cursor: state > 2 }" @click="goToStep(2)"/>

    <img src="@/assets/state-connector-grey.svg" v-if="state === 1 || state === 2" class="state-connector"/>
    <img src="@/assets/state-connected.svg" v-else class="state-connector"/>

    <img src="@/assets/state-1-3.svg" v-if="state === 1 || state === 2" class="state"/>
    <img src="@/assets/state-3-3.svg" v-else class="state"/>
  </div>
</template>

<script>
export default {
  name: 'StateGuide',
  props: ['state'],
  methods: {
    goToStep (step) {
      if (step > this.state) return
      this.$emit('go-to-step', step)
    }
  }
}
</script>

<style scoped>
.cursor {
    cursor: pointer;
}

.state-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.state {
    width: 50px;
    height: 75px;
}

.state-connector {
    width: 48px;
    height: 6px;
    padding: 0px 24px;
}
</style>
