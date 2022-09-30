<template>
	<el-container>
		<el-header>
            <div class="left-panel">
                请选择门店  
                <sc-table-select v-model="form.store_name" :apiObj="list.apiObj" :table-width="600" :props="props" @change="change">
                    <el-table-column prop="uuid" label="ID" width="180"></el-table-column>
                    <el-table-column prop="store_name" label="门店名称"></el-table-column>
                </sc-table-select>
            </div>
			<div class="left-panel" v-if="source=='view' && form.store_name">
				<el-button type="primary" icon="el-icon-plus" @click="to_add()">新增KPI</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="to_edit()">修改KPI</el-button>
				<el-button type="danger" plain icon="el-icon-delete" @click="delete_kpi_warning()">删除选中KPI</el-button>
			</div>
			<div class="left-panel" v-else-if="source=='add' && form.store_name">
				<el-button type="success" icon="el-icon-plus" @click="add_kpi()">新增KPI</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看KPI</el-button>
			</div>
			<div class="left-panel" v-else-if="source=='edit' && form.store_name">
				<el-button type="success" icon="el-icon-edit" @click="edit_kpi()">修改KPI</el-button>
				<el-button type="primary" icon="el-icon-user" @click="to_view()">查看KPI</el-button>
			</div>
			<el-dialog
				v-model="centerDialogVisible"
				title="Warning"
				width="30%"
				align-center
			>
				<span>该操作会导致每日kpi记录同步删除，请谨慎操作！</span>
				<template #footer>
				<span class="dialog-footer">
					<el-button @click="centerDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="delete_kpi()"
					>删除</el-button
					>
				</span>
				</template>
			</el-dialog>
		</el-header>
		<el-main class="nopadding" v-show="form.store_name">
			<scTable ref="table" :apiObj="list.get_kpis" row-key="uuid" stripe v-show="source=='view'">
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="KPI时间" prop="time_belong" width="100" sortable></el-table-column>
				<el-table-column label="目标营业额" prop="turnover_target" width="100" sortable></el-table-column>
				<el-table-column label="实际营业额" prop="turnover" width="100" sortable></el-table-column>
                <el-table-column label="营业额完成情况" prop="turnover_rate" width="120" sortable></el-table-column>
                <el-table-column label="目标收入" prop="income_target" width="100" sortable></el-table-column>
				<el-table-column label="实际收入" prop="income" width="100" sortable></el-table-column>
                <el-table-column label="收入完成情况" prop="income_rate" width="100" sortable></el-table-column>
				<el-table-column label="目标订单数" prop="order_num_target" width="100" sortable></el-table-column>
				<el-table-column label="实际订单数" prop="order_num" width="100" sortable></el-table-column>
                <el-table-column label="订单数完成情况" prop="order_num_rate" width="120" sortable></el-table-column>
			</scTable>

			<el-card class="box-card" shadow="always" v-show="source=='add'">
				<div class="card-header">
					<el-form class="add_form" ref="add_form" :model="form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新的kpi</label>
						</div>
						<el-form-item prop="kpi_turnover_target">
							目标营业额<el-input v-model="form.kpi_turnover_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
						<el-form-item prop="kpi_income_target">
							目标收入<el-input v-model="form.kpi_income_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
						<el-form-item prop="kpi_order_num_target">
							目标订单数<el-input v-model="form.kpi_order_num_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</el-card>

			<el-card class="box-card" shadow="always" v-show="source=='edit'">
				<div class="card-header">
					<el-form class="edit_form" ref="edit_form" :model="form" :rules="rules" label-width="0" size="large">
						<div class="logo">
							<label>请输入新的门店信息</label>
						</div>
						<el-form-item prop="kpi_turnover_target">
							目标营业额<el-input v-model="form.kpi_turnover_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
						<el-form-item prop="kpi_income_target">
							目标收入<el-input v-model="form.kpi_income_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
						</el-form-item>
						<el-form-item prop="kpi_order_num_target">
							目标订单数<el-input v-model="form.kpi_order_num_target" prefix-icon="el-icon-user" clearable placeholder="请输入门店备注"></el-input>
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
					apiObj: this.$API.manager_apis.get_store_list_by_page,
					get_kpis: this.$API.manager_apis.get_kpi_all,
				},
				source : "view",
				form: {
					kpi_uuid:"",
					kpi_turnover_target:0,
					kpi_income_target:0,
					kpi_order_num_target:0,
					store_name:"",
					store_uuid:""
				},
				rules: {
					kpi_turnover_target: [
						{required: true, message: "目标营业额不可为空", trigger: 'blur'}
					],
					kpi_income_target: [
						{required: true, message: "目标收入不可为空", trigger: 'blur'}
					],
					kpi_order_num_target: [
						{required: true, message: "目标订单数不可为空", trigger: 'blur'}
					]
				},
                props: {
					label: 'store_name',
					value: 'uuid',
					keyword: "",
				},
				centerDialogVisible:false,
			}
		},
		methods: {
            change(val){
                this.props.value = val.uuid
                this.props.label = val.store_name
				this.$TOOL.data.set("store_kpi_uuid", val.uuid)
                this.form.store_name = val.store_name
                this.form.store_uuid = val.uuid
                console.log(this.props)
				this.to_view()
				this.$refs.table.refresh()
			},
			delete_kpi_warning(){
				this.centerDialogVisible = true
			},
			async delete_kpi(){
				this.centerDialogVisible = false
				// this.$message.warning('该操作会导致每日kpi记录同步删除，请谨慎操作！')
				var rows = this.$refs.table.$refs.scTable.getSelectionRows()
				if(rows.length == 0){
					this.$refs.table.refresh()
					this.$message.error("请选择kpi进行删除！")
					return
				}
				for(let i=0; i<rows.length;i++){
					var param = {
						kpi_total_uuid: rows[i].uuid
					}
					var res = await this.$API.manager_apis.delete_kpi.post(param)
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
					this.$message.warning("请选择一个kpi进行修改")
				}
				else if(rows.length != 1){
					this.$refs.table.refresh()
					this.$message.error("只可一个kpi进行修改!")
				}
				else{
                    this.form.kpi_turnover_target=rows[0].turnover_target
                    this.form.kpi_income_target=rows[0].income_target
                    this.form.kpi_order_num_target=rows[0].order_num_target
					this.form.kpi_uuid = rows[0].uuid

					this.source = "edit"
				}
			},
			async add_kpi(){
				var validate = await this.$refs.add_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					turnover_target: this.form.kpi_turnover_target,
					turnover : 0,
					income_target: this.form.kpi_income_target,
					income : 0,
					order_num_target: this.form.kpi_order_num_target,
					order_num : 0,
					store_uuid: this.form.store_uuid,
				}
				var res = await this.$API.manager_apis.add_kpi.post(param)
				if(res.status == 0){
					this.$message.success("添加kpi成功")
				} else {
					this.$message.error("添加kpi失败！")
				}
				this.form.kpi_turnover_target=""
				this.form.kpi_income_target=""
				this.form.kpi_order_num_target=""
				this.form.kpi_uuid = ""
				this.to_view()
				this.$refs.table.refresh()
			},
			async edit_kpi(){
				var validate = await this.$refs.edit_form.validate().catch(()=>{})
				if(!validate){ return false }
				var param = {
					turnover_target: this.form.kpi_turnover_target,
					income_target: this.form.kpi_income_target,
					order_num_target: this.form.kpi_order_num_target,
					kpi_total_uuid:this.form.kpi_uuid,
				}
				var res = await this.$API.manager_apis.edit_kpi.post(param)
				if(res.status == 0){
					this.$message.success("修改kpi成功")
				} else {
					this.$message.error("修改kpi失败！")
				}
				this.form.kpi_turnover_target=""
				this.form.kpi_income_target=""
				this.form.kpi_order_num_target=""
				this.form.kpi_uuid = ""
				this.to_view()
				this.$refs.table.refresh()
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
