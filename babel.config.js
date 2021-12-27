module.exports = function (api) {
  api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['chrome >= 63', 'firefox >= 68'],
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          root: ['./'],
          alias: {
            '@app': './app',
            '@shared': './shared',
            '@view': './view',
            '@c': './view/components',
            '@pages': './view/pages',
            '@reducer': './view/reducer',
            '@selectors': './view/selectors',
            '@wallet-provider': './wallet-provider',
          },
        },
      ],
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  }
}
