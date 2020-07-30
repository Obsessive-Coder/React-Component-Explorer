import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';

export default class SnippetTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly snippet: string|string[]
  ) {
    super(label, TreeItemCollapsibleState.None);
  }

  get snippetString(): string {
    return typeof this.snippet === 'string' ? this.snippet : this.snippet.join('\n');
  }

  get tooltip():string {
    return `${this.label} - ${this.description}`;
  }

  // lastClick: number = new Date().getTime();
  lastClick: number = -1;

  command = {
    command: 'reactComponents.doubleClick',
    title:'Insert Component',
    arguments: [this]
};

  contextValue = 'componentSnippet';
};