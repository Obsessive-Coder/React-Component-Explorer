import { OpenDialogOptions } from 'vscode';

const FILE_PATH_REGEX: RegExp = /[/\\]/;
const SNIPPET_NAME_REGEX: RegExp = /[^a-zA-Z]+/;

const DOUBLE_CLICK_MILLISECONDS: number = 500;

const WORKSPACE_STATE_PROPERTY: string = 'componentLibraries';
const TREE_VIEW_ID: string = 'reactComponents';
const CODE_SNIPPET_EXTENSION: string = '.code-snippets';

// Tree item context values.
const LIBRARY_TREE_ITEM_CONTEXT: string = 'componentLibrary';
const SNIPPET_TREE_ITEM_CONTEXT: string = 'componentSnippet';

// Command names and titles.
const ADD_LIBRARY_COMMAND: string = `${TREE_VIEW_ID}.addLibrary`;
const DOUBLE_CLICK_COMMAND: string = `${TREE_VIEW_ID}.doubleClick`;
const DOUBLE_CLICK_COMMAND_TITLE: string = 'Insert Component';
const INSERT_SNIPPET_COMMAND: string = `${TREE_VIEW_ID}.insertComponent`;
const REFRESH_COMMAND: string = `${TREE_VIEW_ID}.refresh`;
const REMOVE_LIBRARY_COMMAND: string = `${TREE_VIEW_ID}.removeLibrary`;

const DEFAULT_OPEN_OPTIONS: OpenDialogOptions = {
  canSelectFiles: true,
  canSelectFolders: false,
  canSelectMany: false,
};

export {
  FILE_PATH_REGEX,
  SNIPPET_NAME_REGEX,
  DOUBLE_CLICK_MILLISECONDS,
  WORKSPACE_STATE_PROPERTY,
  TREE_VIEW_ID,
  CODE_SNIPPET_EXTENSION,
  LIBRARY_TREE_ITEM_CONTEXT,
  SNIPPET_TREE_ITEM_CONTEXT,
  ADD_LIBRARY_COMMAND,
  DOUBLE_CLICK_COMMAND,
  DOUBLE_CLICK_COMMAND_TITLE,
  INSERT_SNIPPET_COMMAND,
  REFRESH_COMMAND,
  REMOVE_LIBRARY_COMMAND,
  DEFAULT_OPEN_OPTIONS,
};

export default {
  FILE_PATH_REGEX,
  SNIPPET_NAME_REGEX,
  DOUBLE_CLICK_MILLISECONDS,
  WORKSPACE_STATE_PROPERTY,
  TREE_VIEW_ID,
  CODE_SNIPPET_EXTENSION,
  LIBRARY_TREE_ITEM_CONTEXT,
  SNIPPET_TREE_ITEM_CONTEXT,
  ADD_LIBRARY_COMMAND,
  DOUBLE_CLICK_COMMAND,
  DOUBLE_CLICK_COMMAND_TITLE,
  INSERT_SNIPPET_COMMAND,
  REFRESH_COMMAND,
  REMOVE_LIBRARY_COMMAND,
  DEFAULT_OPEN_OPTIONS,
};