import {
  Event, EventEmitter, TreeDataProvider, TreeItem,
  TreeItemCollapsibleState, window
} from 'vscode';

import { ComponentTreeItem, SnippetTreeItem } from '.';
import { IComponentLibraryData } from '../interfaces';

import fs = require('fs');

export default class ComponentSnippetsProvider implements
  TreeDataProvider<TreeItem> {
    constructor(private workspaceRoot:  string, public componentLibraries: IComponentLibraryData[]) {}

    private _onDidChangeTreeData: EventEmitter<ComponentTreeItem | undefined> = new EventEmitter<ComponentTreeItem | undefined>();

    readonly onDidChangeTreeData: Event<ComponentTreeItem | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
      this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: ComponentTreeItem): TreeItem {
      return element;
    }

    getChildren(element?: ComponentTreeItem): Promise<TreeItem[]> {
      if (!this.workspaceRoot) {
        window.showInformationMessage('You need to have a workspace or folder open');
        return Promise.resolve([]);
      }

      let treeItems: TreeItem[] = [];
      if (element) {
        const isLibraryItem: boolean = element.contextValue === 'componentLibrary';
        treeItems = isLibraryItem ? (
          this.getComponentItems(element.label)
        ) : treeItems.concat(element.snippets);
      } else {
        treeItems = this.getComponentLibraryItems();
      }

      return Promise.resolve(treeItems);
    }

    private getComponentLibraryItems(): TreeItem[] {
      const libraryNames: string[] = this.componentLibraries.map(
        ({ name }: IComponentLibraryData) => name);

      return libraryNames.map((libraryName: string) => {
        const libraryItem = new TreeItem(
          libraryName, TreeItemCollapsibleState.Collapsed);
        libraryItem.contextValue = 'componentLibrary';
        return libraryItem;
      });
    }

    private getComponentItems(libraryName: string): TreeItem[] {
      const library: IComponentLibraryData = this.componentLibraries.filter(
        ({ name }: IComponentLibraryData) => (name === libraryName)
      )[0];

      const snippetsJSON = JSON.parse(fs.readFileSync(library.snippetsPath, 'utf-8'));

      const snippetsKeys: string[] = Object.keys(snippetsJSON);

      const groupedSnippets = [];
      const namesInGroups: string[] = [];

      for (let i = 0; i < snippetsKeys.length; i++) {
        const componentName = snippetsKeys[i].split(/[^a-zA-Z]+/)[0];

        if (!namesInGroups.includes(componentName)) {
          groupedSnippets.push({
            [componentName]: snippetsKeys.filter((snippetKey: string) => (
              snippetKey.split(/[^a-zA-Z]+/)[0] === componentName
            )).map((item: string) => (snippetsJSON[item]))
          });
        }

        namesInGroups.push(componentName);
      }

      return groupedSnippets.map(componentData => {
        const componentName = Object.keys(componentData)[0];

        const componentSnippetItems = componentData[componentName].map((snippet) => (
          new SnippetTreeItem(snippet.prefix, snippet.description, snippet.body)
        ));

        return new ComponentTreeItem(
          componentName, '', componentSnippetItems, TreeItemCollapsibleState.Collapsed);
      });
    }
};