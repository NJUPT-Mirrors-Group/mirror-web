---
layout: help
category: help
mirrorid: bioarchlinux
---

## BioArchLinux 镜像使用帮助

本帮助翻译自[官方文档](https://wiki.bioarchlinux.org/index.php?title=Usage)

### 第一次使用
向`/etc/pacman.conf`中添加如下内容

```
[bioarchlinux]
Server = {{ site.url }}/bioarchlinux/
```

然后导入GPG密钥
```
pacman-key --recv-keys B1F96021DB62254D
pacman-key --finger B1F96021DB62254D
pacman-key --lsign-key B1F96021DB62254D
```

### 接下来的使用
向`/etc/pacman.conf`中添加如下内容

```
[bioarchlinux]
Server = {{ site.url }}/bioarchlinux/$arch
```
