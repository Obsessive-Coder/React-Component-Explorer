import {
	commands, ExtensionContext, window, workspace, SnippetString
} from 'vscode';

import { ComponentSnippetsProvider, SnippetTreeItem } from './classes';

export function activate(context: ExtensionContext) {
	// Create a new Provider.
	const componentSnippetsProvider = new ComponentSnippetsProvider(workspace.rootPath || '');

	// Create the TreeView.
	window.createTreeView('reactComponents', {
		treeDataProvider: componentSnippetsProvider
	});

	// Register Commands.
	commands.registerCommand('reactComponents.refresh', () =>
    componentSnippetsProvider.refresh()
	);

	commands.registerCommand('reactComponents.insertComponent', (treeItem: SnippetTreeItem) => {
		const editor = window.activeTextEditor;
		if (!editor) { return; };

		editor.insertSnippet(new SnippetString(treeItem.snippetString));
	});
}

export function deactivate() {}
