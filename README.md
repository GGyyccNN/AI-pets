# AI-pets / WavePet

继续开发一个能反映 AI 智能体真实工作状态的桌宠：保留现有 Electron 桌面端，以 WavePet 状态层为核心，下一步优先评估 DeepSeek Harness（DSH）接入与多会话状态协调。

本仓库已迁入 `Matcha-Eason/clawd-on-desk-wavepet` 的桌宠代码和 `Matcha-Eason/WavePet` 的 Codex 插件。当前桌面端包名、界面与内置主题仍沿用 Clawd，基线版本为 `0.12.0`。这是一次代码快照迁移；来源历史保留在原仓库，精确提交见 [sources.json](docs/migration/sources.json)。

## 当前能力

- Electron 桌宠、主题与动画、mini mode、多会话 HUD/Dashboard。
- 原有 coding-agent hooks、日志监视与权限气泡。
- `src/wavepet/`：已接入 Codex JSONL 的 JavaScript 状态引擎、事件适配器、渲染映射。
- `plugins/wavepet/`：独立的 Python 状态引擎、文件桥、Codex plugin/skill 与示例。
- 读题理解、稳定工作、深度输出、红温调试、收束，以及底层工具活动的视觉覆盖。

**DSH 适配器尚未实现。** “多状态”下一步重点是状态可信度和跨会话协调；完整依据与建议见 [生态调研](docs/research/ecosystem-2026-10-13.md) 和 [路线图](docs/roadmap.md)。

## 开发

云环境（Node 24、Python 3.11+，Linux x64）：

```bash
cd /workspace/AI-pets
bash scripts/cloud-install.sh
node --test --test-concurrency=4 test/wavepet-*.test.js test/agent-runtime-main.test.js
python3 -m unittest discover -s plugins/wavepet/tests -v
python3 scripts/cloud-smoke.py
```

桌面开发机安装依赖后启动：

```bash
npm ci
npm start
```

WavePet 默认开启；`CLAWD_WAVEPET=0 npm start` 切回原有 Codex 状态行为。在没有桌面显示服务的云机器上，使用事件回放开发状态层：

```bash
node scripts/replay-wavepet.js
python3 plugins/wavepet/scripts/pet_state_engine.py --demo
```

环境限制、完整测试和桌面人工验收见 [开发说明](docs/development.md)。

## 工作入口

| 入口 | 内容 |
|---|---|
| [生态调研](docs/research/ecosystem-2026-10-13.md) | DSH、桌宠、AI 伴侣、状态/素材生态及机会判断 |
| [路线图](docs/roadmap.md) | 推荐主线、优先级、验收指标、待验证假设 |
| [迁移记录](docs/migration/README.md) | 三个原仓库的归属、修改范围与后续同步方式 |
| [开发说明](docs/development.md) | 安装、回放、测试、构建和人工验收 |
| [WavePet 状态指南](docs/guides/wavepet-codex-state.md) | 现有 Codex 状态与动画映射 |
| [原桌宠 README](docs/upstream/clawd-on-desk-wavepet/README.zh-CN.md) | 原有集成与功能说明；其中相对路径仍以原仓库根目录为基准 |

TokenWave 继续作为[外部研究仓库](https://github.com/Matcha-Eason/TokenWave)，训练数据和研究流水线不进入桌宠运行依赖。

## 许可证和发布边界

桌面源代码沿用 [AGPL-3.0-only](LICENSE)，WavePet 独立插件保留其 [MIT 许可证](plugins/wavepet/LICENSE)。保留上游作者署名和 [NOTICE](NOTICE.md)。

**美术素材不受代码许可证覆盖。** 迁移保留了原主题与素材供现有功能开发；[assets/LICENSE](assets/LICENSE) 对其复制、分发与商用有独立限制。对外发布前应确认权利或替换为可分发的原创/明确授权素材；Codex Rocky 不随 WavePet 插件分发。当前没有发布安装包或推送远端。
