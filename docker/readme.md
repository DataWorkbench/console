# console-builder

console npm编译的时候需要从公司内网下载依赖，但内网需要 boss vpn 访问；\
为了在没有 vpn 的环境可以编译，builder 镜像主要是保存 console npm编译过缓存目录 node_modules；然后给在没有内网访问环境构建 console 镜像用；

<<<<<<< HEAD
此镜像是通过基于 node:16.14.2-buster 构建的，构建环境必须是可以连接 Boss vpn，构建命令：

```bash
docker build -t dockerhub.dev.data.qingcloud.link/dataomnis/console-builder:v0.9.0 -f ./docker/Dockerfile.builder .
=======
此镜像是通过基于 node:16.14.2-buster 构建的，构建环境必须是可以连接 Boss vpn，
配置hosts:
```bash
172.16.0.60 npm.internal.yunify.com r.npm.internal.yunify.com
```

构建命令：

```bash
docker build -t dockerhub.dev.data.qingcloud.link/dataomnis/console-builder:v1.0.0 -f ./docker/Dockerfile.builder .
>>>>>>> e4553b424ea25a5c2d47eded5f3265b07fab7b9c
```


# console

此镜像是基于上面的 builder 构建的，命令：

```bash
<<<<<<< HEAD
docker build -t dockerhub.dev.data.qingcloud.link/dataomnis/console:v0.9.0 -f ./docker/Dockerfile .
=======
docker build -t dockerhub.dev.data.qingcloud.link/dataomnis/console:v1.0.0 -f ./docker/Dockerfile .
>>>>>>> e4553b424ea25a5c2d47eded5f3265b07fab7b9c
```
