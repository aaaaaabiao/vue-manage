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
          <div class="forget-psw" @click="$router.push({name: 'ResetPsw'})">忘记密码？</div>
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
import { isvalidPhoneNumber, isvalidCode } from "@/assets/utils/validate";
export default {
  name: "Login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不少于6位"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        user: "",
        password: "",
      },
      loginByPswRules: {
        user: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      isOvertime: false,
      time: 60
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {};

          params = {
            username: this.loginForm.user,
            password: this.loginForm.password
          };
          this.$store
            .dispatch("Login", params)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/home" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "~@/styles/mixin";
@import "~@/styles/login";
</style>
