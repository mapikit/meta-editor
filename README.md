# About meta-editor

meta-editor is a GUI tool used for building systems quickly and more efficiently, using meta-system as its engine.

Meta editor is made with svelte and electron.

## Developing

As usual, before you start, remember to run 
```bash
npm install
```

Meta editor has two development modes which can be accessed with the following commands 

```bash
# Start a vite dev server that can be accessed trough a browser.
npm run dev

# Start a vite dev server as well an electron instance.
npm run dev-electron
```
> Note: In both cases changes to meta-editor frontend will automatically reload the view, EXCEPT for changes to the electron files. These will require you to relaunch the app entirely.

## Building

Similarly, meta-editor can be built with two commands:

```bash
# Build the application with vite.
npm run build

# Build the vite part of the application as well as electron components.
npm run build-electron
```
> Note: Building is not the same as packaging and that will be worked on in the future
