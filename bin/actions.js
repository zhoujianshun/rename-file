const { renameFiles } = require('./utils');

/**
 * 替换文件名
 * @param {*} srcDir 
 * @param {*} searchValue 
 * @param {*} replaceString 
 * @param {*} options 
 */
const replaceFileName = (srcDir, searchValue, replaceString, options) => {
  console.log(srcDir, searchValue, replaceString, options);
  renameFiles(srcDir, searchValue, replaceString, options);
}

// /**
//  * 使用文件夹作为文件名
//  * @param {*} srcDir 
//  * @param {*} options 
//  */
// const renameUseFolderName = (srcDir, options) => {

// }



module.exports = {
  replaceFileName
}