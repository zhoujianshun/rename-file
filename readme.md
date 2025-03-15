
## 功能介绍

- 使用字符串替换文件名中的指定字符串，包括文件夹
`rename-file replace <srcDir> <searchValue> <replaceString>`
- `--rmt`表示如果是视频文件，可以使用参数，判断是否同步修改视频metaData中的title为文件名
`rename-file replace <srcDir> <searchValue> <replaceString> --rmt`
- `--ufn`表示使用文件夹作为文件名
`rename-file replace <srcDir> <searchValue> <replaceString> --rmt --ufn`




## 创建cli工具的步骤

1. 创建package.json文件，创建入口文件index.js，本案例放在了bin文件夹中
在文件头部添加以下代码
```javascript
#!/usr/bin/env node
```
2. 在package.json中配置bin
```json
  "bin": {
    "rename-file": "./bin/index.js"
  },
```
3. 控制台执行`npm link`建立软链接

4. 控制台就可以执行`rename-file`命令
