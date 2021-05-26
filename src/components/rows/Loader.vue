<template>
    <div class="loading-container">
        <v-progress-circular
            :size="35"
            :width="2"
            color="#E84970"
            indeterminate
        />
    </div>
</template>
<script>
export default {}
</script>

<style scoped lang="scss">
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
}
</style>
