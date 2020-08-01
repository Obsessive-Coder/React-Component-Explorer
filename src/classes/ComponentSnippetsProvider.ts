import {
  Event, EventEmitter, TreeDataProvider, TreeItem,
  TreeItemCollapsibleState, window, Uri, Memento,
  TextEditor, commands,
} from 'vscode';

// Classes, interfaces, and other utils.
import { ComponentTreeItem, SnippetTreeItem } from '.';
import { IComponentLibraryData, IGroupedSnippet } from '../interfaces';
import { CONSTANTS, HELPERS } from '../utils';

import fs = require('fs');

const { GET_LIBRARY_DATA } = HELPERS;
const {
  DEFAULT_OPEN_OPTIONS, WORKSPACE_STATE_PROPERTY,
  DOUBLE_CLICK_MILLISECONDS, INSERT_SNIPPET_COMMAND,
  LIBRARY_TREE_ITEM_CONTEXT, SNIPPET_NAME_REGEX
} = CONSTANTS;

export default class ComponentSnippetsProvider implements
  TreeDataProvider<TreeItem> {
    constructor(
      private workspaceRoot:  string,
      private workspaceState: Memento,
    ) {
      this.refresh = this.refresh.bind(this);
      this.addLibrary = this.addLibrary.bind(this);
      this.removeLibrary = this.removeLibrary.bind(this);
    }

    private _onDidChangeTreeData: EventEmitter<ComponentTreeItem | undefined> =
      new EventEmitter<ComponentTreeItem | undefined>();

    readonly onDidChangeTreeData: Event<ComponentTreeItem | undefined> =
      this._onDidChangeTreeData.event;

    get componentLibraries(): IComponentLibraryData[] {
      return this.workspaceState.get(WORKSPACE_STATE_PROPERTY, []);
    }

    set componentLibraries(library: IComponentLibraryData[]) {
      this.workspaceState.update( WORKSPACE_STATE_PROPERTY, library);
    }

    refresh(): void {
      this._onDidChangeTreeData.fire(undefined);
    }

    addLibrary(): void {
      // Show and open folder dialog and let the user select the snippet file.
      window.showOpenDialog(DEFAULT_OPEN_OPTIONS)
      .then((selectedPaths: Uri[] | undefined) => {
        // Cancel if the user didn't select a file.
        if (!selectedPaths|| !selectedPaths.length) {	return;	}

        // Get the name of the selected file from the selected path.
        const { path: selectedPath }: Uri = selectedPaths[0];
        const libraryData: IComponentLibraryData = GET_LIBRARY_DATA(selectedPath);

        // Add the new library data to the array of component libraries.
        this.componentLibraries = [ ...this.componentLibraries, libraryData ];

        this.refresh();
      });
    }

    removeLibrary({ label }: ComponentTreeItem): void {
      // Assign a new array to the component libraries excluding the one to remove.
			this.componentLibraries = this.componentLibraries.filter(
				({ name }: IComponentLibraryData) => name !== label);

			this.refresh();
    }

    insertSnippet({ snippetString }: SnippetTreeItem): void {
      // Get the current open text editor.
      const editor: TextEditor|undefined = window.activeTextEditor;
      if (editor) {
        // Insert the selected snippet into the open editor.
        editor.insertSnippet(snippetString);
      };
    }

    handleDoubleClick(treeItem: SnippetTreeItem): void {
      // Store the current time in milliseconds.
      const timeNow: number = new Date().getTime();

      // Get the difference between now and the last time the item was clicked.
      const timeSinceLastClick: number = Math.abs(timeNow - treeItem.lastClick);

      // Update the last click time of this item.
      // NOTE: If this is the second on a double click, this will be reset.
      treeItem.lastClick = timeNow;

      // Insert the snippet into the file if a snippet item was double clicked.
      if (timeSinceLastClick <= DOUBLE_CLICK_MILLISECONDS) {
        commands.executeCommand(INSERT_SNIPPET_COMMAND, treeItem);
        // Reset the last click tracker.
        treeItem.lastClick = -1;
      }
    }

    getTreeItem(element: TreeItem): TreeItem {
      return element;
    }

    getChildren(element?: ComponentTreeItem): Promise<TreeItem[]> {
      // This is called for each level of item in the tree view.

      // Show a message if there is no folder or workspace open.
      if (!this.workspaceRoot) {
        window.showInformationMessage('You need to have a workspace or folder open');
        return Promise.resolve([]);
      }

      /**
       * If an element was passed as a parameter...
       *  Get the component or snippet items.
      */
      let treeItems: TreeItem[] = [];
      if (element) {
        const { label, snippets }: ComponentTreeItem = element;
        const isLibraryItem: boolean = element.contextValue === LIBRARY_TREE_ITEM_CONTEXT;

        treeItems = isLibraryItem ?
          this.getComponentItems(label) : treeItems.concat(snippets);
      } else {
        // Get the top-level component library items.
        treeItems = this.getComponentLibraryItems();
      }

      return Promise.resolve(treeItems);
    }

    private getComponentLibraryItems(): TreeItem[] {
      // Build and return and array of component library tree items.
      return this.componentLibraries.map(
        ({ name }: IComponentLibraryData) => {
          // The new tree item.
          const libraryItem = new TreeItem(
            name, TreeItemCollapsibleState.Collapsed);

          // Set the context value for assigning item commands.
          libraryItem.contextValue = LIBRARY_TREE_ITEM_CONTEXT;

          return libraryItem;
      });
    }

    private getComponentItems(libraryName: string): TreeItem[] {
      /**
       * This method reads a snippets file and groups them by component.
       * It returns an array of ComponentTreeItems.
       * Each ComponentTreeItem has a snippets property.
       * The snippets property is an array of SnippetTreeItems.
      */

      // Get the component library data.
      const library: IComponentLibraryData = this.componentLibraries.filter(
        ({ name }: IComponentLibraryData) => (name === libraryName)
      )[0];

      // Open and read the snippets file for this library.
      const snippetsJSON = JSON.parse(fs.readFileSync(library.snippetsPath, 'utf-8'));

      // Group component tree items by their component name.
      const groupedSnippets: Array<IGroupedSnippet> = this.getGroupedSnippets(snippetsJSON);

      // Return and array of ComponentTreeItems with their snippet items.
      return groupedSnippets.map(componentData => {
        const componentName: string = Object.keys(componentData)[0];

        // Get the snippet items for this component.
        const componentSnippetItems: Array<SnippetTreeItem> =
          componentData[componentName].map((snippet) => (
            new SnippetTreeItem(snippet.prefix, snippet.description, snippet.body)
          ));

        // Return the new ComponentTreeItem with it child tree items.
        return new ComponentTreeItem(
          componentName, '', componentSnippetItems, TreeItemCollapsibleState.Collapsed);
      });
    }

    private getGroupedSnippets(snippetsData: any) {
      const groupedSnippets = [];
      const namesInGroups: string[] = [];
      const snippetsKeys: string[] = Object.keys(snippetsData);
      const getComponentName: Function =
        (snippetName: string): string =>  snippetName.split(SNIPPET_NAME_REGEX)[0];

      for (let i = 0; i < snippetsKeys.length; i++) {
        const componentName: string = getComponentName(snippetsKeys[i]);

        // If this snippet hasn't been grouped...
        if (!namesInGroups.includes(componentName)) {
          // All the snippets for this component.
          const componentSnippets: string[] = snippetsKeys.filter((snippetKey: string) => (
            getComponentName(snippetKey) === componentName
          ));

          // An object with the snippets and component name.
          const groupedData: IGroupedSnippet = {
            [componentName]: componentSnippets.map(
              (item: string) => (snippetsData[item]))
          };

          groupedSnippets.push(groupedData);
        }

        namesInGroups.push(componentName);
      }

      return groupedSnippets;
    }
};