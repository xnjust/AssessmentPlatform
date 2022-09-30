<template>
	<link rel="stylesheet" href="css/slicy.css" />
	<link rel="stylesheet" href="css/style.css" />
	<div class="layout">
		<div class="header">
			<a href="#" class="logo"><img src="images/logo.png" ></a>
			<div class="naver">
				<ul class="clearfix">
					<li class="on">
						<router-link to="/data_show">数据大屏</router-link>
					</li>
					<li>
						<router-link to="/">后台管理</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div class="hmain">
			<div class="ts">
				<h1>数据大屏</h1>
				<h6>{{real_time}}</h6>
			</div>
			<div class="box clearfix">
				<div class="lt">
					<div class="tit">
						<h2>绩效排行榜</h2>
					</div>
					<div class="bodc">
						<el-table :data="achievements_data" border="false" style="background-color: #0C2441; width: 100%; height: 100%;" max-height="1000" :header-cell-style="{color: 'black', textAlign:'center'}" :default-sort="{ prop: 'turnover', order: 'descending' }">
							<el-table-column prop="worker_name" label="姓名" width="88" />
							<el-table-column prop="turnover" label="营业额" width="108" sortable/>
							<el-table-column prop="income" label="收入" width="89" sortable/>
							<el-table-column prop="order_num" label="订单数" width="108" sortable/>
						</el-table>
					</div>
				</div>
				<div class="lt cen">
					<div class="tit">
						<h2>员工业绩排行</h2>
					</div>
					<el-scrollbar class="scrollbar">
						<dd v-for="item in worker_list" :key="item">
							<i class="i1"></i>
							<i class="i2"></i>
							<i class="i3"></i>
							<i class="i4"></i>
							<div class="ovs">
								<div class="ds">
									<div class="ico">
										<el-icon style="font-size:40px; color:#FF8447"><el-icon-avatar /></el-icon>
									</div>
									<h6>{{item.username}}</h6>
									
									<h6>&nbsp;&nbsp;完成度:{{item.progress}}%</h6>
								</div>
								<h4><span>{{item.index}}</span></h4>
							</div>
						</dd>
						<dd>
							<i class="i1"></i>
							<i class="i2"></i>
							<i class="i3"></i>
							<i class="i4"></i>
							<div class="ovs">
								<div class="ds">
								</div>
								<h4><span>***</span></h4>
							</div>
						</dd>
					</el-scrollbar>
				</div>
				<div class="lt">
					<div class="tit">
						<h2>门店排行</h2>
					</div>
					<div class="bodc">
						<el-table :data="store_data" border="false" style="background-color: #0C2441; width: 100%; height: 100%; font-size: 18px; font-weight: bolder;" max-height="1000" :header-cell-style="{color: 'black', textAlign:'center'}" :default-sort="{ prop: 'turnover', order: 'descending' }">
							<el-table-column prop="store_name" label="门店名称" width="75" />
							<el-table-column prop="turnover" label="营业额" width="80" sortable/>
							<el-table-column prop="income" label="收入" width="80" sortable/>
							<el-table-column prop="order_num" label="订单数" width="80" sortable/>
							<el-table-column prop="grade" label="评分增减" width="80" sortable/>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		components: {
		},
		data() {
			return {
				timer: null,
				real_time: "",
				achievements_data:[],
				store_data : [],
				worker_list: [],
			}
		},
		watch:{
			
		},
		methods: {
			async get_achievements_data(){
				var res = await this.$API.data_show_api.get_achievements_data.post({})
				if(res.status == 0){
					this.achievements_data = res.workers_info
				} else {
					this.$message.warning(res.msg)
				}
			},
			async get_store_data(){
				var res = await this.$API.data_show_api.get_store.post({})
				// this.$message.warning(res.status)
				if(res.status == 0){
					this.store_data = res.stores_list
				} else {
					this.$message.warning("get store error "+res.msg)
				}
			},
			async get_progress(){
				var res = await this.$API.data_show_api.get_progress.post({})
				// this.$message.warning(res.status)
				if(res.status == 0){
					this.worker_list = res.worker_list
					for(var i=0;i<this.worker_list.length;i++)
					{
						this.worker_list[i].progress = this.worker_list[i].progress*100
						this.worker_list[i].progress = this.worker_list[i].progress.toFixed(2)
					}
				} else {
					this.$message.warning("get store error "+res.msg)
				}
			},
		},
		mounted(){
			this.timer = setInterval(()=>{
			// 这里调用调用需要执行的方法，1为自定义的参数，由于特殊的需求它将用来区分，定时器调用和手工调用，然后执行不同的业务逻辑
				const getCurrentTime = () => {
					//获取当前时间并打印
					let yy = new Date().getFullYear();
					let mm = new Date().getMonth()+1;
					let dd = new Date().getDate();
					let hh = new Date().getHours();
					let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
					let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
					const gettime = yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;
					console.log(gettime)
					return gettime
				}
				this.real_time = getCurrentTime()
				this.get_achievements_data()
				this.get_store_data()
				this.get_progress()
			}, 1000) // 每两秒执行1次

			function requestFullScreen(element) {
				var de = document.querySelector(element) || document.documentElement;
				if (de.requestFullscreen) {
					de.requestFullscreen();
				} else if (de.mozRequestFullScreen) {
					de.mozRequestFullScreen();
				} else if (de.webkitRequestFullScreen) {
					de.webkitRequestFullScreen();
				}
			}
			requestFullScreen()
		},
		beforeUnmount(){
			if(this.timer){
				clearInterval(this.timer)
				this.timer = null
			}
		}
	}
</script>

<style scoped>
	/*最外层透明*/
	::v-deep .el-table,
	::v-deep .el-table__expanded-cell {
		font-size: 18px;
		color: black;
		text-align: center;
		font-family: 黑体;
		background-color: #0C2441;
	}
	/* 表格内背景颜色 */
	/* ::v-deep .el-table th,
	::v-deep .el-table tr,
	::v-deep .el-table td {
		background-color: transparent !important;
		border: 0;
	} */
	/*去除底边框*/
	/* ::v-deep.el-table td.el-table__cell {
		border: 0;
	}
	::v-deep.el-table th.el-table__cell.is-leaf {
		border: 0;
	} */
	/*去除底部灰条.el-table::before*/
	::v-deep .el-table::before {
		display: none;
	}

</style>
