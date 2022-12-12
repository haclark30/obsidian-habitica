import { renderResults } from "obsidian";
import { writable, derived, Readable } from "svelte/store"
import type { HabiticaTask } from "./models";

export class HabiticaApi {
    private userToken: string;
    private apiKey: string
    private headers: Headers

    constructor(userToken, apiKey) {
        this.userToken = userToken;
        this.apiKey = apiKey;
        this.headers = new Headers({
            "Content-Type": "application/json",
            "x-client": "93c29c04-03b3-416f-bc6f-0edbfd806238-ObsidianHabitia",
            "x-api-user": this.userToken,
            "x-api-key": this.apiKey
        });
    }

    async getTasks(type: string): Promise<HabiticaTask[]> {
        let url = `https://habitica.com/api/v3/tasks/user?type=${type}`
        console.log(url);
        const result = await fetch(url, {
            headers: this.headers
        });

        var resp = result.json().then(
            (data) => {
                return data.data.filter(
                    (task) => {
                        // only show dailys due today
                        if (type == "dailys" && task.isDue && !task.completed) {
                            return task
                        }
                        else if (type == "habits" || type == "todos") {
                            return task
                        }
                    }
                )
            }
        )
        return await resp;
    }

    async getAllTasks(): Promise<HabiticaTask[]> {
        let url = "https://habitica.com/api/v3/tasks/user"
        const result = await fetch(url, { headers: this.headers });

        var resp = result.json().then((data) => data.data)
        return resp
    }

    async scoreTask(taskId: string, direction: string) {
        let url = `https://habitica.com/api/v3/tasks/${taskId}/score/${direction}`;
        console.log(url);
        const result = await fetch(url, { method: 'POST', headers: this.headers });
        return await result.ok;
    }
}

function createCount() {
    const { subscribe, set, update } = writable([])

    return {
        subscribe,
        getTasks: (api: HabiticaApi) => api.getAllTasks().then((tasks) => set(tasks)),
        reset: () => set([])
    };
}

export const count = createCount();

export const habits: Readable<HabiticaTask[]> = derived(count, ($tasks) => {
    return $tasks.filter((task) => {
        if (task.type == "habit") {
            return task
        }
    })
});

export const dailys: Readable<HabiticaTask[]> = derived(count, ($tasks) => {
    return $tasks.filter((task) => {
        if (task.type == "daily" && task.isDue && !task.completed) {
            return task
        }
    })
});