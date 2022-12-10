<script lang="ts">
    import type { HabiticaTask } from "../api/models";
    export let todo: HabiticaTask;
    export let onClickTask: (
        task: HabiticaTask,
        direction: string
    ) => Promise<void>;

</script>

    <div>
        <input
            type="checkbox"
            on:click={async () => {
                await onClickTask(todo, 'up');
            }}
        />
        <strong>{todo.text}</strong>
    </div>
