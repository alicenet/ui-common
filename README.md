# alice-ui-common (alice/ui-common)

This library should be used to abstract common user interface code to. 

If you find yourself writing large code specs across the /ui codebase to accomplish similar tasks, it is highly likely that code should exist here instead.

## How to develop locally

To avoid issues with needing to eject create-react-app and improve readability of the common code abstraction we have opted to keep the common modules package separate of the [/ui repository](https://github.com/alicenet/ui) and to write the code contained in this library in TypeScript

Follow the below directions to develop this codebase locally against a local running [alicenet/ui](https://github.com/alicenet/ui) application.


### Setup

1. Clone the repository `git clone git@github.com:alicenet/ui.git`
2. Enter the directory and install all dependencies with `yarn`
3. To avoid issues with create-react-app create an **npm link** to the node_modules/react within /ui


```
~/alice-ui-common/
    ...
~/ui/
    ...
```

- You would run `npm link ../ui/node_modules/react` to link the ui-common react package to the one in `/ui`
  - Please note `yarn link` will not play nicely with this to the best of my knowledge

4. You do however use yarn link to link the module itself
   1. Within `/ui-common` run `yarn link`
   2. Then under `/ui` run `yarn link alice-ui-common`
5. After everything is linked run `yarn develop` to watch the local files and build as necessary
6. Within `/ui` run your application as per usual and alice-ui-common should both be available as normal but also support React Fast-Refresh after changes are made and compiled from the `yarn develop` watcher.

## Submitting changes

Submit changes as per usual, however please be sure to include a latest `dist` build.