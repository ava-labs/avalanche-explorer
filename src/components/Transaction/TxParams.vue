<template>
    <div class="params">
        <h4>Search</h4>
        <div class="bar">
            <div class="sort_container">
                <v-select
                    v-model="sort"
                    :items="sorts"
                    item-text="label"
                    item-value="query"
                    label="Sort by"
                    dense
                    color="#4c2e56"
                ></v-select>
            </div>
            <DateForm
                :class="sort === 'timestamp-desc' ? 'reverse' : ''"
                @change_start="setStart"
                @change_end="setEnd"
            />
            <div class="limit_container">
                <v-select
                    v-model="limit"
                    :items="limits"
                    label="Limit Results"
                    dense
                    color="#4c2e56"
                ></v-select>
            </div>
            <v-btn class="search_tx_btn ava_btn" text @click="submit"
                >Search</v-btn
            >
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import DateForm from '@/components/misc/DateForm.vue'
import { ITransactionParams } from '@/services/transactions'

@Component({
    components: {
        DateForm,
    },
})
export default class TxParams extends Vue {
    startDate: string = new Date().toISOString()
    endDate: string = new Date().toISOString()
    sort = 'timestamp-desc'
    sorts = [
        {
            label: 'New to Old',
            query: 'timestamp-desc',
        },
        {
            label: 'Old to New',
            query: 'timestamp-asc',
        },
    ]
    limit = 25
    limits = [10, 25, 100, 1000, 5000]

    setStart(val: string) {
        this.startDate = val
    }

    setEnd(val: string) {
        this.endDate = val
    }

    submit() {
        let params: ITransactionParams = {
            sort: this.sort,
            limit: this.limit,
        }

        params =
            this.sort === 'timestamp-desc'
                ? {
                      endTime: Math.round(
                          new Date(this.endDate).getTime() / 1000
                      ),
                      ...params,
                  }
                : {
                      startTime: Math.round(
                          new Date(this.startDate).getTime() / 1000
                      ),
                      ...params,
                  }

        this.$emit('change', params)
    }
}
</script>

<style scoped lang="scss">
.params {
    margin: 30px 0;
    font-size: 12px;
    border-radius: 6px;
    padding-left: 6px;

    h4 {
        margin-bottom: 0;
    }
}

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.request {
    border-bottom: 1px solid $gray;
}

.sort_container {
    width: 150px;
    padding-top: 19px;
    padding-right: 15px;
}

.limit_container {
    width: 100px;
    padding-top: 19px;
    padding-right: 15px;
}

@include smOrSmaller {
    .bar {
        flex-direction: column;
        align-items: flex-start;

        > p {
            flex-grow: 1;
        }
    }
}
</style>
