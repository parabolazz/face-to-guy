import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'
import { ProfileData, getUserProfile } from '../api/user'

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
    },
    async getUserProfile() {
        const myUserId = Taro.getStorageSync('USER_ID');
        const profile = await getUserProfile(myUserId);
        if (profile) {
          this.setUserProfile(profile.data);
        }
    }
  },
})