# 待办小镇

像素风每日待办：完成任务获得家具，收集 64 款物品、门窗、墙纸和伙伴，点击家具后点空地移动。

## 安卓安装
用 Chrome 打开 https://debbie-anan.github.io/todo-pixel-town/ ，点击页面“安装到手机”或浏览器菜单“安装应用 / 添加到主屏幕”。这是可安装的 PWA，不是 APK。首次联网加载后支持离线使用。

## 本地运行
用任意静态 HTTP 服务器提供仓库根目录，例如 `python -m http.server 8000`。打开 http://localhost:8000 。无需编译。

## 发布
GitHub Pages 从 main 分支根目录发布。更新网页后须同步修改 sw.js 的 CACHE 版本，使离线缓存刷新。

## 数据
待办、奖励、房间位置保存在当前浏览器 localStorage，键为 little-town-v1。不同设备、不同域名之间不会自动同步；清除网站数据会删除进度。

## 素材
皮卡堂原画版权属于上海爱扑网络科技股份有限公司，公开来源见 furniture-sources.json 与 https://web.picatown.com/ 。素材可访问不代表已获得再分发或商业使用许可。本仓库不授予第三方素材版权许可。
