<template>
    <v-card id="control_key_table">
        <v-card-title v-if="title">
            {{title}}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Address of Control Key</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ck in subnet.controlKeys" :key="ck">
                        <td>
                            <img class="table_image" src="@/assets/key-purple.png" alt />
                            {{ ck }}
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <p class="threshold">{{subnet.threshold | pluralizeThreshold}} needed to add a validator to the subnet.</p>
    </v-card>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { subnetMap, VMMap, VMDocumentationMap } from "@/helper";
import Subnet from "@/js/Subnet";
import Blockchain from "@/js/Blockchain";
import Indexed from "@/components/Blockchain/Indexed.vue";

@Component({
    components: {
        Indexed,
    },
    filters: {
        pluralizeThreshold(val: number) {
            return val === 0
                ? `${val} threshold signatures from addresses are`
                : val > 1
                ? `${val} threshold signatures from addresses are`
                : `${val} threshold signature from address is`;
        }
    }
})
export default class ControlKeyTable extends Vue {
    @Prop() subnet!: Subnet;
    @Prop() title?: string;
}
</script>

<style scoped lang="scss">


.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 0.825em;
    color: $gray;
    line-height: 1em;
}

.threshold {
    padding: 32px 16px;
}

@include smOnly {
}

@include xsOnly {
}
</style>

<style lang="scss">


#control_key_table {
    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }

    .v-select.v-text-field input {
        border-color: transparent;
    }

    .hide {
        display: none;
    }
}
</style>