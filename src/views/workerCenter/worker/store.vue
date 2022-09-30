<template>
	<el-container>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="list.apiObj" row-key="uuid" stripe v-if="source=='view'">
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				<el-table-column label="门店名称" prop="store_name" width="150"></el-table-column>
				<el-table-column label="门店备注" prop="store_remarks" width="250"></el-table-column>
				<el-table-column label="门店责任人" prop="store_belong" width="250"></el-table-column>
                <el-table-column label="昨日评分" prop="store_grade_yestoday" width="250" sortable></el-table-column>
                <el-table-column label="今日评分" prop="store_grade_today" width="250" sortable></el-table-column>
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
				},
				source : "view",
				form: {
                    store_uuid: "",
					store_name: "",
					store_remarks: "",
                    belong:{
                        belong_uuid:"",
                        belong_name:"",
                    }
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
			filterHandler(value, row, column){
				const property = column['property']
				return row[property] === value
			},
		}
	}
</script>

<style scoped>

</style>
