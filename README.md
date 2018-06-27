# fSpy

## What is this?

fSpy is an open source, cross platform app for still image camera matching. See [fspy.io](https://fspy.io) for more info. The source code is available under the GPL license.

## Backstory

Once upon a time, I wrote BLAM, a still image camera calibration add-on for [Blender](https://blender.org), that has gained some popularity in the Blender community. Apart from the obvious shortcoming of being Blender specific, the add-on's UI is pretty clunky, requires some manual steps to show the effect of a user's changes etc etc. fSpy is meant to replace BLAM by providing the same core functionality in a stand alone app with a much improved UI.

## Writing an exporter

Currently, fSpy only supports exporting camera parameters to [Blender](https://blender.org), but the code is structured so that adding new exporters should be fairly easy. If you are interested in working on a new exporter, [get in touch](https://github.com/stuffmatic/fSpy/issues)!

In theory, camera parameters computed by fSpy could be exported to any application that has a notion of a 3D camera and provides some kind of scripting interface. The current Blender exporter, for example, generates a python script that when run in Blender configures the selected camera.

fSpy supports exporting camera parameters as plain JSON data, which might be a good starting point for writing a new exporter, since you initially don't have to care about the fSpy code.

## Building and running

fSpy is written in [Typescript](https://www.typescriptlang.org) using [Electron](https://electronjs.org), [React](https://reactjs.org) and [Redux](https://redux.js.org).

To install necessary dependencies, run

```
yarn
```

TODO: yarn build-dev

The dev server, which handles automatic rebuilding of the source for the Electron GUI process, is started like so:

```
yarn run dev-server
```

Once the dev server is up an running, open a new terminal tab and run

```
yarn run electron-dev
```

which should open the app in development mode. Any changes to GUI process code will trigger a rebuild followed by an app reload.

Note that the dev server currently does not RELOAD [TODO] the source for the electron main process. This means that any changes to main process code have to be manually rebuilt using `yarn run build-dev`.

To create executables for distribution, run

```
yarn dist
```

which invokes [Electron builder](https://github.com/electron-userland/electron-builder).