import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export default class ComponentTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip():string {
    return `${this.label} - ${this.description}`;
  }

  contextValue = 'componentLibrary';
};