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

    async scoreTask(taskId: string, direction: string) {
        let url = `https://habitica.com/api/v3/tasks/${taskId}/score/${direction}`;
        console.log(url);
        const result = await fetch(url, { method: 'POST', headers: this.headers });
        return await result.ok;
    }
}