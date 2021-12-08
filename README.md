# DexMask Wallet
---
The Offcial Chrome Extention Wallet for Dex Chain's Users and other chains.

## Building locally

- Install [Node.js](https://nodejs.org)
    - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn](https://yarnpkg.com/en/docs/install)
- Install dependencies: `yarn setup` (not the usual install command)
- Copy the `.dexmaskrc.dist` file to `.dexmaskrc`
    - Replace the `INFURA_PROJECT_ID` value with your own personal [Infura Project ID](https://infura.io/docs).
    - If debugging MetaMetrics, you'll need to add a value for `SEGMENT_WRITE_KEY` [Segment write key](https://segment.com/docs/connections/find-writekey/).
- Build the project to the `./dist/` folder with `yarn dist`.

Uncompressed builds can be found in `/dist`, compressed builds can be found in `/builds` once they're built.

## Custom Path Alias

- If you want to add your custom path alias, modify the the alias config of `babel-plugin-module-resolver` in file `babel.config.js`, and modify the `paths` config in `jsconfig.json`.
- Here is exist path alias

| Alias   |Project Root Path      |
|----------|-------------|
|`@app` |`./app` |
|`@shared` |`./shared` |
|`@view` |`./view` |
|`@wallet-provider` |`./wallet-provider` |


## Build release package

- To build a release package run `yarn dist` command

### Development builds

- To start a development build (e.g. with logging and file watching) run `yarn start` command.
- If you want to Debug React Components (e.g. debug props or state) run `yarn start:dev` command. Then React DevTools will opened in new window.

### Technology stack

- JavaScript
- React(Hooks)
- Redux
- Sass
- Gulp
- Web3.js
To start a development build (e.g. with logging and file watching) run `yarn start`.
