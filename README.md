# 大数据工作台开发流程

## 安装

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

## 项目向服务端发送请求经过 console 中转,需要启动 console 服务

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
