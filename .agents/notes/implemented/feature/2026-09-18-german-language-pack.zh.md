# Agent Note: Web GUI 的德语语言包

Status: implemented

[English](2026-09-18-german-language-pack.md) | 中文

## Problem

Web GUI 只内置了中文与英文两种语言。德语用户无法以德语运行界面，而 locale 服务的语言包扩展点（`addLanguage` 与单语言 `register` 形式）并没有已发布的真正使用者，因此这条文档化的扩展路径从未在规模上被验证。client 文案分布在约四十个 feature 包中，每个包都拥有一个 typed namespace，其 key 联合类型只针对内置的 `zh`/`en` 对做校验，因此扩展点的验证必须在不改动这对内置类型的前提下完成。

## Decision

**新增专门的 `@deepseek-ai/dsh-client-locale-de` 包，承载 Deutsch 语言及每个已发布 client namespace 的德语字典。** 它不注册 slot、不渲染 UI：其 browser 半边在 owned effect 中调用 `ctx.locale.addLanguage({ id: 'de', label: 'Deutsch', fallback: 'en' })`，并为 42 个 namespace 调用 `ctx.locale.register(ns, 'de', dict)`；卸载 fiber 即从 Settings → General 选择器移除该语言，并从注册表移除全部字典。该包像其它 client 插件一样接入 `dsh-web-app` bundle——`cordis.patch.yml` 中的 `dsh.client` 行、bundle 依赖以及 `tsconfig.client.json` 聚合引用——因此已发布 web 界面的每个部署都会在中文与 English 旁列出 Deutsch。

**无类型的单语言 `register` 形式正是本包要验证的扩展点。** namespace 的 typed key 联合类型归属于其 feature 包，而语言包贡献的是一个语言而非补齐内置对，因此 `Record<BuiltInLocaleId, …>` 重载不适用。key 从各 namespace 的英语源逐字复制，包含 `{placeholder}` 占位符；只有 value 是德语。

**产品术语保持原样，格式模板做本地化。** Session、Workspace、Turn、Tool、Plugin、Skill、Subagent、Model、Provider、Prompt、Cache 作为借词保留，因为产品自身约定将它们视为 token，且德语开发者 UI 本就混用这些词。路径、URL、命令 token（`/plan`、`compact`）、provider 与应用名称、数字骨架不做翻译。对语言敏感的格式模板做翻译：`number.groupSeparator` 为 `.`，`clock.md` 为 `{m}.{d}`。

**每个 namespace 一个字典文件，由 index 聚合。** `src/client/locales/<namespace>.ts` 承载一个字典；`index.ts` 将 namespace id 映射到字典并导出语言 id 与 label。这种布局让某个 namespace 的德语文案紧挨它所属的对等问题，使翻译审阅可以逐文件进行。

## Verification

包测试通过 `ctx.plugin` 启动真实的 locale 插件与语言包，断言 Deutsch 出现在目录中、每个已发布 namespace 都有一个 key 经德语翻译、没有德语字典的 key 仍由英语回答，并且语言与全部字典随 fiber 一起释放。对照每个 namespace 的英语源审计了 key 对等性与占位符对等性：缺失 key 为零，占位符改动为零。42 个字典模块与两个半边都能在 Node 原生 TypeScript 剥离下执行，在无安装的情况下固定了语法有效性。其余发布前证据由 `pnpm run test:gui`、`pnpm --filter @deepseek-ai/dsh-client-locale-de bundle` 以及生成目录的重新生成（`gen-module-graph`、`gen-config-catalog`、`gen-client-catalog`、`gen-dependency-catalog`）承担。

## Alternatives considered

**将 `de` 提升为第三个内置语言（扩展 `BuiltInLocaleId`）。** 放弃：每个 client 包的类型化 `register(ns, { zh, en, de })` 调用都会编译失败，直到全部包都补上德语字典，于是某一语言的完整性成为跨四十个包的阻塞依赖。内置对存在的意义是为仓库自身作者的两种语言强制双语对等；可选语言应该是插件。

**在每个 feature 包内做翻译。** 放弃：德语会分散到四十个包中且没有共享词汇，而 client bundle 纯度规则禁止跨插件值导入，因此没有包能复用另一个包的德语文案。单一语言包让语言只有一个归属者、审计只有一个位置。

**在构建时从英语源生成字典。** 放弃：机器翻译的产物无法在 diff 中审阅，并会把翻译提供方绑定到构建上。对照英语源的对等性审计是机械部分；value 始终由人工撰写。

## Consequences

- 某个 feature 包新增英语 key 时，不会同时带有德语对应项，查找链会为该 key 渲染英语。key 对等性是维护性审计而非编译期错误；包 README 将此记录为已知限制。
- 已发布的 web client bundle 增加德语负载（约 1300 条字符串），换来完整的德语界面。
- 该语言包是已发布语言包的参考实现：后续语言可复制同样的布局、接入方式与对等性审计，而 locale 服务的扩展点也在发布规模上被真正使用。
