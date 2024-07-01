## 开发

```bash

# 进入项目目录
cd factoring-ui-v3

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 地址选择器数据

```bash
# 页面导入数据
import { provinceAndCityData, regionData, pcTextArr, pcaTextArr, codeToText } from "element-china-area-data"

# 导入数据说明
1、provinceAndCityData: 省市二级联动数据,汉字+code
2、regionData: 省市区三级联动数据
3、pcTextArr: 省市联动数据，纯汉字
4、pcaTextArr: 省市区联动数据，纯汉字
5、codeToText: 是个大对象，属性是区域码，属性值是汉字 用法例如：codeToText['110000']输出北京市
```

## 新增日期格式化插件 dayjs 用法类似 momentjs
```bash
# 引入dayjs
npm install dayjs --save 

# 官方文档 https://dayjs.fenxianglu.cn/
# 使用参考文档 https://www.jianshu.com/p/ed20fb23e658