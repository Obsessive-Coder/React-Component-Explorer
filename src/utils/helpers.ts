import { IComponentLibraryData } from '../interfaces';
import { CODE_SNIPPET_EXTENSION, FILE_PATH_REGEX } from './constants';
import path = require('path');

export default {
  GET_LIBRARY_DATA: (folderPath: string): IComponentLibraryData => {
    // Get the name of the selected file from the selected path.
    const pathFolders: string[] = folderPath.split(FILE_PATH_REGEX);
    const filename: string =
      pathFolders[pathFolders.length - 1].split(CODE_SNIPPET_EXTENSION)[0];

    // Store the filename and selected path.
    return {
      name: filename,
      snippetsPath: path.join(...pathFolders),
    };
  }
};