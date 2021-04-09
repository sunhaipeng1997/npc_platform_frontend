import API from '@/assets/http/apiUrl'
import Request from '@/assets/http'

const user = {
  state: {
    token: '',
    name: '',
    roles: ''
  },
  mutations: {
    SET_TOKEN: (state, data) => {
      state.token = data;
    },
    SET_USER_INFO: (state, data) => {
      state.name = data.name || '';
      state.roles = data.roles || [];
    }
  },
  actions: {
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        Request.httpRequest({
          method: 'post',
          url: API.Login,
          // noLoading: true,
          params: params,
          success: data => {
            localStorage.setItem('TOKEN', data.token);
            localStorage.setItem('unit_name', data.unitName);
            var userInfo = {name:data.username,roles:data.roles};
            commit('SET_USER_INFO', userInfo);
            resolve(data)
          },
          error: (data, err) => {
            reject(err);
            if (data) {
              this.$message({
                type: 'warning',
                message: '登录失败!' + data.get("message")
              });
            }
          }
        })
      })
    },

    LoginByVin({ dispatch, commit }, params) {
      return dispatch('Login', params)
    },

    ResetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', {})
        localStorage.removeItem('TOKEN')
        resolve()
      })
    },

    // ??
    LogOut({ dispatch, commit }) {
      return dispatch('ResetToken')
    }
  }
}

export default user

