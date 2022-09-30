<template>
    <div>go to </div>
</template>

<script>
    import { onBeforeMount } from 'vue'
    import router from '@/router'
	export default {
		setup(){
            onBeforeMount(()=>{
                console.log("go to ")
                router.replace("/data_show")
            })
        },
		data() {
			return {
            }
		},
		methods: {
        }
	}
</script>

<style scoped>
	
</style>
