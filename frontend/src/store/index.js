import { createStore } from 'vuex'
import user from './modules/user'

export const store = createStore({
    modules: {
        user
    }
})