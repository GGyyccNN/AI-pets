# AI 智能体桌宠生态调研

调研日期：2026-10-13（Asia/Shanghai）。重点按用户澄清后的 **DeepSeek Harness / DSH**，同时对照编码智能体桌宠、素材生态和 AI 伴侣。

结论：继续桌宠方向有基础，但“多状态动画数量”已有充分供给。推荐定位为 **跨 harness 的可信工作状态桌宠**：让人一眼知道哪个会话在做什么、是否需要自己介入，以及当前显示来自真实事件还是体验估计。这个方向仍是待验证的产品假设，不能称为已证明无人覆盖的生态缺口。

## 方法与证据范围

实时查询公开 GitHub 仓库搜索，读取 DSH 官方仓库、插件精选列表、代表性桌宠 README 和部分实现；精确源码提交、README 内容哈希及搜索快照见 [evidence.json](evidence.json)。没有依赖搜索摘要直接判定功能，也没有运行这些外部竞品或进行用户访谈。

GitHub 星标和更新日期只用于选择样本，不能证明近期增长、活跃用户、留存或商业需求；本报告不提供“全网热度排名”。从官方文档能确认 DSH 是开发者预览、接口快速变动；兼容性须按具体版本重新验收。

## 生态分层

| 类型 | 代表项目与一手来源 | 已有供给 | 对 AI-pets 的影响 |
|---|---|---|---|
| Harness / 扩展宿主 | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)、[DSHDesktop](https://github.com/dataelement/dsh-desktop)、[插件精选](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | Cordis 插件架构、CLI/Web/Desktop、结构化会话和 agent 事件 | 应从正式事件适配接入；DeepSeek 模型 API 与 DSH 运行状态是两层不同接口 |
| 编码工作状态桌宠 | [Clawd on Desk](https://github.com/rullerzhou-afk/clawd-on-desk)、[OpenPets](https://github.com/OpenPetsHQ/openpets) | 多 agent 集成、动画/主题、通知、权限提示、桌面承载 | 新做一套 Electron 壳或通用 busy/idle 动画，差异有限 |
| DSH 原生宠物 | [鲸桌](https://github.com/cookiesheep/whale-on-desk)、[鲸鱼娘](https://github.com/Sutera-Diffusus/dsh-whale-musume)、[Live2D Pets](https://github.com/cyanfish-x/dsh-live2d-pets) | 工具细分、审批提示、完成/失败、交付、保持时间、互动与养成 | 多状态、平滑、不打扰都已有竞品；需要可测量的可靠性提升 |
| 素材/包格式/分发 | [Petdex](https://github.com/crafter-station/petdex)、[DSH Codex Pet](https://github.com/mengyun233/dsh-codex-pet)（精选列表收录） | Codex pet 包、hatch-pet、跨工具图库与导入 | 优先兼容现有素材和能力降级，不另建完整素材市场 |
| 对话与人格伴侣 | [AIRI](https://github.com/moeru-ai/airi)、[Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) | 实时语音、Live2D/VRM、人格与模型接入 | 可借鉴表现层；语音与长期人格会引入另一整套产品和依赖 |
| 传统桌宠/养成 | [VPet](https://github.com/LorisYounger/VPet) | 丰富互动动画、养成、创意工坊 | “动画很多”并不是新需求；价值在与实际工作反馈的结合 |

### 直接竞争的细节

- **鲸桌**：精选列表标注 29 个逐帧验收状态；README 明确写了运行、输出、工具、审批敲玻璃、完成统计、失败、睡眠、自定义皮肤与工坊。宿主监听 `session/event`，使用独立状态机，客户端轮询。不能把它归类为只有 idle/busy 的装饰。
- **鲸鱼娘**：README 写明按命令、编辑、搜索、测试、评审、部署、调试细分姿势；工作期保持 8s/4s、防止闪烁，而且不插话。其信号来自宿主结构标记/工具卡/运行标记，适合观察 UI，但受宿主前端结构变化影响。
- **Live2D Pets**：源码 `src/service.ts` 监听 `agent/status`、`agent/error`、`agent/turn-stopping`、`approval/request`、`session/event`；审批回调调用 `next()`，交付与完成有保持期。已具备状态镜像和视觉稳定性。
- **OpenPets DSH**：已有独立 Cordis 桥接包 [packages/dsh](https://github.com/OpenPetsHQ/openpets/tree/1049485b7a940d196c8b37ab265fcbbbc13cb5b7/packages/dsh)，把生命周期、错误、审批、流式状态行、工具映射到桌宠；实现有 5s 错误后成功抑制及语音节流。已占据“跨工具桥接”方向，需要直接比较后再宣称优势。
- **Petdex**：README 定义 `pet.json` + spritesheet，9 行状态以及 v2 的 11 行布局；拥有图库、CLI 和桌面端。代码 MIT 不代表所有提交者的宠物素材都可自由再分发。

## DSH 应如何接入

已核查官方源码提交 [`d743267…`](https://github.com/deepseek-ai/deepseek-harness/tree/d743267388641bc76f17c45ce8b4c231aed1d32c)，其根/CLI 版本为 `0.2.1-alpha.2`。这描述被检查的源码快照，不代表 npm stable 或所有社区桌面版已采用此版本。

官方类型入口：

- [agent runtime-types](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/core/agent/src/runtime-types.ts)：`agent/status`（仅 `idle`/`running`）、`agent/assistant-stream`、`agent/error`、`agent/turn-stopping`。
- [session](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/core/session/src/index.ts)：`session/created`、`session/disposed`、`session/event`。
- [remote-events](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/api/session-controller/src/remote-events.ts)：远程会话观测是 `api-session/activity` 等另一套接口，不能与进程内 Cordis 事件混用。

推荐第一版用 **Cordis 宿主插件 → 标准化事件 → 本地桌宠**。这是独立于模型供应商的工作流观测，不能只接 DeepSeek OpenAI-compatible token API 来替代。

必须遵守的边界：

1. 每个 session 独立状态；保留 session、turn、attempt/tool-call 的关联，避免一个会话的错误污染全部宠物。
2. `idle` 只证明运行驱动空闲，不直接等于成功完成；取消、失败和需用户输入要用明确事件判断。
3. `agent/turn-stopping` 是“即将关闭”的边界，监听器仍可能带来新 steering；别提前宣称已完成。
4. 审批是 waterfall，观测型插件必须继续 `next()`；失败的桌宠通知也不能影响原审批/执行。
5. 流式内容包含 start/chunk/end 和 attempt 语义，重试后不能把同一段输出累计多次。
6. 网络/IPC 断开应显示“状态未知/断连”，无输出不能自动判定成功或确定卡死。
7. 锁定实际测试的 DSH 版本；先验证 host、Web、官方 Desktop 与社区桌面壳分别支持的扩展点。

## “多状态”的机会应如何定义

把一个扁平 state 拆成几层，先保证语义，再做美术：

| 层 | 示例 | 证据性质 |
|---|---|---|
| 生命周期 | idle / running / waiting_user / completed / failed / cancelled / unknown | 明确宿主事件与连接状态；优先保证正确 |
| 当前活动 | reading / editing / tool_running / testing / outputting | 工具/流式事件；具体类型有能力限制 |
| 等待体验 | 读题、稳定、深度输出、调试压力、收束 | WavePet 推断，显示为体验估计 |
| 宠物情绪与互动 | 平静、兴奋、疲惫、被拖拽、摸头 | 人格/交互表现，不代表模型内部心理 |
| 动画 | sprite row、overlay、cadence、短暂反应、fallback | 由皮肤能力决定，可降级 |

当前引擎已经区分 WavePet 状态与临时工具视觉覆盖，是可继续发展的基础。下一步尤其需要验证：

- **需要人介入的状态永不被深度工作动画掩盖**。
- **误报完成、误报卡死和短时间抖动减少**，同时真实审批/失败立即可见。
- **多会话中的关注选择清楚**：谁在运行、谁需要处理，宠物对应哪个项目。
- **多皮肤遵守同一语义**：单图、9 行 sprite、丰富主题都能表达关键状态，不需每套皮肤画几十张。
- **可解释与可回放**：用户/开发者能看到触发原因，事件重放能稳定复现。

这些是从竞品样本中提炼的验证方向；并非断言所有生态项目都缺少它们。

## TokenWave 的价值与证据限制

[TokenWave README](https://github.com/Matcha-Eason/TokenWave/blob/470e9414a59e09fb6867cf9916b16777476e8a11/README.md) 报告：规则宏 F1 `0.547`、仅历史 `0.785`、历史加当前流式前缀 `0.904`。

这支持“历史惯性 + 当前信号”值得研究，但不能解读为真实用户体验识别准确率 90.4%。标签由启发式生成，流式由 token 前缀模拟，thinking/用户 token 也含估计；训练的特征与标签规则可能高度相关。没有真实流式时间戳、人工体验标签或 DSH 用户外部验证。

产品初期保留规则引擎，先收集经授权的匿名事件统计和人工任务阶段标注。模型只有在真实日志、按 session/trajectory 隔离的数据切分、盲评标注和规则对照上出现稳定收益时才进入 runtime。不要把推断分数当校准概率或剩余时间。

## 建议的方向

**主线：AI-pets 承载桌面体验，WavePet 提供状态语义，TokenWave 做离线校准。** 先完成 Codex + DSH 两个生态的可观测闭环，兼容现有宠物格式，以“少盯终端、及时知道该出手”为产品目标。

先找 5–10 位真实同时使用多个 agent/session 的开发者做任务验证，比较当前桌宠和 WavePet：等待确认是否漏掉、完成是否误报、是否减少切回终端查看。若收益主要来自基础审批通知而非细粒度体验层，收窄状态模型；若不能优于现有 OpenPets/鲸桌，优先把 WavePet 做成可接入它们的状态组件。具体阶段与门槛见 [路线图](../roadmap.md)。
