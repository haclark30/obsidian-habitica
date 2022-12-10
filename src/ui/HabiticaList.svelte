<script lang="ts">
    import type { HabiticaApi } from "../api/api";
    import type { Query } from "../query";
    import HabiticaDaily from "./HabiticaDaily.svelte";
    import HabiticaHabit from "./HabiticaHabit.svelte";
    export let query: Query;
    export let api: HabiticaApi;

    var tasks = api.getTasks(query.type);

    async function onClickTask(todo, direction) {
        if (
            (direction == "up" && todo.up) ||
            (direction == "down" && todo.down)
        ) {
            await api.scoreTask(todo.id, direction);
            tasks = api.getTasks(query.type);
        }
    }

</script>

<h4 class="habitica-query-title">{query.type}</h4>
<button
    class="habitica-refresh-button"
    on:click={async () => {
        tasks = api.getTasks(query.type);
    }}
>
    <svg
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clip-rule="evenodd"
        />
    </svg>
</button>

{#await tasks}
    <p>...waiting</p>
{:then tasks}
    {#if tasks.length > 0}
        <div class="habitica-list">
            {#each tasks as todo}
                {#if todo.type == 'habit'}
                    <HabiticaHabit {todo} {onClickTask} />
                {/if}
                {#if todo.type == 'daily'}
                    <HabiticaDaily {todo} {onClickTask} />
                {/if}
            {/each}
        </div>
    {:else}
        <p>no dailies are due</p>
    {/if}
{/await}

<style>
    .habitica-query-title {
        display: inline;
        font-size: 1.25em;
    }

    .habitica-refresh-button {
        display: inline;
        margin-left: 50px;
        margin-right: 50px;
        margin-top: 10px;
        float: right;
    }
    .habitica-list {
        display: block;
        padding-top: 10px;
    }

</style>
