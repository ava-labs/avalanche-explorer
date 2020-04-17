<template>
    <div>
        ALL TX
    </div>
</template>
<script>
    import api from "@/axios";

    export default {
        data(){
            return{
                txs: [],
            }
        },
        created() {
            let parent = this;
            let url = `/x/transactions`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.txs = data;
                console.log(data);
            });
        }
    }
</script>