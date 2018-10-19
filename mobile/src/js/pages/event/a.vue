<template>
	<div class="container">
		<text class="title">asdf!!</text>		

    <scroller>
        <title title="Subscription"></title>
        <category title="$event.on"></category>
        <wxc-cell title="Go to the next page, post an event"
            :desc="`${paramsData}`"
            :has-arrow="true"
            :has-top-border="true"
            @wxcCellClicked="toPageB">
        </wxc-cell>
    </scroller>
	</div>
</template>
<script>
import { WxcCell } from 'weex-ui'
// import Title from '../_mods/title'
// import Category from '../_mods/category'
export default {
    components: { WxcCell }, 
    created () {
        this.$event.on('getParams', (params) => {
            // params 为触发该事件所传的参数
            this.paramsData = params
        });
    },
    data () {
        return {
            paramsData: ''
        }
    },
    methods: {
         toPageB () {
            this.$router.open({
                name: 'event.b'
            })
        }
    }
}
</script>
