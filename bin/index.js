#!/usr/bin/env node

const { replaceFileName } = require('./actions')
const { Command } = require('commander')
const program = new Command()

program.name('rename-file').description('CLI to rename file').version('0.1.0')

// 替换文件名
program
  .command('replace')
  .description('replace file name')
  .argument('<srcDir>', '重命名文件夹中的文件')
  .argument('<searchValue>', '要替换的字符串')
  .argument('[replaceString]', '新的字符串，不填则删除')
  .option('-r, --rename-meta-title', '是否同步修改视频metaData中的title为文件名')
  .option('-u, --use-folder-name', '是否使用文件夹作为文件名')
  .action((srcDir, searchValue, replaceString = '', options) => {
    replaceFileName(srcDir, searchValue, replaceString, options)
  })

// // 使用文件夹作为文件名
// program
//   .command('usefolder')
//   .description('use folder as file name')
//   .argument('<srcDir>', '重命名文件夹中的文件')
//   .option('--rmt', '是否同步修改视频metaData中的title为文件名')
//   .action((srcDir, options) => {
//     replaceFileName(srcDir, searchValue, replaceString, options)
//   })

program.parse()
