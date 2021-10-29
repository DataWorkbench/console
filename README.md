# 大数据工作台开发流程

## 安装说明

项目开发用的 node 的版本 v14.17.0

项目部分 ui 用到 qingcloud-portal-ui, 例如全局导航等, 需要连到 BOSS 的 VPN

推荐用 vscode 安装.vscode 相关扩展和设置,以获取 tailwindcss 的样式提示以及代码格式化相关功能

```bash
#设置 @QCFE 的 registry
npm config set @QCFE:registry http://172.16.0.60:7001

cd 项目目录
npm i
# 启动前端开发服务器
npm run dev
```

大数据工作台是 console 的子项目模式来开发的

所以登录、接口转发是依赖于 console 项目的运行
具体请参考[子 Portal 开发文档](https://cwiki.yunify.com/pages/viewpage.action?pageId=63358627)

### 项目说明

- 全局状态管理: `mobx`
- 异步数据查询: `react-query`
- hooks 工具库: `react-use`
- 样式管理: `twin.macro` tailwindcss + emotion

### 插件安装

项目采用的 taiwindcss 框架,需要增加样式提示可参考项目`extensions.json`(默认第一次打开会提示安装)

```bash
cd $project
#
echo 'PROXY_API_URL=http://139.198.116.233' > .env

```

## console 远程环境

推荐: 🌟🌟🌟🌟🌟

优点: 快速方便,无需本地部署 console 本地环境,通过 devserver 的 proxy 配置来访问 api 接口

缺点: 依赖远程开发服务器的稳定性

### API Server URL 的配置

devserver 默认配置代理配置是`http://localhost:8888`,

如本地无 console 环境,可访问测试机 API 接口

```bash
# 进入当前工作空间根目录下
cd $project
# 如根目录有配置,会覆盖默认devserver的proxy server 默认测试机IP: 139.198.116.233
# 未配置时默认为 http://localhost:8888
echo 'PROXY_API_URL=http://139.198.116.233' > .env
```

## console docker 环境

推荐: 🌟🌟🌟🌟

优点: 快速方便,无需本地安装 django 依赖

缺点: mac 机器运行 docker 性能不高,依赖机器性能

在 mac 机器上安装 console 环境会比较麻烦,如果机器性能还行,可以尝试 docker 环境来安装

详情安装方法见`docker/README`

为了避免 mac 因为安全问题禁用 80 端口的问题, 默认容器提供对外端口为 8888

## console 本地环境

推荐: 🌟🌟🌟

优点: 安装好之后,启动 django 内置服务器,占系统资源少,启动迅速

缺点: 安装依赖繁琐,难度较大

本地安装步骤详见`console`项目[本地搭建控制台开发环境](https://cwiki.yunify.com/pages/viewpage.action?pageId=23687305)

```bash
git clone git@git.internal.yunify.com:Simon/pitrix-webconsole.git
cd pitrix-webconsole
# 新建一个分支来开发
git checkout -b feat/bigdata
# 安装项目环境相关python的依赖包
# 配置本地开发的 local_config.yaml
# 然后进入目录启动开发服务, 启动python开发服务
cd src
python manage.py runserver 8888
```
