# 迁移记录

检查日期：2026-10-13。目标：`GGyyccNN/AI-pets`，使用现有云 checkout。

## 仓库分工

| 来源 | 本次处理 | 后续定位 |
|---|---|---|
| Matcha-Eason/clawd-on-desk-wavepet | 复制 HEAD 的完整受版本控制文件树，放在根目录；不带 `.git` | AI-pets 的 Electron 桌宠基线 |
| Matcha-Eason/WavePet | 复制 `plugins/wavepet/`、repo-local marketplace、插件验证 CI；保留 MIT | 独立插件和应用状态层的参考实现 |
| Matcha-Eason/TokenWave | 阅读结果和应用接口草案，记录来源提交；不复制数据或训练流水线 | 独立研究和离线评估 |

精确 SHA 与来源 URL 见 [sources.json](sources.json)。桌面源提交为 `cffa9d33a55bf04ea07bb48eecd77edd192676a4`，插件源提交为 `df9fac138f40b980a935f32197105cae46847916`。它们分别来自 2026 年 7 月和 6 月，并非 10 月所有生态项目的最新代码。

源仓库只读使用，没有删除、修改、reset 或推送。迁移是快照，不导入 Git 历史，不替换 AI-pets 的 origin。原 README 保留在 `docs/upstream/`，其原始相对链接仍按原仓库布局解释；本仓库日常入口是根 README。

## 对基线的必要整理

1. 根 README 和 AGENTS 增加本仓库定位、开发命令与研究入口；原 Clawd 操作约束保留。
2. `package.json` 增加目标 repository；打包发布源和 updater 的 Release 地址改为 `GGyyccNN/AI-pets`。对应现有 updater 测试只更新目标仓库断言，未降低检查。
3. 解除上游 `.gitignore` 对全部 `docs/**` 与 `scripts/*` 的默认屏蔽。上游有若干强制跟踪文件，复制到空仓库后会被忽略，尤其是 WavePet 状态指南和 `ensure-sidecar-binaries.js`。
4. README 贡献者检查改为读取迁移后的原文存档目录，完整保留原有署名断言。WavePet CI 把 Python bytecode 放到 runner 临时目录，避免 `py_compile`/测试生成的缓存触发其“无缓存文件”检查。
5. 增加云安装脚本、JS 事件回放命令和跨 JS/Python/文件桥 smoke。没有新增桌宠状态或 DSH 集成。

保留包名、基线版本、主题名、agent IDs 和原安装脚本，避免一次迁移同时引入产品重命名与协议变化。Telegram sidecar 仍从原作者的固定 Release 获取，校验脚本与预期 SHA256 保持原样；它是独立外部依赖。

## 状态层的双实现

`src/wavepet/engine.js` 是 Electron 的实际执行实现；`plugins/wavepet/scripts/pet_state_engine.py` 是独立插件实现。两者不是同一个运行时，不能因为名字一致就假定所有阈值、计时和平滑行为相同。本次只验证同一个 8 事件样本都正确进入红温调试；这不是完整的行为一致性证明。后续先制定共享 fixture 和版本约定，再讨论收敛实现。

插件里的 `BSOD_FUSION_NOTES.md`、`LOCAL_COMPATIBILITY_TEST.md` 是 2026-06-24 的原作者记录，不是本次云实例验收。文件桥写出 JSON 不代表官方 Codex 内置桌宠自动消费该状态；原记录明确没有找到公开输入接口。当前真实桌面集成主线是本仓库的 Electron/JS runtime。

## 后续同步

- 需要同步来源仓库时，从记录的 SHA 做差异检查，选择性迁入并跑受影响的现有测试。
- 需要同步 Clawd 官方新版本时，先检查 `rullerzhou-afk/clawd-on-desk` 与此基线之间的差异；本次没有自动合并官方新版本。
- 产品研究与路线图存放在此仓库，训练实验继续在 TokenWave 中；跨仓库结果用提交链接引用。
- 本次结果位于云工作区，尚未创建本地提交或推送。后续首次提交时使用本仓库的正常分支流程，不需要另建 worktree。

## 许可

根代码 AGPL、独立插件 MIT，主题/素材有独立保留权利条款。保持每份许可证、署名和通知；对外发布美术前确认权利或替换。研究引用不代表这些外部项目的代码/素材已授权进入本仓库。
