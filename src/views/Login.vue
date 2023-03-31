<template>
  <div class="page_root">
    <div class="particles-js">
      <div class="animated bounceInDown">
        <div class="container">
          <span class="error animated tada" id="msg"></span>
          <form name="form1" class="box">
            <h4>Android设备</h4>
            <h5>管理平台</h5>
            <input
              v-model="username"
              type="text"
              name="email"
              placeholder="Email"
              autocomplete="off"
            />
            <i
              class="typcn typcn-eye"
              id="eye"
              @click="isShowPwd = !isShowPwd"
            ></i>
            <input
              v-model="password"
              :type="isShowPwd ? 'text' : 'password'"
              name="password"
              placeholder="Passsword"
              id="pwd"
              autocomplete="off"
            />
            <div type="submit" class="btn1" @click="onSubmit">登录</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
import cryptoJs from 'crypto-js'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  components: {},

  data () {
    return {
      isShowPwd: false,
      username: '',
      password: ''
    }
  },

  methods: {
    async onSubmit () {
      const pwd = cryptoJs.MD5(this.password)
      const res = await login({
        username: this.username,
        password: pwd.toString()
      })

      if (res.status) {
        ElMessage({
          message: '登陆成功',
          type: 'success'
        })
        this.$router.push({
          path: '/home',
          query: {
            username: this.username
          }
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
/* CSS Libraries Used

*Animate.css by Daniel Eden.
*FontAwesome 4.7.0
*Typicons

*/

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400');

.page_root {
  font-family: 'Source Sans Pro', sans-serif;
  background-color: #1d243d;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
}

.container {
  margin: 0;
  top: 50px;
  left: 50%;
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  background-color: rgb(33, 41, 66);
  border-radius: 9px;
  border-top: 10px solid #79a6fe;
  border-bottom: 10px solid #8bd17c;
  width: 400px;
  height: 500px;
  box-shadow: 1px 1px 108.8px 19.2px rgb(25, 31, 53);
}

.box h4 {
  font-family: 'Source Sans Pro', sans-serif;
  color: #5c6bc0;
  font-size: 18px;
  margin-top: 94px;
}

.box h4 span {
  color: #dfdeee;
  font-weight: lighter;
}

.box h5 {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 13px;
  color: #a1a4ad;
  letter-spacing: 1.5px;
  margin-top: -15px;
  margin-bottom: 70px;
}

.box input[type='text'],
.box input[type='password'] {
  display: block;
  margin: 20px auto;
  background: #262e49;
  border: 0;
  border-radius: 5px;
  padding: 14px 10px;
  width: 320px;
  outline: none;
  color: #d6d6d6;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  -ms-transition: all 0.2s ease-out;
  -o-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}
::-webkit-input-placeholder {
  color: #565f79;
}

.box input[type='text']:focus,
.box input[type='password']:focus {
  border: 1px solid #79a6fe;
}

a {
  color: #5c7fda;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

label input[type='checkbox'] {
  display: none; /* hide the default checkbox */
}

/* style the artificial checkbox */
label span {
  height: 13px;
  width: 13px;
  border: 2px solid #464d64;
  border-radius: 2px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  float: left;
  left: 7.5%;
}

.btn1 {
  border: 0;
  background: #7f5feb;
  color: #dfdeee;
  border-radius: 100px;
  width: 340px;
  height: 49px;
  font-size: 16px;
  position: absolute;
  top: 79%;
  left: 8%;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn1:hover {
  background: #5d33e6;
}

.typcn {
  position: absolute;
  left: 330px;
  top: 282px;
  color: #3b476b;
  font-size: 22px;
  cursor: pointer;
}

.typcn.active {
  color: #7f60eb;
}

.error {
  background: #ff3333;
  text-align: center;
  width: 337px;
  height: 20px;
  padding: 2px;
  border: 0;
  border-radius: 5px;
  margin: 10px auto 10px;
  position: absolute;
  top: 31%;
  left: 7.2%;
  color: white;
  display: none;
}
</style>
