import { Command, TreeItem, TreeItemCollapsibleState, SnippetString } from 'vscode';
import {
  DOUBLE_CLICK_COMMAND, DOUBLE_CLICK_COMMAND_TITLE,
  SNIPPET_TREE_ITEM_CONTEXT,
} from '../utils/constants';

export default class SnippetTreeItem extends TreeItem {
  // This class extends the TreeItem by adding a snippet property.
  // Instances of this class are the snippet items in the tree view.
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly snippet: string|string[]
  ) {
    super(label, TreeItemCollapsibleState.None);
  }

  // Join the array from the snippet's body, or the snippet string itself.
  get snippetString(): SnippetString {
    const { snippet }: { snippet: string|string[] } = this;
    const snippetString: string = Array.isArray(snippet) ? snippet.join('\n') : snippet;
    return new SnippetString(snippetString);
  }

  // Used for double click timing on a snippet item.
  lastClick: number = -1;

  // Register the command for when the snippet item is double clicked.
  command: Command = {
    command: DOUBLE_CLICK_COMMAND,
    title: DOUBLE_CLICK_COMMAND_TITLE,
    arguments: [this]
  };

  // Restricts the insert component button to this tree item.
  contextValue = SNIPPET_TREE_ITEM_CONTEXT;
};