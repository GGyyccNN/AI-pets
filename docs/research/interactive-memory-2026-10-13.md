# 交互型记忆：项目与论文调研

日期：2026-10-13（Asia/Shanghai）。关注的问题是：用户在 AI 回复上划线、写旁注、收集片段，这些操作如何形成可再次使用、可控制的记忆？

## 结论

已经存在直接的界面前作和记忆系统前作。ChatGPT 选段批注/收藏已有插件；2023 年 Memory Sandbox 已提供可查看、修改、删除、总结并跨会话共享的 agent 记忆。因此，“划线收藏”或“用户管理记忆”本身不宜作为独立的新颖性主张。

值得验证的组合是：**在阅读原文时，以低负担的交互表达记忆意图，明确项目作用范围，并显示哪些片段实际影响了后续回答。** 这是一条产品与研究假设，尚不能断言没有相同工作。

## 证据范围

本轮读取项目方 README、作者仓库的摘要和引用、作者项目页，以及部分源码；没有运行外部产品。本环境对 arXiv/ACM 等论文站点的请求被网络策略拒绝，因此没有逐篇获得全文。下面区分作者材料已核对的工作和仅从二手目录发现的后续线索，不把后者的实验结论当成已验证事实。来源提交和文档哈希见 [interactive-memory-sources.json](interactive-memory-sources.json)。

## 项目

| 项目 | 已核查的功能 | 与本想法的关系 |
|---|---|---|
| [ChatGPT Reading Highlighter](https://github.com/Gianna-ui141/chatgpt-reading-highlighter) | 在 assistant 回复上选择文本、四种高亮、旁注、搜索、回到原文、Markdown/JSON 导出，本地保存 | 手动批注和集中回看的直接界面前作；README 明确不向 AI 服务发送内容，没有后续 agent 记忆闭环 |
| [Threadmark](https://github.com/ccheney/threadmark) | ChatGPT 片段收藏、标签、备注、侧栏管理、惰性加载下重新定位，IndexedDB 本地存储 | 直接覆盖“划线后放到另一处”；关注片段归档，不是自动改变后续模型上下文 |
| [Hypothesis](https://github.com/hypothesis/client) | 浏览器批注客户端，连接独立的 [批注 API](https://github.com/hypothesis/h) | 可以借鉴原文锚定、来源、批注独立于正文的存储设计；本身不是 LLM 长期记忆产品 |
| [AutoNotes / Google PAIR](https://github.com/PAIR-code/autonotes) | 创建/导入笔记、手动或 AI 标签、跨笔记总结、与笔记对话、查看回答引用、把回答存成新笔记 | 覆盖“回答 → 笔记 → 再次用于回答”的闭环；其回答存笔记是整条回复，未在 README 中看到原回复选段划线这一入口 |
| [semi-auto-memory](https://github.com/colonelpanic8/semi-auto-memory) | agent 提议候选，用户批量接受/编辑/拒绝，再写入 MEMORY.md 或其他目标；有状态、证据、失效检查 | 说明用户决定写什么的模式已有工程实现；入口是任务结束后的提案队列，而不是阅读时标注原文。其小样本自测不能证明一般效果 |
| [Pensieve](https://github.com/DrJonaC/Pensieve) | 外部记忆库导入/导出、编辑、置顶、弱化、隐藏，修改影响检索；在线查询使用选出的记忆 | 可见性和可控记忆使用的相关项目；源码中实际把检索记忆送入生成。仓库称其为论文投稿 artifact，本轮未核实论文发表状态，故只作为项目 |

优先直接体验或研究前两个项目，避免重复制作同样的收藏工具。AutoNotes 与 Memory Sandbox 是检查记忆闭环时更重要的比较对象。

## 作者材料已核对的论文

### Memory Sandbox（2023，arXiv）——最直接的前作

**Memory Sandbox: Transparent and Interactive Memory Management for Conversational Agents**

- [论文](https://arxiv.org/abs/2308.01542)
- [作者代码与公开摘要](https://github.com/hzhfred/chatbot-memory-hci)

把记忆视作用户能查看、操作、记录、总结和跨会话共享的数据对象。公开原型允许增加、编辑、删除、总结记忆及改变可见性。源码 `app/chat.js` 的发送逻辑将 visible 的消息送入后续模型请求，说明这是实际上下文控制，不只是界面上的收藏。

对本工作的启发：把可视批注与可控模型上下文连接起来。仍需精读全文，确认原型覆盖的操作粒度、研究方法与持久化范围；不能凭摘要宣称自己的选段设计在论文中完全没有出现。

### Sensecape（2023，UIST）——从对话走向组织与思考

**Sensecape: Enabling Multilevel Exploration and Sensemaking with Large Language Models**

- [论文 DOI](https://doi.org/10.1145/3586183.3606756)
- [作者项目页源文件](https://github.com/sanghosuh/sensecape.github.io)

提供多层次抽象和空间组织，帮助用户在信息搜集与理解组织之间切换。作者摘要报告了组内用户研究；本轮没有获得完整方法和效果量，因此不量化其收益。

启发：用户选出的回复片段可以成为可分组、关联、折叠的工作材料。该论文主要关注 sensemaking，不应直接等同于跨会话 agent 长期记忆。

### Graphologue（2023，UIST）——原文与另一种视图之间的交互

**Graphologue: Exploring Large Language Model Responses with Interactive Diagrams**

- [论文 DOI](https://doi.org/10.1145/3586183.3606737)
- [作者代码、引用与摘要](https://github.com/foundation-interface/graphologue)

利用 inline annotation 把 LLM 回复中的实体与关系转成实时图谱，用户可操作图谱并进行局部追问。它证明了从原回复进入另一种可操作视图已有研究基础；其 annotation 主要用于系统抽取结构，与人的手动划线意图并不相同。

启发：原文引用、卡片或图谱、局部追问保持关联。无需在首版复刻大型画布；片段卡片和来源跳转即可先验证价值。

### Memoro（2024，CHI）——记忆要在需要时简洁地出现

**Memoro: Using Large Language Models to Realize a Concise Interface for Real-Time Memory Augmentation**

- [论文 DOI](https://doi.org/10.1145/3613904.3642450)
- [作者参考实现与 CITATION](https://github.com/wazeerzulfikar/memoro)

是可穿戴、音频驱动的个人记忆助手，支持主动语音查询及根据对话情境推断需求的 Queryless Mode。它主要增强人的回忆，并不是 AI 回复划线工具。

启发：后续回忆应少而相关，而不是不断积累后展示一整页摘录。作者 README 区分 CHI 2024 原型与后续 V2，代码仅对应第一阶段，不能把 V2 功能或研究结果归入已公开的初版代码。

## 记忆后台的补充阅读

- [MemoryBank: Enhancing Large Language Models with Long-Term Memory（2023 预印本）](https://arxiv.org/abs/2305.10250)，[作者实现](https://github.com/zhongwanjun/MemoryBank-SiliconFriend)：更新、检索、重要性与时间相关的记忆强化/遗忘。可以用于思考记忆生命周期，但不是手动划线界面的直接前作。
- [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory（2025 预印本）](https://arxiv.org/abs/2504.19413)，[项目](https://github.com/mem0ai/mem0)：抽取、保存并检索记忆，作为自动记忆的系统比较对象。当前仓库已演进，不能把最新 README 性能数字当作原论文数字。

## 2026 年的后续核验线索

以下题名和标识已从研究目录定位，尚未从作者或出版社直接核查全文/实验。本轮不据此给出实验结论：

- [RECALLbot: Designing Agentic Memory and Reciprocal Disclosure for Human–Chatbot Relationships](https://doi.org/10.1145/3772318.3790714)：目录标注 CHI 2026，涉及可见记忆控制与持续交互；[发现来源](https://github.com/Linwei-Chen/llm-memory-research-atlas)。
- [Relational Gains, Privacy Strains: Exploring Users' Perceptions and Experiences with ChatGPT's Memory Feature](https://doi.org/10.1145/3772318.3791635)：目录标注 CHI 2026，适合追踪用户对记忆可见性与控制的需求；同上发现来源。
- [Remember, Verify, or Ask? Cross-Family Evaluation of Memory Commitment in LLM Agents](https://arxiv.org/abs/2608.19564)：2026 预印本线索，关注候选信息应持久记忆、临时使用、核验还是询问；[发现来源](https://github.com/H20Zhang/Agent-Memory-Radar/blob/main/data/papers/2608.19564.json)。目录称其只评估决策而不执行写入，应在阅读全文后再引用这一局限。

## 本工作可以怎样收窄

“交互型记忆”适合作为项目用语，相关文献检索还应使用 active reading、conversational annotation、sensemaking、user-controlled memory、human-in-the-loop memory 等词。

第一版建立这条闭环：

1. 在 DSH 原回复上选择片段，留下备注与意图。
2. 让意图明确区分“认可的结论、待验证内容、反对意见、项目约束”。划线本身只说明关注，不能自动认作事实或长期偏好。
3. 保存原消息、原文邻近上下文、来源/版本及作用范围；消息身份不可在返回批注时丢失。
4. 用户以清楚的“用作当前项目记忆”操作表达未来使用意图；普通高亮可保持为阅读笔记。
5. 后续回答检索这些内容，显示“本次参考了哪些片段”，并允许回到原文、更正或停止使用。

可研究的具体问题：**与自动从全部对话提取记忆，以及独立面板手工记忆相比，原文上的意图化批注是否能降低误记/误用，同时减少用户管理记忆的负担？**

比较三种条件：自动提取、独立记忆面板、原文批注形成记忆。观察跨会话任务中约束遵守、检索相关性、误把怀疑/反对当成认可的比例、来源追溯成功率，以及用户操作次数/时间。这些是未来评估设计，不是本轮已完成实验。

后续实现沿用高亮插件的独立辅助调用、本地结果复用和原文定位；先复用已产生的批注，避免每个视图再调用一次模型。成本优势需要 token、缓存命中和延迟记录来证明。
