import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { NotifState, Notification, NotificationInput } from "@/store/modules/notifications/types";

const COLOR_SUCCESS: string = '#6BC688';
const COLOR_WARNING: string = '#c39043';
const COLOR_ERROR: string = '#E84970';
let notif_id = 0;

const notifications_module: Module<NotifState, IRootState> = {
    namespaced: true,
    state: {
        items: []
    },
    actions: {
        add(store, data: NotificationInput) {

            let id = notif_id++;
            let type: string = data.type || 'success';
            let duration: number = data.duration || 5000;
            let color: string = COLOR_SUCCESS;

            switch (type) {
                case 'success':
                    color = COLOR_SUCCESS;
                    break;
                case 'error':
                    color = COLOR_ERROR;
                    break;
                case 'warning':
                    color = COLOR_WARNING;
                    break;

            }

            let item: Notification = {
                id: id,
                title: data.title,
                message: data.message,
                color: color,
                duration: 5000
            };

            setTimeout(() => {
                for (let i = 0; i < store.state.items.length; i++) {
                    let item = store.state.items[i];
                    if (item.id === id) {
                        store.state.items.splice(i, 1)
                    }
                }
            }, duration);
            store.state.items.push(item);
        }
    }
};

export default notifications_module;
