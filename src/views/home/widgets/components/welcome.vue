<template>
	<el-card shadow="hover" :header="'欢迎'+username">
		<div class="welcome">
			<div class="logo">
				<img src="img/logo.png">
				<h2>欢迎使用 外卖员工考核系统</h2>
			</div>
			<div class="tips">
				<div class="tips-item">
					<div class="tips-item-icon"><el-icon><el-icon-menu/></el-icon></div>
					<div class="tips-item-message">这里是系统控制台，你可以点击左边菜单，选择需要使用的功能。</div>
				</div>
				<div class="tips-item">
					<div class="tips-item-icon"><el-icon><el-icon-promotion/></el-icon></div>
					<div v-if="role=='admin'" class="tips-item-message">控制台可以管理员工账号、门店信息以及门店KPI。</div>
					<div v-else class="tips-item-message">控制台可以查看门店信息以及门店KPI。</div>
				</div>
				<div class="tips-item">
					<div class="tips-item-icon"><el-icon><el-icon-milk-tea/></el-icon></div>
					<div v-if="role=='admin'" class="tips-item-message">项目目的：让外卖员工考核更加便捷</div>
					<div v-else class="tips-item-message">项目目的：让外卖员工考核更加便捷</div>
				</div>
			</div>
		</div>
	</el-card>
</template>

<script>
	export default {
		title: "欢迎",
		icon: "el-icon-present",
		data() {
			return {
				username: this.$TOOL.data.get("USER_INFO").userName
			}
		},
		computed:{
			role(){
				return this.$TOOL.data.get("USER_INFO").role[0]
			}
		},
		methods: {
		}
	}
</script>

<style scoped>
	.welcome {}
	.welcome .logo {text-align: center;}
	.welcome .logo img {vertical-align: bottom;width: 100px;height: 100px;margin-bottom: 20px;}
	.welcome .logo h2 {font-size: 30px;font-weight: normal;display: flex;align-items: center;justify-content: center;}

	.tips {margin-top: 20px;padding:0 40px;}
	.tips-item {display: flex;align-items: center;justify-content: center;padding:7.5px 0;}
	.tips-item-icon {width: 40px;height:40px;display: flex;align-items: center;justify-content: center;border-radius: 50%;font-size: 18px;margin-right: 20px;color: var(--el-color-primary);background: rgba(180,180,180,0.1);}
	.tips-item-message {flex: 1;font-size: 14px;}

	.actions {text-align: center;margin: 40px 0 20px 0;}
</style>
