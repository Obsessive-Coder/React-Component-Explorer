import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { SnippetTreeItem } from '.';

export default class ComponentTreeItem extends TreeItem {
  // This class extends TreeItem by adding an array of SnippetTreeItems.
  // Instances of this class are the component items in the tree view.
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly snippets: SnippetTreeItem[],
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
};