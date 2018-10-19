<template>
	<div class="container">
		<text class="title">Hello!!</text>		
		<text class="desc">一套 Vue 代码，两端原生应用。</text>	
		<wxc-cell title="进入下一个页面，发布一个事件"
            :desc="`订阅的数据为：${paramsData||'空'}`"
            :has-arrow="true"
            :has-top-border="true"
            @wxcCellClicked="toPageA">
        </wxc-cell>	
	</div>
</template>
<script>
import { WxcCell } from 'weex-ui'
	export default {
components: { WxcCell },
	created(){
    weex.requireModule('TrackerPlugin').startTracker(function(resp){ console.log(resp); })

  },
	methods: {
         toPageA () {
            this.$router.open({
                name: 'event.a'
            })
        },
        receivedLocation(){
          console.log("asdf")
        }
	}
	}
</script>
<style scoped>
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 100px;
}
.desc {
  font-size: 30px;
}
</style>