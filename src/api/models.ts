export interface HabiticaTask {
    text: string,
    id: string,
    isDue: boolean,
    completed: boolean,
    up: boolean,
    down: boolean,
    counterUp: number,
    counterDown: number,
    type: string

}