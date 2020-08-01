import ISnippet from './ISnippet';

export default interface IGroupedSnippetData {
  [index: string]: Array<ISnippet>
};