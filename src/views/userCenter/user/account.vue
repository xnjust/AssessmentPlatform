<template>
	<el-container>
		<el-header>
			<div class="right-panel" v-if="source=='view'">
				<el-button type="primary" icon="el-icon-plus" @click="to_add()">新增员工账号</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="to_edit()">修改员工账号</el-button>
				<el-button type="danger" plain icon="el-icon-delete" @click="delete_worker()">删除选中账号</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='add'">
				<el-button type="success" icon="el-icon-plus" @click="add_worker()">新增员工账号</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看员工账号</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='edit' ">
				<el-button type="success" icon="el-icon-edit" @click="edit_worker()">修改员工账号</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看员工账号</el-button>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="list.apiObj" row-key="uuid" stripe v-if="source=='view'">
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="用户名" prop="worker_name" width="150"></el-table-column>
				<el-table-column label="账号" prop="worker_account" width="250"></el-table-column>
				<el-table-column label="本月进度" prop="progress" width="250" sortable>
					<template #default="scope">
						<el-progress :percentage="scope.row.progress" />
					</template>
				</el-table-column>
			</scTable>

			<el-card class="box-card" shadow="always" v-else-if="source=='add'">
				<div class="card-header">
					<el-form class="add_form" ref="add_form" :model="form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新账号信息</label>
						</div>
						<el-form-item prop="username">
							用户名<el-input v-model="form.username" prefix-icon="sc-icon-organization" clearable placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item prop="account">
							账号<el-input v-model="form.account" prefix-icon="el-icon-user" clearable placeholder="请输入账号"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							密码<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable placeholder="请输入密码"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</el-card>

			<el-card class="box-card" shadow="always" v-else-if="source=='edit'">
				<div class="card-header">
					<el-form class="edit_form" ref="edit_form" :model="form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新账号信息</label>
						</div>
						<el-form-item prop="username">
							用户名<el-input v-model="form.username" prefix-icon="sc-icon-organization" clearable placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item prop="account">
							账号<el-input v-model="form.account" prefix-icon="el-icon-user" clearable placeholder="请输入账号" disabled ></el-input>
						</el-form-item>
						<el-form-item prop="password">
							密码<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable placeholder="请输入密码"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		
		data() {
			return {
				list: {
					apiObj: this.$API.manager_apis.get_worker_list_by_page
				},
				source : "view",
				form: {
					account: "",
					password: "",
					username: ""
				},
				rules: {
					username: [
						{required: true, message: "用户名不可为空", trigger: 'blur'}
					],
					account: [
						{required: true, message: "账号不可为空", trigger: 'blur'}
					],
					password: [
						{required: true, message: "密码不可为空", trigger: 'blur'}
					]
				},
				worker_uuid:"",
			}
		},
		methods: {
			async delete_worker(){
				var rows = this.$refs.table.$refs.scTable.getSelectionRows()
				if(rows.length == 0){
					this.$refs.table.refresh()
					this.$message.error("请选择账号进行删除！")
					return
				}
				for(let i=0; i<rows.length;i++){
					var param = {
						worker_uuid: rows[i].uuid
					}
					var res = await this.$API.manager_apis.delete_worker.post(param)
					console.log(res)
				}
				this.$refs.table.refresh()
			},
			filterHandler(value, row, column){
				const property = column['property']
				return row[property] === value
			},
			to_view(){
				this.source = "view"
			},
			to_add(){
				this.source = "add"
			},
			to_edit(){
				var rows = this.$refs.table.$refs.scTable.getSelectionRows()
				if(rows.length == 0){
					this.$refs.table.refresh()
					this.$message.warning("请选择一个账号进行修改")
				}
				else if(rows.length != 1){
					this.$refs.table.refresh()
					this.$message.error("只可一个账号进行修改!")
				}
				else{
					this.form.account = rows[0].worker_account
					this.form.username = rows[0].worker_name
					this.worker_uuid = rows[0].uuid
					this.source = "edit"
				}
			},
			async add_worker(){
				var validate = await this.$refs.add_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					worker_name: this.form.username,
					worker_account: this.form.account,
					worker_password: this.form.password
				}
				var res = await this.$API.manager_apis.add_worker.post(param)
				if(res.status == 0){
					this.$message.success("添加账号成功")
				} else {
					this.$message.error("添加账号失败，请检查账号是否重复！")
				}
				this.form.username=""
				this.form.password=""
				this.form.account=""
				this.to_view()
			},
			async edit_worker(){
				var validate = await this.$refs.edit_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					worker_name: this.form.username,
					worker_password: this.form.password,
					worker_uuid: this.worker_uuid
				}
				var res = await this.$API.manager_apis.edit_worker.post(param)
				if(res.status == 0){
					this.$message.success("修改账号成功")
				} else {
					this.$message.error("修改账号失败")
				}
				this.form.username=""
				this.form.password=""
				this.form.account=""
				this.to_view()
			},
		}
	}
</script>

<style scoped>
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.add_form {
		width: 100%;
		display: block;
		justify-content: center;
		align-items: center;
	}

	.edit_form {
		width: 100%;
		display: block;
		justify-content: center;
		align-items: center;
	}

	.item {
		margin-bottom: 18px;
	}

	.box-card {
		width: 480px;
		margin: 20px;
	}
	.logo label {
		width: 100%;
		display: block;
		justify-content: center;
		align-items: center;
		font-size: 26px;
		font-weight: bold;
		margin: 18px;
	}
</style>
