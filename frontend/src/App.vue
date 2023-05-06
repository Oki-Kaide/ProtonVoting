<template>
  <template v-if="$route.path === '/'">
    <router-view/>
  </template>
  <template v-else>
    <div class="header">
      <img src="@/assets/voting-logo.svg" class="logo-img" @click="$router.push('/')"/>

      <img :src="userImage" class="user-img" @click="logout" v-if="actor"/>
      <div class="connect-wallet-button" @click="login" style="margin-left: auto;" v-else>
        LOGIN
      </div>
    </div>

    <div class="body"> 
      <div class="container">
        <router-view/>
      </div>
    </div>
  </template>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapState({
      actor: state => state.user.actor,
      avatar: state => state.user.avatar
    }),

    userImage () {
      if (this.avatar) {
        if (this.avatar.indexOf('/9j/') !== -1) {
          return `data:image/jpeg;base64,${this.avatar}`
        } else if (this.avatar.indexOf('iVBORw0KGgo') !== -1) {
          return `data:image/png;base64,${this.avatar}`
        }
      }

      return '/proton_avatar.png'
    }
  },

  methods: {
    ...mapActions({
      login: 'user/login',
      logout: 'user/logout'
    })
  }
}
</script>

<style>
.disabled {
  opacity: 0.4 !important;
  cursor: none !important;
}
</style>

<style scoped>
.header {
  height: 88px;
  background-color: #191b45;
  display: flex;
  align-items: center;
  padding: 0px 6vw;
}

.body {
  height: calc(100vh - 120px);
  padding-top: 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #eceff6;
}

.container {
  max-width: 500px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.logo-img {
  cursor: pointer;
  width: 109px;
  height: 35px;
  object-fit: contain;
}

.user-img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-left: auto;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 25px;
}
</style>