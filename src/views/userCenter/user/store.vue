<template>
	<el-container>
		<el-header>
			<div class="right-panel" v-if="source=='view'">
				<el-button type="primary" icon="el-icon-plus" @click="to_add_meituan()">新增美团门店</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="to_add_eleme()">新增饿了么门店</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="to_edit()">修改门店信息</el-button>
				<el-button type="danger" plain icon="el-icon-delete" @click="delete_store()">删除选中门店</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='meituan'">
				<el-button type="success" icon="el-icon-plus" @click="add_store_meituan()">新增美团门店</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看门店信息</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='eleme'">
				<el-button type="success" icon="el-icon-plus" @click="add_store_eleme()">新增饿了么门店</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看门店信息</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='edit' ">
				<el-button type="success" icon="el-icon-edit" @click="edit_store()">修改门店信息</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看门店信息</el-button>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="list.apiObj" row-key="uuid" stripe v-if="source=='view'">
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="门店名称" prop="store_name" width="150"></el-table-column>
				<el-table-column label="门店备注" prop="store_remarks" width="150"></el-table-column>
				<el-table-column label="门店类型" prop="store_class" width="100"></el-table-column>
				<el-table-column label="门店责任人" prop="store_belong" width="250"></el-table-column>
                <el-table-column label="昨日评分" prop="store_grade_yestoday" width="250" sortable></el-table-column>
                <el-table-column label="今日评分" prop="store_grade_today" width="250" sortable></el-table-column>
			</scTable>

			<el-card class="box-card" shadow="always" v-else-if="source=='meituan'">
				<div class="card-header">
					<el-form class="add_form" ref="add_form" :model="cookies_form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新的美团门店信息</label>
						</div>
						<el-form-item prop="cookies">
							cookies<el-input v-model="cookies_form.cookies" prefix-icon="sc-icon-organization" clearable placeholder="请输入cookies"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</el-card>

			<el-card class="box-card" shadow="always" v-else-if="source=='eleme'">
				<div class="card-header">
					<el-form class="add_form" ref="add_form" :model="cookies_form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新的饿了么门店信息</label>
						</div>
						<el-form-item prop="cookies">
							cookies<el-input v-model="cookies_form.cookies" prefix-icon="sc-icon-organization" clearable placeholder="请输入cookies"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</el-card>

			<el-card class="box-card" shadow="always" v-else-if="source=='edit'">
				<div class="card-header">
					<el-form class="edit_form" ref="edit_form" :model="form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新的门店信息</label>
						</div>
						<el-form-item prop="store_name">
							门店名称<el-input v-model="form.store_name" prefix-icon="sc-icon-organization" clearable placeholder="请输入门店名称" disabled></el-input>
						</el-form-item>
						<el-form-item prop="store_remarks">
							门店备注<el-input v-model="form.store_remarks" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
                        <div>门店责任人
                            <sc-table-select v-model="form.belong_name" :apiObj="list.get_user_list" :table-width="600" :props="props" @change="change">
                                <el-table-column prop="uuid" label="ID" width="180"></el-table-column>
                                <el-table-column prop="worker_name" label="用户名"></el-table-column>
                            </sc-table-select>
                        </div>
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
					apiObj: this.$API.manager_apis.get_store_list_by_page,
                    get_user_list: this.$API.manager_apis.get_worker_list_by_page,
				},
				source : "view",
				form: {
                    store_uuid: "",
					store_name: "",
					store_remarks: "",
					store_wmPoiId: "",
                    belong:{
                        belong_uuid:"",
                        belong_name:"",
                    }
				},
				cookies_form: {
					cookies: "",
				},
				rules: {
					store_name: [
						{required: true, message: "门店名称不可为空", trigger: 'blur'}
					],
					store_remarks: [
						{required: true, message: "门店备注不可为空", trigger: 'blur'}
					],
					cookies: [
						{required: true, message: "cookies不可为空", trigger: 'blur'}
					]
				},
				worker_uuid:"",
                props: {
					label: 'worker_name',
					value: 'uuid',
					keyword: "",
				},
			}
		},
		methods: {
            change(val){
                this.props.value = val.uuid
                this.props.label = val.worker_name
                this.form.belong.belong_name = val.worker_name
                this.form.belong.belong_uuid = val.uuid
                console.log(this.props)
			},
			async delete_store(){
				var rows = this.$refs.table.$refs.scTable.getSelectionRows()
				if(rows.length == 0){
					this.$refs.table.refresh()
					this.$message.error("请选择门店进行删除！")
					return
				}
				for(let i=0; i<rows.length;i++){
					var param = {
						store_uuid: rows[i].uuid
					}
					var res = await this.$API.manager_apis.delete_store.post(param)
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
			to_add_meituan(){
				this.source = "meituan"
			},
			to_add_eleme(){
				this.source = "eleme"
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
                    this.form.belong.belong_uuid=""
                    this.form.belong.belong_name=""
                    this.form.store_remarks=rows[0].store_remarks
                    this.form.store_name=rows[0].store_name
                    this.form.store_uuid=rows[0].uuid
					this.form.store_name = rows[0].store_name

					this.source = "edit"
				}
			},
			async add_store_meituan(){
				var validate = await this.$refs.add_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					store_class: "meituan",
					get_store_cookies: this.cookies_form.cookies,
				}
				var res = await this.$API.manager_apis.add_store.post(param)
				if(res.status == 0){
					this.$message.success("添加门店信息成功")
				} else {
					this.$message.error("添加门店信息失败！")
				}
				this.to_view()
			},
			async add_store_eleme(){
				
				this.to_view()
			},
			async edit_store(){
				var validate = await this.$refs.edit_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					worker_uuid: this.form.belong.belong_uuid,
					store_name: this.form.store_name,
					store_remarks: this.form.store_remarks,
					store_wmPoiId: this.form.store_wmPoiId,
                    store_uuid: this.form.store_uuid,
                    source: "info"
				}
                var res = null
                if(param.worker_uuid){
                    res = await this.$API.manager_apis.edit_store.post(param)
                    if(res.status == 0){
                        this.$message.success("修改门店信息成功")
                    } else {
                        this.$message.error("修改门店信息失败！")
                    }

                    param.source = "belong"
                    res = await this.$API.manager_apis.edit_store.post(param)
                    if(res.status == 0){
                        this.$message.success("修改门店责任人成功")
                    } else {
                        this.$message.error("修改门店责任人失败！")
                    }

                } else {
                    res = await this.$API.manager_apis.edit_store.post(param)
                    if(res.status == 0){
                        this.$message.success("修改门店信息成功")
                    } else {
                        this.$message.error("修改门店信息失败！")
                    }
                }
				this.form.belong.belong_uuid=""
                this.form.belong.belong_name=""
				this.form.store_remarks=""
				this.form.store_name=""
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
