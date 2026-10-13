# 开发与验证

工作目录：`/workspace/AI-pets`。本云实例已有 Node `24.19.0`、Python `3.12.14`。原 CI 使用 Node 20；本次不修改依赖版本或 lockfile。

## 安装

```bash
bash scripts/cloud-install.sh
```

脚本使用 npm 官方 registry 的 `replace-registry-host=always`，解决来源 lockfile 指向 `registry.npmmirror.com`、当前云网络不允许该域的问题。替换只发生在安装解析过程中，版本、integrity 和 lockfile 内容不变。

Electron 下载使用官方 `ELECTRON_GET_USE_PROXY=1`，Node sidecar 下载使用 Node 24 的 `NODE_USE_ENV_PROXY=1`；缓存位于 `/workspace/.cache` 和 `/workspace/.npm-cache`。保留 TLS、npm integrity、sidecar 归档与二进制 SHA256 校验。

必要目的地是现有 package-manager preset 里的 `registry.npmjs.org`、`github.com`、`release-assets.githubusercontent.com`。桌宠状态引擎不调用模型，不需要 API Key。只有真实 DSH 对话验证需要另行配置 DSH 自己的模型访问，当前不要求或添加密钥。

## 状态层日常检查

```bash
node --test --test-concurrency=4 test/wavepet-*.test.js test/agent-runtime-main.test.js test/main-codex-callback.test.js
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s plugins/wavepet/tests -v
PYTHONDONTWRITEBYTECODE=1 python3 scripts/cloud-smoke.py
```

smoke 用真实引擎消费现有 8 条事件，验证失败测试后的 `overheat_debugging`、`shake`、session 标识与输出字段，并验证文件桥原子写入的最新状态等于最后一条历史记录。它不验证 DSH 或桌面窗口。

JavaScript 回放：

```bash
node scripts/replay-wavepet.js plugins/wavepet/examples/sample_events.jsonl
```

Python 文件桥（显式使用可写目录，避免默认 macOS Application Support 路径）：

```bash
python3 plugins/wavepet/scripts/pet_state_bridge.py \
  --events plugins/wavepet/examples/sample_events.jsonl \
  --out-dir /workspace/ai-pets-runtime/wavepet --history
```

重复使用同一个 `--history` 目录会追加记录；验证独立运行时用新的临时目录。

## 完整基线检查与打包

```bash
node --test --test-concurrency=4 test/*.test.js
node scripts/verify-sidecar-binaries.js prebuild:linux
NODE_USE_ENV_PROXY=1 ELECTRON_GET_USE_PROXY=1 XDG_CACHE_HOME=/workspace/.cache \
  ./node_modules/.bin/electron-builder --linux --dir --publish never
```

限定四个测试 worker，避免大量文件并发争用计时/进程资源。Linux `--dir` 构建验证打包目录，不产生已签名安装包，也不验证 Windows/macOS 构建。平台相关 skipped tests 与真实桌面集成仍需相应机器。

## 无显示服务的云实例

当前没有 `DISPLAY`。普通 Electron 启动尝试还遇到 Chromium SUID sandbox helper 配置失败，因而没有完成桌面 GUI 验证。不能从 launcher 的退出码 0 得出启动成功：继承的 `launch.js` 在 child 被信号终止时使用 `code ?? 0`，会掩盖该失败。修复退出码是后续独立的小任务。

可启动已有静态 renderer 示例供内部请求验证：

```bash
python3 -m http.server 8787 --bind 127.0.0.1 \
  --directory plugins/wavepet/examples/local_pet_demo
```

该示例使用内嵌状态样本，并非实时引擎联动；状态运算由上面的回放和文件桥 smoke 验证。不创建云 UI 不支持的 localhost 预览链接。

## 实机桌面验收

在正常用户桌面环境安装依赖后 `npm start`，按 [WavePet 状态指南](guides/wavepet-codex-state.md) 跑一次真实 Codex 的读文件、修改、长输出、失败测试、恢复、完成；同时验证两会话交错、权限气泡、DND、mini mode、拖拽、终端定位与完成不重复触发。

没有执行实机检查之前，只能确认云端状态层与已通过的构建/测试，不能称整个桌宠已全面验收。当前检查结果见 [validation.md](validation.md)。
