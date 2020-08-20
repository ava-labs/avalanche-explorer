<template>
    <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
        <template v-slot:activator="{ on }">
            <fa v-on="on" icon="info-circle" transform="shrink-8" :style="{ color: '#867E89' }"></fa>
        </template>
        <span>{{content}}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {content: String}
};
</script>
