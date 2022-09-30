import config from "@/config"
import http from "@/utils/request"
// import tool from "@/utils/tool"

export default {
    get_achievements_data: {
		url: `${config.API_URL}/data/get_achievements_data`,
		name: "个人业绩",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
    get_store: {
		url: `${config.API_URL}/data/get_store`,
		name: "门店信息",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
    get_progress: {
		url: `${config.API_URL}/data/get_progress`,
		name: "进度信息",
		post: async function(params){
			return await http.post(this.url, params);
		}
	},
}
