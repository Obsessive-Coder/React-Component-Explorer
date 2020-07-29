import {
  Event, EventEmitter, TreeDataProvider, TreeItem,
  TreeItemCollapsibleState, window,
} from 'vscode';

import { ComponentTreeItem, SnippetTreeItem } from '.';

import fs = require('fs');
import path = require('path');

export default class ComponentSnippetsProvider implements
  TreeDataProvider<TreeItem> {
    constructor(private workspaceRoot:  string) {}

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

    private getComponentLibraryItems(): ComponentTreeItem[] {
      let componentLibraryItems: string[] = [];

      const snippetsPath: string = path.join(this.workspaceRoot, '.vscode');
      const snippetLibraries: string[] = fs.readdirSync(snippetsPath, 'utf8');

      if (!snippetLibraries.length) { return []; }

      const libraryNames: string[] = snippetLibraries.filter((fileName: string) => (
        fileName.endsWith('.code-snippets')
      )).map((filename: string) => (
        filename.split('.code-snippets')[0]
      ));

      componentLibraryItems = componentLibraryItems.concat(libraryNames);

      return componentLibraryItems.map((libraryName: string) => (
        new ComponentTreeItem(libraryName, '', TreeItemCollapsibleState.Collapsed)
      ));
    }

    private getComponentItems(libraryName: string): SnippetTreeItem[] {
      const snippetsPath = path.join(this.workspaceRoot, '.vscode', `${libraryName}.code-snippets`);
      const snippetsJSON = JSON.parse(fs.readFileSync(snippetsPath, 'utf-8'));

      return Object.keys(snippetsJSON).map((snippetName: string) => (
        new SnippetTreeItem(snippetName, snippetsJSON[snippetName].description, snippetsJSON[snippetName].body)
      ));
    }

    private getDepsInPackageJson(packageJsonPath: string): ComponentTreeItem[] {
      if (this.isPathExisting(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        const toDep = (moduleName: string, version: string): ComponentTreeItem => {
          if (this.isPathExisting(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
            return new ComponentTreeItem(
              moduleName,
              version,
              TreeItemCollapsibleState.Collapsed
            );
          } else {
            return new ComponentTreeItem(
              moduleName, version, TreeItemCollapsibleState.None);
          }
        };

        const deps = packageJson.dependencies
          ? Object.keys(packageJson.dependencies).map(dep =>
              toDep(dep, packageJson.dependencies[dep])
            )
          : [];
        const devDeps = packageJson.devDependencies
          ? Object.keys(packageJson.devDependencies).map(dep =>
              toDep(dep, packageJson.devDependencies[dep])
            )
          : [];
        return deps.concat(devDeps);
      } else {
        return [];
      }
    }

    private isPathExisting(filePath: string): boolean {
      try {
        fs.accessSync(filePath);
      } catch (err) {
        return false;
      }
      return true;
    }
};