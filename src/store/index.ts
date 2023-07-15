import { defineStore } from 'pinia'
import { ProfileData } from 'src/api/user'

interface State {
  showTabbar: boolean
  activeTabIndex: number
  userProfile?: ProfileData
}

export const useGlobalStore = defineStore('global', {
  state: (): State => {
    return { showTabbar: true, activeTabIndex: 0, userProfile: undefined }
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