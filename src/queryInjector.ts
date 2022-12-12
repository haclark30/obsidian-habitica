import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import type SvelteComponentDev from "./ui/HabiticaList.svelte"
import type { HabiticaApi } from "./api/api";
import type { Query } from "./query";
import HabiticaList from "./ui/HabiticaList.svelte";

export default class QueryInjector {
  private app: App
  private queries: String[]
  private api: HabiticaApi

  constructor(app: App) {
    this.app = app;
    this.queries = [];
  }

  setApi(api: HabiticaApi) {
    this.api = api
  }

  onNewBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    // todo: catch exception and show error screen
    let query: Query = JSON.parse(source)
    console.log(query.type)
    const child = new InjectedQuery(el, (root: HTMLElement) => {
      return new HabiticaList({
        target: root,
        props: {
          query: query,
          api: this.api
        }
      })
    })

    ctx.addChild(child)
  }
}

class InjectedQuery extends MarkdownRenderChild {
  private readonly createComp: (root: HTMLElement) => SvelteComponentDev;
  private component: SvelteComponentDev;

  constructor(
    container: HTMLElement,
    createComp: (root: HTMLElement) => SvelteComponentDev
  ) {
    super(container);
    this.createComp = createComp;
    this.containerEl = container;
  }

  onload() {
    this.component = this.createComp(this.containerEl);
  }

  onunload() {
    if (this.component) {
      this.component.$destroy();
    }
  }
}