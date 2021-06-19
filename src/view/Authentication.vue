<!--注册登录页-->
<template>
  <div class="main">
    <div id="header">
      <div id="title" style="font-size: xxx-large">IRBLAPP</div>
    </div>
    <div id="container">
      <a-form
          id="formLogin"
          ref="formLogin"
          :form="form"
          class="user-layout-login"
      >
        <a-tabs
            :activeKey="customActiveKey"
            :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
            @change="handleTabClick"
        >
          <a-tab-pane key="tab1" tab="登录账号">
            <a-form-item>
              <a-input
                  v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'blur'}
              ]"
                  placeholder="用户名"
                  size="large"
                  type="text"
              >
                <a-icon slot="prefix" :style="{ color: 'rgba(0,0,0,.25)' }" type="user"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-input
                  v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
                  autocomplete="false"
                  placeholder="密码"
                  size="large"
                  type="password"
              >
                <a-icon slot="prefix" :style="{ color: 'rgba(0,0,0,.25)' }" type="lock"/>
              </a-input>
            </a-form-item>
            <a-form-item style="margin-top:24px">
              <a-button
                  :loading="loginLoading"
                  class="login-button"
                  size="large"
                  type="primary"
                  @click="handleLogin()"
              >确定
              </a-button>
            </a-form-item>
          </a-tab-pane>

          <a-tab-pane key="tab2" tab="注册新账号">
            <a-form-item>
              <a-input
                  v-decorator="[
              'registerUsername',
              {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'blur'}]"
                  placeholder="用户名"
                  size="large">
                <a-icon slot="prefix" :style="{ color: 'rgba(0,0,0,.25)' }" type="user"/>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  v-decorator="[
                'registerPassword',
                {rules: [{ required: true, message: '请输入密码' }, { validator: this.handlePassword }], validateTrigger: 'blur'}]"
                  placeholder="密码"
                  size="large"
                  type="password">
                <a-icon slot="prefix" :style="{ color: 'rgba(0,0,0,.25)' }" type="lock"/>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  v-decorator="[
                'registerPasswordConfirm',
                {rules: [{ required: true, message: '请再次输入密码' }, { validator: this.handlePasswordCheck }], validateTrigger: 'blur'}]"
                  placeholder="确认密码"
                  size="large"
                  type="password">
                <a-icon slot="prefix" :style="{ color: 'rgba(0,0,0,.25)' }" type="lock"/>
              </a-input>
            </a-form-item>
            <a-form-item style="margin-top:24px">
              <a-button
                  :loading="registerLoading"
                  class="login-button"
                  size="large"
                  type="primary"
                  @click="handleRegister()"
              >确定
              </a-button>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Authentication",
  data() {
    return {
      form: this.$form.createForm(this),
      loginLoading: false,
      registerLoading: false,
      customActiveKey: 'tab1',
    }
  },
  methods: {
    handlePassword(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('密码长度至少6位'))
      }
      callback()
    },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('registerPassword')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
    },
    handleLogin() {
      const validateFieldsKey = this.customActiveKey === 'tab1' ? ['username', 'password'] : ['registerUsername', 'registerPassword', 'registerPasswordConfirm']
      this.form.validateFields(validateFieldsKey, {force: true}, async (err) => {
        if (!err) {
          this.loginLoading = true
          const data = {
            username: this.form.getFieldValue("username"),
            password: this.form.getFieldValue("password")
          }
          this.$http({
            method: 'post',
            url: 'signUp',
            params: data
          }).then(res => {
            console.log(res)
            if (res['content'] === 'success') {
              this.$notification.success({
                description: '欢迎使用IRBLAPP',
                message: '登录成功',
                duration: 2
              })
              this.$router.push({path: '/homepage'});
            } else {
              this.$notification.error({
                description: '用户名或密码错误',
                message: '登录失败',
                duration: 2
              })
              this.form.setFieldsValue({
                'username': '',
                'password': ''
              })
            }
          })
          this.loginLoading = false
        }
      })
    },

    handleRegister() {
      const {form: {validateFields}} = this
      const validateFieldsKey = this.customActiveKey === 'tab1' ? ['username', 'password'] : ['registerUsername', 'registerPassword', 'registerPasswordConfirm']
      validateFields(validateFieldsKey, {force: true}, async (err) => {
        if (!err) {
          this.registerLoading = true
          const data = {
            password: this.form.getFieldValue('registerPassword'),
            username: this.form.getFieldValue('registerUsername'),
          }
          this.$http({
            method: 'post',
            url: 'signIn',
            params: data
          }).then(res => {
            console.log(res)
            if (res['content'] === 'success') {
              this.$notification.success({
                description: '注册成功',
                message: '请输入用户名密码登录',
                duration: 2
              })
              this.customActiveKey = 'tab1'
              this.form.setFieldsValue({
                'registerPassword': '',
                'registerPasswordConfirm': '',
                'registerUsername': ''
              })
            } else {
              this.$notification.error({
                description: '用户已存在',
                message: '请换一个用户名',
                duration: 2
              })
              this.form.setFieldsValue({
                'registerPassword': '',
                'registerPasswordConfirm': '',
                'registerUsername': ''
              })
            }
          })
          this.registerLoading = false
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>

.main {
  min-width: 260px;
  width: 368px;
  margin: 100px auto;
}

.user-layout-login {

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>