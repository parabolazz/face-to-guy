import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return { showTabbar: true }
  },
  actions: {
    toggleTabbar(flag) {
      this.showTabbar = flag
    },
  },
})