'use strict'

const gulp = require('gulp')
const fs = require('fs')
let arrFileNames = []

// 自动生成/index.js文件（手动生成该文件太麻烦了-_-）
gulp.task('generateIndexJS', () => {
  const srcArr = ['./*.js', '!./*.default.js', '!./function.js', '!./index.js', '!./gulpfile.js']
  return gulp.src(srcArr)
    .on('data', file => {
      const filePath = file.history[0]
      const fileName = filePath.split(/[\\/]/).reverse()[0]
      arrFileNames.push(fileName)
    })
    .on('end', function () {
      let textToWrite = '// this file is generated by gulp task ^_^\n' +
        '\n' +
        arrFileNames.map(fileName => {
          return `import ${fileName.replace('.js', '')} from './${fileName}'`
        }).join('\n') +
        '\n\n' +
        'export default {\n' +
        arrFileNames.map(fileName => {
          return '  ' + fileName.replace('.js', '')
        }).join(',\n') +
        '\n}\n'
      fs.writeFile('./index.js', textToWrite, {
        flag: 'w',
        encoding: 'utf-8',
        mode: '0666'
      }, function (err) {
        if (err) {
          console.log("文件写入失败")
        } else {
          console.log("文件写入成功");
        }
      })
    })
})
