import config from "@/config"
import http from "@/utils/request"

export default {
	token_manager: {
		url: `${config.API_URL}/manager/login`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			if(config.XDEBUG){
				console.log("axios post manager login:",this.url, data)
			}
			return await http.post(this.url, data);
		}
	},
	token_worker: {
		url: `${config.API_URL}/worker/login`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			if(config.XDEBUG){
				console.log("axios post worker login:",this.url, data)
			}
			return await http.post(this.url, data);
		}
	}
}
