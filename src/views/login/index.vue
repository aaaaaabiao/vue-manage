/* 登录 */
<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginByPswRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title">欢迎登录后台管理系统</div>
      <el-card shadow="hover" class="login-card">
        <template>
          <el-form-item prop="user" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="account" />
            </span>
            <el-input
              v-model="loginForm.user"
              autocomplete="on"
              name="user"
              type="text"
              placeholder="请输入用户名"
              style="padding-left: 45px"
            />
          </el-form-item>
          <el-form-item prop="password" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.password"
              autocomplete="on"
              show-password
              name="password"
              placeholder="请输入密码"
              style="padding-left: 45px"
              @paste.native.capture.prevent="() => {return}"
              @copy.native.capture.prevent="() => {return}"
              @cut.native.capture.prevent="() => {return}"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item label="" prop="roleId">
            <el-select v-model="loginForm.roleId" placeholder="角色" clearable size="mid">
              <el-option
                v-for="role in roleDict"
                :key="role.value"
                :label="role.label"
                :value="role.value"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >登 录</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      roleDict: this.COMMON.roleDict,
      loginForm: {
        user: '',
        password: '',
        roleId: undefined
      },
      loginByPswRules: {
        user: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        roleId: [{ required: true, trigger: 'blur', message: '请选择角色' }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      isOvertime: false,
      time: 60
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {}

          params = {
            username: this.loginForm.user,
            password: this.loginForm.password,
            roleId: this.loginForm.roleId
          }
          this.$store
            .dispatch('Login', params)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/home' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "~@/styles/mixin";
@import "~@/styles/login";
</style>
