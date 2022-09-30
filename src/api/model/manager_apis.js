import config from "@/config"
import http from "@/utils/request"
import tool from "@/utils/tool"

export default {
    add_worker: {
		url: `${config.API_URL}/manager/add_worker`,
		name: "添加员工账号",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
    edit_worker: {
		url: `${config.API_URL}/manager/edit_worker`,
		name: "修改员工账号",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	delete_worker: {
		url: `${config.API_URL}/manager/delete_worker`,
		name: "删除员工账号",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	get_worker_list_by_page: {
		url: `${config.API_URL}/manager/get_worker_by_page`,
		name: "数据列表",
		post: async function(params){
            if(config.XDEBUG){
                console.log(params)
            }
            var post_param = {
                username: tool.data.get("USER_INFO").userName,
                uuid: tool.cookie.get("TOKEN"),
                role: "manager",
                page: params.page,
                size: params.pageSize,
            }
            if(config.XDEBUG){
                console.log(post_param)
            }
			return await http.post(this.url, post_param);
		}
	},
    get_store_list_by_page: {
		url: `${config.API_URL}/manager/get_store`,
		name: "数据列表",
		post: async function(params){
            if(config.XDEBUG){
                console.log(params)
            }
            var post_param = {
                role: "manager",
                source: "page",
                page: params.page,
                size: params.pageSize,
            }
            if(config.XDEBUG){
                console.log(post_param)
            }
			return await http.post(this.url, post_param);
		}
	},
    add_store: {
		url: `${config.API_URL}/manager/add_store`,
		name: "添加门店",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
    edit_store: {
		url: `${config.API_URL}/manager/edit_store`,
		name: "修改门店",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
    delete_store: {
		url: `${config.API_URL}/manager/delete_store`,
		name: "删除门店",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},

	get_kpi_all: {
		url: `${config.API_URL}/manager/get_kpi_total`,
		name: "获取kpi",
		post: async function(params){
			if(config.XDEBUG){
				console.log("获取kpi")
                console.log(params)
				var uuid = tool.data.get("store_kpi_uuid")
				console.log(uuid)
            }
			var post_param = {
                role: "manager",
                source: "all",
                page: params.page,
                size: params.pageSize,
				store_uuid: tool.data.get("store_kpi_uuid")
            }
			if(config.XDEBUG){
                console.log(post_param)
            }
			return await http.post(this.url, post_param);
		}
	},
	add_kpi: {
		url: `${config.API_URL}/manager/add_kpi_total`,
		name: "增加kpi",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	edit_kpi: {
		url: `${config.API_URL}/manager/edit_kpi_total`,
		name: "修改kpi",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	delete_kpi: {
		url: `${config.API_URL}/manager/delete_kpi_total`,
		name: "删除kpi",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
	// menu: {
	// 	url: `${config.API_URL}/demo/menu`,
	// 	name: "普通用户菜单",
	// 	get: async function(){
	// 		return await http.get(this.url);
	// 	}
	// },
	// status: {
	// 	url: `${config.API_URL}/demo/status`,
	// 	name: "模拟无权限",
	// 	get: async function(code){
	// 		return await http.get(this.url, {}, {
	// 			headers: {
	// 				"response-status": code
	// 			}
	// 		});
	// 	}
	// }
}
