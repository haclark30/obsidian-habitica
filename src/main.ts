import { App, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, Setting } from 'obsidian';
import { HabiticaApi } from './api/api';
import QueryInjector from './queryInjector';

interface MyPluginSettings {
	habiticaUserKey: string;
	habiticaApiKey: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	habiticaUserKey: '',
	habiticaApiKey: ''
}

export default class HabiticaPlugin extends Plugin {
	settings: MyPluginSettings;

	private readonly queryInjector: QueryInjector;
	private api: HabiticaApi

	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
		this.queryInjector = new QueryInjector(app);
		this.api = null;
	}

	async onload() {
		console.log('loading plugin');
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			"habitica", this.queryInjector.onNewBlock.bind(this.queryInjector)
		)

		this.api = new HabiticaApi(this.settings.habiticaUserKey, this.settings.habiticaApiKey)
		this.queryInjector.setApi(this.api)

		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: HabiticaPlugin;

	constructor(app: App, plugin: HabiticaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Habitica User Key')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.habiticaUserKey = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
		.setName('Habitica API Key')
		.setDesc('It\'s a secret')
		.addText(text => text
			.setPlaceholder('Enter your secret')
			.setValue('')
			.onChange(async (value) => {
				console.log('Secret: ' + value);
				this.plugin.settings.habiticaApiKey = value;
				await this.plugin.saveSettings();
			}));
	}
}
