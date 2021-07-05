import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: "",
    userInfo:{
      id:"",
      fullname: "",
      photo:"",
    },
    userInfo1:{
      id:"",
      fullName: "",
      birthday: "",
      imageURL:"",
      phonenumber:""
    },

  },
  getters: {
    getFullname: state => {
      return state.userInfo.fullname
    },
    getUserInfo:state=>{
      return state.userInfo;
    },
    getId: state => {
      return state.userInfo.email
    },
    getAvatarUrl: state => {
      return state.userInfo.photo
    },
    getFullname1: state => {
      return state.userInfo1.fullName
    },
    getUserInfo1:state=>{
      return state.userInfo1;
    },
    getId1: state => {
      return state.userInfo1.id
    },
    getBirthday1: state => {
      return state.userInfo1.birthday
    },
    getAvatarUrl1: state => {
      return state.userInfo1.imageURL
    },
    getPhoneNumber: state => {
      return state.userInfo1.phonenumber
    },
    getIdToken1: state => {
      return state.idToken
    }
  }, 
  mutations: {
    setUserInfo(state,payload){
      state.userInfo=payload;
    },
    setUserInfo1(state,payload){
      state.userInfo1=payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
