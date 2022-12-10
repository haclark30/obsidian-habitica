<script lang="ts">
    import type { HabiticaTask } from "../api/models";
    import ScoreBox from "./ScoreBox.svelte";
    export let todo: HabiticaTask;
    export let onClickTask: (
        task: HabiticaTask,
        direction: string
    ) => Promise<void>;

</script>

<div class="habitica-task">
    <div class="habitica-check">
        <ScoreBox {todo} upDown={'down'} {onClickTask} />
    </div>

    <div class="habitica-task-meta">
        <strong>{todo.text}</strong>
        <div class="habitca-task-score">
            ⇉
            {#if todo.down}-{todo.counterDown}{/if}
            {#if todo.down && todo.up}|{/if}
            {#if todo.up}+{todo.counterUp}{/if}
        </div>
    </div>
    <div class="habitica-check">
        <ScoreBox {todo} upDown={'up'} {onClickTask} />
    </div>
</div>

<style>
    .habitica-check {
        display: inline-block;
    }
    .habitica-task {
        width: 300px;
        text-align: center;
    }

    .habitica-task-meta {
        display: inline-block;
        width: 200px;
        height: 50px;
    }

    .habitca-task-score {
        text-align: right;
        font-size: small;
        padding-right: 5px;
    }

</style>
