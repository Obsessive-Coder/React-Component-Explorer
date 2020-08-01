# React Component Explorer

Shows a list of React components in a sidebar panel and allows you to quickly add the component to your file.

# How It Works

The list of components are populated from a VS Code snippets file. When you insert a component, its snippet is used to add it to the code editor.

* Use existing component library snippets from the marketplace.
* Use my other extension [React Snippet Generator](https://marketplace.visualstudio.com/items?itemName=ObsessiveCoder.react-snippet-generator) to generate snippets for your custom React component libraries.
* In theory this extension should work with any  valid VS Code `.code-snippets` file.

# Usage

1. Use the new icon on the sidebar to show the components explorer.
2. Click the `Add Component Library` button.
3. Choose the VS Code `.code-snippets` for your component library.
4. Find your component in the list and add it to the file by clicking the `+` button.

![Alt Text](./resources/example.gif)

# Coming Soon

* Unit tests
* Change Log
* Allow generating snippets from the explorer panel if [React Snippet Generator](https://marketplace.visualstudio.com/items?itemName=ObsessiveCoder.react-snippet-generator) is installed.
* Drag-n-Drop from component explorer to file.
* Pre-populate with popular React component libraries.