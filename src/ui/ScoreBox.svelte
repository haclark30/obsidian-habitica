<script lang="ts">
    import type { HabiticaTask } from "../api/models";

    export let todo: HabiticaTask;
    export let upDown: string;
    export let onClickTask: (
        task: HabiticaTask,
        direction: string
    ) => Promise<void>;

</script>

{#if upDown == 'up'}
    <div
        class="habitica-task-control {todo.up ? 'up' : 'up disabled'}"
        on:click={() => onClickTask(todo, 'up')}
        on:keydown={() => onClickTask(todo, 'up')}
    >
        <div class="svg-icon positive-icon ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path
                    fill-rule="evenodd"
                    d="M6 4V0H4v4H0v2h4v4h2V6h4V4H6z"
                /></svg>
        </div>
    </div>
{:else}
    <div
        class="habitica-task-control {todo.down ? 'down' : 'down disabled'}"
        on:click={() => onClickTask(todo, 'down')}
        on:keydown={() => onClickTask(todo, 'down')}
    >
        <div class="svg-icon negative-icon ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 2"><path
                    fill-rule="evenodd"
                    d="M0 0h10v2H0z"
                /></svg>
        </div>
    </div>
{/if}

<style>
    .svg-icon svg {
        display: block;
    }
    .svg-icon {
        fill: currentColor;
        display: block;
    }

    .habitica-task-control .svg-icon {
        width: 10px;
        height: 10px;
        margin: 0 auto;
    }

    .habitica-task-control {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 100px;
        border: 1px solid white;
        color: white;
        cursor: pointer;
    }

    .habitica-task-control.up {
        background-color: green;
    }

    .habitica-task-control.down {
        background-color: red;
    }

    .habitica-task-control.disabled {
        cursor: default;
        background-color: grey;
    }

    .habitica-task-control:hover {
        filter: saturate(0.5);
    }

    .positive-icon {
        padding-top: 8px;
    }

    .negative-icon {
        padding-top: 12px;
    }

</style>
