import {
	commands, ExtensionContext, window, workspace
} from 'vscode';

import { ComponentSnippetsProvider } from './classes';

import {
	ADD_LIBRARY_COMMAND, TREE_VIEW_ID, REFRESH_COMMAND,
	REMOVE_LIBRARY_COMMAND, INSERT_SNIPPET_COMMAND,
	DOUBLE_CLICK_COMMAND,
} from './utils/constants';

export function activate(context: ExtensionContext) {
	const { workspaceState }: ExtensionContext = context;

	// The provider controls the tree view and its items.
	const treeDataProvider: ComponentSnippetsProvider =
		new ComponentSnippetsProvider(workspace.rootPath || '', workspaceState);

	// Create the TreeView with the provider.
	window.createTreeView(TREE_VIEW_ID, { treeDataProvider });

	// Get methods from the tree provider.
	const {
		refresh, addLibrary, removeLibrary, insertSnippet,
		handleDoubleClick,
	}: ComponentSnippetsProvider = treeDataProvider;

	// Register and handle commands.
	commands.registerCommand(REFRESH_COMMAND, refresh);
	commands.registerCommand(ADD_LIBRARY_COMMAND, addLibrary);
	commands.registerCommand(REMOVE_LIBRARY_COMMAND, removeLibrary);
	commands.registerCommand(INSERT_SNIPPET_COMMAND, insertSnippet);
	commands.registerCommand(DOUBLE_CLICK_COMMAND, handleDoubleClick);
}

export function deactivate() {}
