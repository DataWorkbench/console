### console 本地 docker 环境搭建

- 需要安装`docker` `docker-compose`
- 项目应该与`web_console`项目在同一级目录结构中
- 需要手动在当前目录增加 `web_console_settings.py`

### 主要功能包括

- 读取当前目录下的`web_console_settings.py`来作为 console 的配置(web_console_settings.py 配置较敏感,可以找项目所有者来索取)
- 启动一个 memcached 的容器来保存 session 状态(仅 dev 模式)
- 默认 nginx 配置的宿主 PORT 为 8888
- 映射 nginx、memcahed 配置信息到容器内,方便修改(一般默认就可以)

### console 路径配置

部署在 tesing 环境时候有分三个文件夹`docker` `pitrix-webconsole` `pitrix-webconsole`

```yaml
# .env文件

# 本地console
CONSOLE_SRC=../../pitrix-webconsole/src
SRC=..
NGINX_EXPOSE_PORT=8888

# testing等环境
CONSOLE_SRC=../pitrix-webconsole
SRC=../pitrix-webconsole-dataomnis
NGINX_EXPOSE_PORT=80
```

### 启动方式

```bash
# npm 方式
npm run start:console
npm run stop:console
# 手动启动
cd docker
# 启动
docker-compose up -d
# 停止
docker-compose stop
# 其他命令参数可参考官方文档
```
