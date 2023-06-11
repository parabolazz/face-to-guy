import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return { showTabbar: true, activeTabIndex: 0, userProfile: null }
  },
  actions: {
    toggleTabbar(flag) {
      this.showTabbar = flag
    },
    setActiveTabIndex(index) {
      this.activeTabIndex = index
    },
    setUserProfile(data) {
      this.userProfile = data
    }
  },
})