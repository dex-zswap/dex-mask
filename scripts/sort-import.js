const path = require('path')
const fs = require('fs')
const babelParser = require('@babel/parser')
const { default: babelGenerator } = require('@babel/generator')
const { default: babelTraverse } = require('@babel/traverse')
const prettier = require('prettier')

const walk = require('./walk')

const cwd = process.cwd()
const nodeModules = path.resolve(cwd, 'node_modules')
const jsConfig = require(path.resolve(cwd, 'jsconfig.json'))
const packageJson = require(path.resolve(cwd, 'package.json'))

const reactOrders = [
  'react',
  'react-dom',
  'react-router-dom',
  'react-redux',
  'redux',
  '@reduxjs/toolkit',
]

const jsConfigOrders = Object.keys(jsConfig.compilerOptions.paths).sort()
const packageOrders = Object.keys(packageJson.dependencies).sort()

const sortImport = (file) => {
  try {
    const content = fs.readFileSync(file, 'utf8')

    const ast = babelParser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'flow', 'classProperties'],
    })

    const deps = []
    const newDeps = []

    let findTmp, findIndex, newCodeContent

    babelTraverse(ast, {
      ImportDeclaration(path) {
        deps.push({
          value: path.node.source.value,
          path,
        })
      },
    })

    if (deps.length) {
      console.log(
        [file, '扫描完成。共发现: ', deps.length, '处依赖导入'].join(''),
      )

      reactOrders.forEach((order) => {
        findIndex = deps.findIndex(({ value }) => value === order)
        if (findIndex > -1) {
          findTmp = deps[findIndex]
          newDeps.push(findTmp.path.node)
          deps.splice(findIndex, 1)
        }
      })

      if (deps.length) {
        packageOrders.forEach((order) => {
          findIndex = deps.findIndex(({ value }) => value === order)
          if (findIndex > -1) {
            findTmp = deps[findIndex]
            newDeps.push(findTmp.path.node)
            deps.splice(findIndex, 1)
          }
        })
      }

      if (deps.length) {
        jsConfigOrders.forEach((order) => {
          findIndex = deps.findIndex(({ value }) => value === order)
          if (findIndex > -1) {
            findTmp = deps[findIndex]
            newDeps.push(findTmp.path.node)
            deps.splice(findIndex, 1)
          }
        })
      }

      if (deps.length) {
        deps.forEach(({ path }) => {
          newDeps.push(path.node)
        })
      }

      console.log([file, '依赖排序完成, 正在写入文件.'].join(''))

      ast.program.body = newDeps.concat(
        ast.program.body.filter(({ type }) => type !== 'ImportDeclaration'),
      )
      newCodeContent = babelGenerator(ast)

      fs.writeFileSync(file, newCodeContent.code, 'utf8')
      console.log([file, '文件写入完成.'].join(''))
    }
  } catch (e) {
    console.log([file, '发生异常, 已跳过.'])
  }
}

walk.sync(path.resolve(cwd, 'view'), (path, stat) => {
  if (stat.isFile() && /.js$/.test(path)) {
    sortImport(path)
  }
})
