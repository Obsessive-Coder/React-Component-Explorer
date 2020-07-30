import {
  Event, EventEmitter, TreeDataProvider, TreeItem,
  TreeItemCollapsibleState, window
} from 'vscode';

import { ComponentTreeItem, SnippetTreeItem } from '.';
import { IComponentLibraryData } from '../interfaces';
import { FILE_PATH_REGEX } from '../utils/constants';

import fs = require('fs');

export default class ComponentSnippetsProvider implements
  TreeDataProvider<TreeItem> {
    // componentLibraries: IComponentLibraryData[] = [];

    constructor(private workspaceRoot:  string, public componentLibraries: IComponentLibraryData[]) {
      // this.componentLibraries = componentLibraries;
    }

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

      const treeItems: TreeItem[] = element ? (
        this.getComponentItems(element.label)) : this.getComponentLibraryItems();

      return Promise.resolve(treeItems);
    }

    getComponentLibraryItem(snippetsPath: string) {
      const pathFolders: string[] = snippetsPath.split(FILE_PATH_REGEX);
      const fileName: string = pathFolders[pathFolders.length - 1];
      const libraryName: string = fileName.split('.')[0];

      return new ComponentTreeItem(libraryName, '', TreeItemCollapsibleState.Collapsed);
    }

    private getComponentLibraryItems(): ComponentTreeItem[] {
      const libraryNames: string[] = this.componentLibraries.map(
        ({ name }: IComponentLibraryData) => name);

      return libraryNames.map((libraryName: string) => (
        new ComponentTreeItem(libraryName, '', TreeItemCollapsibleState.Collapsed)
      ));
    }

    private getComponentItems(libraryName: string): SnippetTreeItem[] {
      // const snippetsPath = path.join(this.workspaceRoot, '.vscode', `${libraryName}.code-snippets`);

      const library: IComponentLibraryData = this.componentLibraries.filter(
        ({ name }: IComponentLibraryData) => (name === libraryName)
      )[0];

      const snippetsJSON = JSON.parse(fs.readFileSync(library.snippetsPath, 'utf-8'));

      return Object.keys(snippetsJSON).map((snippetName: string) => (
        new SnippetTreeItem(snippetName, snippetsJSON[snippetName].description, snippetsJSON[snippetName].body)
      ));
    }
};