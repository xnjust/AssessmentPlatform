<template>
	<el-container>
        <el-header>
			<div class="right-panel" v-if="source=='store'">
				<el-button type="primary" icon="el-icon-plus" @click="to_kpi()">查看门店kpi</el-button>
			</div>
			<div class="right-panel" v-else-if="source=='kpi'">
				<el-button type="primary" icon="el-icon-user" @click="to_store()">查看门店列表</el-button>
			</div>
		</el-header>
		<el-main class="nopadding" v-if="source=='store'">
			<scTable ref="table" :apiObj="list.apiObj" row-key="uuid" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="门店名称" prop="store_name" width="150"></el-table-column>
				<el-table-column label="门店备注" prop="store_remarks" width="250"></el-table-column>
				<el-table-column label="门店责任人" prop="store_belong" width="250"></el-table-column>
                <el-table-column label="昨日评分" prop="store_grade_yestoday" width="250" sortable></el-table-column>
                <el-table-column label="今日评分" prop="store_grade_today" width="250" sortable></el-table-column>
			</scTable>
		</el-main>
        <el-main class="nopadding" v-if="source=='kpi'">
			<scTable ref="kpi_table" :apiObj="list.get_kpis" row-key="uuid" stripe>
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
        </el-main>
	</el-container>
</template>

<script>
	export default {
		
		data() {
			return {
				list: {
					apiObj: this.$API.worker_api.get_store_list_by_page,
                    get_kpis: this.$API.worker_api.get_kpi_all,
				},
				source : "store",
			}
		},
		methods: {
            change(val){
				this.$TOOL.data.set("store_kpi_uuid", val.uuid)
				this.to_view()
				this.$refs.table.refresh()
			},
			filterHandler(value, row, column){
				const property = column['property']
				return row[property] === value
			},
            to_store(){
				this.source = "store"
			},
			to_kpi(){
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
				    this.source = "kpi"
                }
			},
		}
	}
</script>

<style scoped>

</style>
