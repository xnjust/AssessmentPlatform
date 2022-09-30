<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large">
		<el-form-item prop="user">
			<el-input v-model="form.account" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
				<template #append>
					<el-select v-model="userType" style="width: 130px;">
						<el-option :label="$t('login.admin')" value="admin"></el-option>
						<el-option :label="$t('login.user')" value="user"></el-option>
					</el-select>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px;">
				<el-col :span="12">
					<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
				</el-col>
				<el-col :span="12" class="login-forgot">
					<el-button @click="forget_pwd_function" type="primary" text>{{ $t('login.forgetPassword') }}？</el-button>
				</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn') }}</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import {ElMessage} from 'element-plus'
	export default {
		data() {
			return {
				userType: 'admin',
				form: {
					account: "admin",
					password: "admin",
					autologin: false
				},
				rules: {
					account: [
						{required: true, message: this.$t('login.userError'), trigger: 'blur'}
					],
					password: [
						{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
					]
				},
				islogin: false,
			}
		},
		watch:{
			userType(val){
				if(val == 'admin'){
					this.form.user = 'admin'
					this.form.password = 'admin'
				}else if(val == 'user'){
					this.form.user = 'user'
					this.form.password = 'user'
				}
			}
		},
		mounted() {

		},
		methods: {
			async login(){

				var validate = await this.$refs.loginForm.validate().catch(()=>{})
				if(!validate){ return false }

				this.islogin = true
				var data = {
					account: this.form.account,
					password: this.form.password
				}
				//获取token
				
				var res = null
				if(this.userType == 'admin'){
					res = await this.$API.auth.token_manager.post(data)
				}
				else {
					data.password = this.form.password
					res = await this.$API.auth.token_worker.post(data)
				}
				var myuserinfo = null
				if(res.status == 0){
					if(this.userType == 'admin'){
						this.$TOOL.cookie.set("TOKEN", res.uuid, {
							expires: this.form.autologin? 24*60*60 : 0
						})
						myuserinfo = {
							userId: res.uuid, 
							userName: res.username, 
							dashboard: '0', 
							role: ["admin"]
						}
						this.$TOOL.data.set("USER_INFO", myuserinfo)
					}
					else{
						this.$TOOL.cookie.set("TOKEN", res.uuid, {
							expires: this.form.autologin? 24*60*60 : 0
						})
						myuserinfo = {
							userId: res.uuid, 
							userName: res.username, 
							dashboard: '1', 
							role: ["worker"]
						}
						this.$TOOL.data.set("USER_INFO", myuserinfo)
					}
					
				}
				else{
					this.islogin = false
					this.$message.warning(res.msg)
					return false
				}
				
				var menu = null
				var permissions = null
				if(this.userType == 'admin'){
					menu = [
						{
							name: 'home', 
							path: '/home', 
							meta: {
								title: '首页', 
								icon: 'el-icon-eleme-filled', 
								type: 'menu'
							}, 
							children: [
								{
									name: 'dashboard', 
									path: '/dashboard', 
									meta: {title: '控制台', icon: 'el-icon-menu', affix: true}, 
									component: 'home'
								},
								{
									name: 'userCenter', 
									path: '/usercenter', 
									meta: {title: '帐号信息', icon: 'el-icon-user'}, 
									component: 'userCenter'
								}
							]
						},
						{
							name: 'data_show', 
							path: '/data_show/goto', 
							meta: {
								title: '数据展示', 
								icon: 'el-icon-eleme-filled', 
								type: 'menu'
							}, 
							component: 'data_show/goto'
						},
					]
					// var permissions = ['list.add', 'list.edit', 'list.delete', 'user.add', 'user.edit', 'user.delete']
					permissions = []
					this.$TOOL.data.set("MENU", menu)
					this.$TOOL.data.set("PERMISSIONS", permissions)
				}
				else {
					menu = [
						{
							name: 'home', 
							path: '/home', 
							meta: {
								title: '首页', 
								icon: 'el-icon-eleme-filled', 
								type: 'menu'
							}, 
							children: [
								{
									name: 'dashboard', 
									path: '/dashboard', 
									meta: {title: '控制台', icon: 'el-icon-menu', affix: true}, 
									component: 'home'
								},
								{
									name: 'workerCenter', 
									path: '/workercenter', 
									meta: {title: '帐号信息', icon: 'el-icon-user'}, 
									component: 'workerCenter'
								}
							]
						},
						{
							name: 'data_show', 
							path: '/data_show/goto', 
							meta: {
								title: '数据展示', 
								icon: 'el-icon-eleme-filled', 
								type: 'menu'
							}, 
							component: 'data_show/goto'
						},
					]
					// var permissions = ['list.add', 'list.edit', 'list.delete', 'user.add', 'user.edit', 'user.delete']
					permissions = []
					this.$TOOL.data.set("MENU", menu)
					this.$TOOL.data.set("PERMISSIONS", permissions)
					console.log(menu)
				}
				

				this.$router.replace({
					path: '/'
				})
				this.$message.success("Login Success 登录成功")
				this.islogin = false
			},

			forget_pwd_function(){
				if(this.userType == 'admin'){
					ElMessage.error('管理员账号不支持自行修改！请联系开发人员支持！')
				}
				else {
					ElMessage.error('请联系管理员进行修改！')
				}
			},
		}
	}
</script>

<style>
</style>
