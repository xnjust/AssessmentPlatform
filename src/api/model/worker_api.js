import config from "@/config"
import http from "@/utils/request"
import tool from "@/utils/tool"

export default {
    get_store_list_by_page: {
		url: `${config.API_URL}/worker/get_store`,
		name: "数据列表",
		post: async function(params){
            if(config.XDEBUG){
                console.log(params)
            }
            var post_param = {
                role: "worker",
                worker_uuid: tool.data.get("USER_INFO").userId,
                page: params.page,
                size: params.pageSize,
            }
            if(config.XDEBUG){
                console.log(post_param)
            }
			return await http.post(this.url, post_param);
		}
	},
    get_kpi_all: {
		url: `${config.API_URL}/worker/get_kpi_total`,
		name: "获取kpi",
		post: async function(params){
			if(config.XDEBUG){
				console.log("获取kpi")
                console.log(params)
				var uuid = tool.data.get("store_kpi_uuid")
				console.log(uuid)
            }
			var post_param = {
                role: "worker",
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
}
