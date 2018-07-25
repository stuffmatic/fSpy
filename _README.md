<p align="center"><img src="logo.png"></p>


## What is this?

fSpy is an open source, cross platform app for still image camera matching. See [fspy.io](https://fspy.io) for more info. The source code is available under the GPL license.

## Backstory

Once upon a time I wrote BLAM, a [Blender](https://blender.org) add-on for still image camera calibration that, despite its clunky UI, has gained some popularity in the Blender community. fSpy is an attempt to bring BLAM's functionality to a wider audience in the form of a stand alone app.

## Writing an exporter


Currently, fSpy only supports exporting camera parameters to [Blender](https://blender.org), but the code is structured so that adding new exporters should be fairly easy. The Blender exporter generates a python script that when run in Blender configures the selected camera. 

In theory, camera parameters computed by fSpy could be exported to any application that has a notion of a 3D camera and provides some way to programatically set the camera parameters.

fSpy supports exporting camera parameters as plain JSON data, which might be a good starting point for writing a new exporter, since you initially don't have to care about the fSpy code. 

If you are interested in working on a new exporter, [get in touch](https://github.com/stuffmatic/fSpy/issues)! 

## Running the app in development mode

fSpy is written in [Typescript](https://www.typescriptlang.org) using [Electron](https://electronjs.org), [React](https://reactjs.org) and [Redux](https://redux.js.org).

To install necessary dependencies, run

```
yarn
```

The `src` folder contains two subfolders `main` and `gui`, containing code for the [Electron main and renderer processes](https://electronjs.org/docs/tutorial/application-architecture) respectively. 

⚠️ The current build process is not ideal. For example, it lacks support for live reloading on main process code changes.

Here's how to run the app in development mode

1. Run `yarn dev-server` to start the dev server
2. Run `yarn build-dev` to build both the main and GUI code. This build step is needed to generate main process code used to start up the app.
3. Run `yarn electron-dev` to start an Electron instance which uses the dev server to provide automatic reloading on GUI code changes.

⚠️ Currently, changes to main process code requires a manual rebuild, i.e steps 2-3, in order to show up in the app.

## Creating binaries for distribution 

To create executables for distribution, run

```
yarn dist
```

which invokes [Electron builder](https://github.com/electron-userland/electron-builder).