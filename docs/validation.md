# 本次迁移验证

日期：2026-10-13。范围：云实例中的 AI-pets 快照；不是新任务恢复、DSH 接入或桌面系统全面验收。

| 检查 | 实际结果 |
|---|---|
| 固定依赖安装 | `npm ci` 成功，408 个包；最终 `scripts/cloud-install.sh` 再执行成功 |
| 原锁文件 | 与来源文件逐字节一致；未更改版本、integrity 或依赖声明 |
| Telegram sidecar | 固定 release 的 Linux x64 归档/二进制校验成功；安装脚本重跑后校验仍成功 |
| JS WavePet/Codex 定向测试 | 64 passed，0 failed，0 skipped |
| Python 状态引擎测试 | 3 tests，全部通过 |
| 完整桌宠基线首次运行 | 5,202 tests：5,175 passed、3 failed、24 skipped，0 cancelled；三个失败都是 README 贡献者检查使用迁移前路径 |
| 迁移路径与 updater 复测 | 将贡献者检查路径改到保留的上游 README；相关文件复测 46 tests，全部通过，包含原先失败的 3 项 |
| JS/Python 样本回放 | 同一 8 事件输入均进入 `overheat_debugging`，presentation 为 `shake`；安装脚本重跑后再次通过 |
| 文件桥 | 8 条历史与最新 JSON 一致；临时输出清理成功 |
| 静态 renderer HTTP | 成功启动 server；代表性请求 HTTP 200，宠物 DOM 和四种展示状态存在；该示例用内嵌样本 |
| Linux 打包 | `electron-builder --linux --dir --publish never` 成功；`dist/linux-unpacked/resources/app.asar` 存在 |
| 源文件完整性 | 来源桌宠 930 个受版本控制文件全部保留（原 README 改存档目录）；所有应保留源文件均不被目标 `.gitignore` 隐藏 |

完整基线没有在文档路径修复后再整体重跑；已复测所有失败项和变更的 updater。不要把重复检查算成额外独立测试。首次完整运行的 24 个 skipped 仍是未执行，未记作通过。

## 未通过或未执行

- 普通 Electron 启动未成功：当前没有 DISPLAY，启动日志实际记录 Chromium SUID sandbox helper 配置失败。继承的 launcher 将 signal termination 映射到退出码 0，因此以实际日志判定失败。
- 透明置顶窗口、托盘、真实拖拽、多显示器、权限审批、终端前台聚焦未做实机验收。
- Windows/macOS 构建、签名、安装包验证未执行；Linux 检查只验证 unpacked 目录。
- DSH 尚未开发/启动，没有真实模型对话测试；外部竞品只进行了源码/文档调研。
- 配置草稿保存不会执行脚本、重启服务或发布。没有创建提交、推送或公开发布；新任务恢复未独立验证。

依赖、状态层、文件桥和 Linux 打包已可用于继续开发；整体桌宠 GUI 的验收仍需有显示服务的桌面机器。
