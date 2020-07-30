import {
	commands, ExtensionContext, window, workspace,
	SnippetString, Uri
} from 'vscode';

import { ComponentSnippetsProvider, SnippetTreeItem, ComponentTreeItem } from './classes';
import { IComponentLibraryData } from './interfaces';
import { DEFAULT_OPEN_OPTIONS, FILE_PATH_REGEX } from './utils/constants';

import path = require('path');

export function activate(context: ExtensionContext) {
	let componentLibraries: IComponentLibraryData[] = context.workspaceState.get('componentLibraries', []);
	// Create a new Provider.
	const componentSnippetsProvider =
		new ComponentSnippetsProvider(workspace.rootPath || '', componentLibraries);

	// Create the TreeView.
	window.createTreeView('reactComponents', {
		treeDataProvider: componentSnippetsProvider
	});

	// Register Commands.
	commands.registerCommand('reactComponents.refresh', () =>
    componentSnippetsProvider.refresh()
	);

	commands.registerCommand('reactComponents.addLibrary', () => {
		window.showOpenDialog(DEFAULT_OPEN_OPTIONS)
			.then((selectedFolderPaths: Uri[] | undefined) => {
				if (!selectedFolderPaths || !selectedFolderPaths.length) {
					return;
				}

				const { path: selectedPath }: Uri = selectedFolderPaths[0];
				const pathFolders: string[] = selectedPath.split(FILE_PATH_REGEX);
				const filename: string = pathFolders[pathFolders.length - 1].split('.code-snippets')[0];

				const libraryData: IComponentLibraryData = {
					name: filename,
					snippetsPath: path.join(...pathFolders),
				};

				componentLibraries.push(libraryData);
				context.workspaceState.update('componentLibraries', componentLibraries);
				componentSnippetsProvider.refresh();
			});
	});

	commands.registerCommand('reactComponents.removeLibrary', ({ label }: ComponentTreeItem) => {
		componentLibraries = componentLibraries.filter(
			({ name }: IComponentLibraryData) => name !== label);

		componentSnippetsProvider.componentLibraries = componentLibraries;
		context.workspaceState.update('componentLibraries', componentLibraries);
		componentSnippetsProvider.refresh();
	});

	commands.registerCommand('reactComponents.insertComponent', (treeItem: SnippetTreeItem) => {
		const editor = window.activeTextEditor;
		if (!editor) { return; };

		editor.insertSnippet(new SnippetString(treeItem.snippetString));
	});
}

export function deactivate() {}
