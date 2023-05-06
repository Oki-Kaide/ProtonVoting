<template>
  <div class="state-1-title">
    SUBMIT A VALID PHOTO ID
  </div>
  <div class="state-1-desc">
    For this demo, we have already uploaded a sample ID. We did this so you could see the flow.
  </div>

  <div class="state-1-photo-container">
    <div class="state-1-photo-title">Photo ID</div>
    <img src="@/assets/license.png" class="state-1-photo-img"/>
  </div>

  <div class="state-1-button" @click="$emit('next-step')">
    NEXT
  </div>
</template>

<script>
export default {
  name: 'State1',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.state-1-title {
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

.state-1-desc {
  padding-top: 16px;
  max-width: 400px;
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

.state-1-photo-container {
  width: 100%;
  margin-top: 48px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.state-1-photo-title {
  padding-left: 32px;
  padding-top: 15px;
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

.state-1-photo-img {
  width: 339px;
  height: 230px;
  padding: 15px 0px;
}

.state-1-button {
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
