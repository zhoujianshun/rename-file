const fs = require('fs')
const path = require('path')

// 将文件重命名功能封装为异步函数
async function renameFiles(dirPath, oldStr, newStr, options) {

  // renameMetaTitle 是否同步修改视频metaData中的title为文件名
  // useFolderName 是否使用文件夹作为文件名
  const {renameMetaTitle, useFolderName} = options
  try {
    // 读取目录内容
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true })

    // 遍历所有文件和文件夹
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)
      // 如果是文件夹，递归处理
      if (file.isDirectory()) {
        await renameFiles(fullPath, oldStr, newStr, options)

        // 如果文件夹名包含要替换的字符串，也重命名文件夹
        if (file.name.includes(oldStr)) {
          const newDirName = file.name.replace(new RegExp(oldStr, 'g'), newStr)
          const newDirPath = path.join(dirPath, newDirName)
          await fs.promises.rename(fullPath, newDirPath)
          console.log(`成功将文件夹 ${file.name} 重命名为 ${newDirName}`)
        }
      }
      // 如果是文件且文件名包含要替换的字符串
      else if (!useFolderName && file.name.includes(oldStr)) {
        const newFileName = file.name.replace(new RegExp(oldStr, 'g'), newStr)
        const newPath = path.join(dirPath, newFileName)
        await fs.promises.rename(fullPath, newPath)
        console.log(`成功将文件 ${file.name} 重命名为 ${newFileName}`)
        if (renameMetaTitle) {
          renameVideoMetaDataTitle(newPath)
        }
      } else {
        if (useFolderName) {
          // 使用文件夹作为文件名
          // 获取当前文件夹的名字
          const dirName = path.basename(dirPath)
          const fileExtension = path.extname(fullPath).toLowerCase();
          console.log({
            file,
            dirPath,
            dirName
          });

          const newFileName = dirName + fileExtension
          const newPath = path.join(dirPath, newFileName)
          await fs.promises.rename(fullPath, newPath)
          console.log(`成功将文件 ${file.name} 重命名为 ${newFileName}`)
          
          if (renameMetaTitle) {
            console.log(newPath);
            renameVideoMetaDataTitle(newPath)
          }
        }else{
          if (renameMetaTitle) {
            renameVideoMetaDataTitle(fullPath)
          }
        }

     
        // 获取文件修饰
        // const fileStat = await fs.promises.stat(fullPath);
        // console.log(fileStat);
      }
    }
  } catch (err) {
    console.error('处理文件时发生错误：', err)
  }
}


/**
 *
 * @param {*} filePath
 */
async function renameVideoMetaDataTitle(filePath) {
  // 修改视频的metaData中的title
  // 检查文件是否是视频文件
  const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov']
  const fileExt = path.extname(filePath).toLowerCase()
  if (videoExtensions.includes(fileExt)) {
    try {
      // 使用 ffmpeg 修改视频元数据中的标题
      const { execSync } = require('child_process')
      const newTitle = path.basename(filePath, fileExt)

      // 创建临时文件
      const tempFile = `${filePath}.temp${fileExt}`

      // 使用 ffmpeg 修改元数据
      const command = `ffmpeg -i "${filePath}" -metadata title="${newTitle}" -codec copy "${tempFile}"`
      execSync(command)

      // 替换原文件
      await fs.promises.rename(tempFile, filePath)

      console.log(`成功修改视频 ${filePath} 的标题为 ${newTitle}`)
    } catch (error) {
      console.error(`修改视频元数据失败：${error.message}`)
    }
  }
}

module.exports = {
  renameFiles
}
