const path = require('path');
const fs = require('fs');
const babelParser = require('@babel/parser');
const babelGenerator = require('@babel/generator');
const babelTraverse = require('@babel/traverse').default;
const prettier = require('prettier');

const walk = require('./walk');

const cwd = process.cwd();
const nodeModules = path.resolve(cwd, 'node_modules');

const sortImport = (file) => {
  const content = fs.readFileSync(file, 'utf8');

  const ast = babelParser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'flow', 'classProperties']
  });

  const deps = [];

  babelTraverse(ast, {
    ImportDeclaration(path) {
      deps.push(path.node.source.value);
    }
  });

  console.log(deps)
};

walk.sync(path.resolve(cwd, 'view'), (path, stat) => {
  if (stat.isFile() && /.js$/.test(path)) {
    sortImport(path);
  }
});
