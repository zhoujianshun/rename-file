#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 获取命令行参数
const targetDir = process.argv[2] // 目标文件夹路径
const oldStr = process.argv[3] // 要替换的字符串
const newStr = process.argv[4] || '' // 新的字符串

/***
 *
 * 重名称文件夹中的文件
 * 用例：node renameFile.js  '/Users/zhoujianshun/Downloads/学习视频/108-webpack' '【www.ruike1.com】'
 */

// 将文件重命名功能封装为异步函数
async function renameFiles(dirPath, oldStr, newStr) {
  try {
    // 读取目录内容
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true })

    // 遍历所有文件和文件夹
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)
      // 如果是文件夹，递归处理
      if (file.isDirectory()) {
        await renameFiles(fullPath, oldStr, newStr)

        // 如果文件夹名包含要替换的字符串，也重命名文件夹
        if (file.name.includes(oldStr)) {
          const newDirName = file.name.replace(new RegExp(oldStr, 'g'), newStr)
          const newDirPath = path.join(dirPath, newDirName)
          await fs.promises.rename(fullPath, newDirPath)
          console.log(`成功将文件夹 ${file.name} 重命名为 ${newDirName}`)
        }
      }
      // 如果是文件且文件名包含要替换的字符串
      else if (file.name.includes(oldStr)) {
        const newFileName = file.name.replace(new RegExp(oldStr, 'g'), newStr)
        const newPath = path.join(dirPath, newFileName)
        await fs.promises.rename(fullPath, newPath)
        console.log(`成功将文件 ${file.name} 重命名为 ${newFileName}`)
      } else {
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
  const fileExt = path.extname(newPath).toLowerCase()
  if (videoExtensions.includes(fileExt)) {
    try {
      // 使用 ffmpeg 修改视频元数据中的标题
      const { execSync } = require('child_process')
      const newTitle = path.basename(newPath, fileExt)

      // 创建临时文件
      const tempFile = `${newPath}.temp${fileExt}`

      // 使用 ffmpeg 修改元数据
      const command = `ffmpeg -i "${newPath}" -metadata title="${newTitle}" -codec copy "${tempFile}"`
      execSync(command)

      // 替换原文件
      await fs.promises.rename(tempFile, newPath)

      console.log(`成功修改视频 ${newFileName} 的标题为 ${newTitle}`)
    } catch (error) {
      console.error(`修改视频元数据失败：${error.message}`)
    }
  }
}
// 主程序
async function main() {
  // 检查参数是否完整
  if (!targetDir || !oldStr) {
    console.log('请提供完整的参数：')
    console.log(
      '用法: node renameFiles.js <目标文件夹> <要替换的字符串> <新的字符串（可选）>'
    )
    process.exit(1)
  }

  // 检查目标文件夹是否存在
  if (!fs.existsSync(targetDir)) {
    console.log('错误：目标文件夹不存在！')
    process.exit(1)
  }

  // 开始处理文件
  console.log('开始处理文件...')
  await renameFiles(targetDir, oldStr, newStr)
  console.log('处理完成！')
}

// 运行主程序
main().catch((err) => {
  console.error('程序执行出错：', err)
  process.exit(1)
})
