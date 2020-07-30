import { OpenDialogOptions } from 'vscode';

const FILE_PATH_REGEX: RegExp = /[/\\]/;

const DEFAULT_OPEN_OPTIONS: OpenDialogOptions = {
  canSelectFiles: true,
  canSelectFolders: false,
  canSelectMany: false,
};

export {
  FILE_PATH_REGEX,
  DEFAULT_OPEN_OPTIONS,
};

export default {
  FILE_PATH_REGEX,
  DEFAULT_OPEN_OPTIONS,
};