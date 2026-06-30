# 更新关卡数据 — 执行指南

本文档记录"更新关卡数据"任务的完整执行流程。今后触发此任务时，严格按照此流程执行。

## 触发条件

用户说"更新关卡数据"或类似表述时，按此流程执行。

## 执行流程

### 1. 读取新配置

用 PowerShell COM 读取 `GameConfig/LevelSheet.xlsx`：

```powershell
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open("D:\Work\AI Project\HTML Project\WordSort\GameConfig\LevelSheet.xlsx")
$ws = $wb.Worksheets.Item(1)
# 遍历第2行到最后一行
# LevelID=Column1, WordCount=Column2, ColumnCount=Column3, QMarkCount=Column4
```

输出格式：`{LevelID, WordCount, ColumnCount, QMarkCount}`

### 2. 对比变更

将新配置与 `bake_levels.js` 中当前 LEVELS 数组对比，找出有变化的关卡。

### 3. 更新两个 LEVELS 数组

同时更新以下两个文件中的 `const LEVELS = [...]` 数组：
- `bake_levels.js`
- `index.html`

格式：`{id:LevelID, wordCount:WordCount, colCount:ColumnCount, qmarkCount:QMarkCount}`

### 4. 烤制前参数说明（勿随意改动）

`bake_levels.js` 中可解性检查的 DFS 参数：
- `maxNodes`: ≤24词100k / ≤32词500k / ≤40词2000k / >40词3000k
- `timeLimit`: ≤28词3s / ≤36词8s / ≤40词15s / >40词25s
- `maxAttempts`: <40词200次 / ≥40词30次

### 5. 运行烤制

```shell
node "D:\Work\AI Project\HTML Project\WordSort\bake_levels.js"
```

**注意**：30关预计耗时 5-10 分钟，44词关卡可能全部走 fallback（30次重试上限后用最后一次结果）。这是正常的。

### 6. 替换 index.html 中的 BAKED_LEVELS

烤制完成后，`baked_levels.js` 中已包含新的 BAKED_LEVELS 对象。需要将其替换到 `index.html` 中。

编写一个独立 Node 脚本 `replace_baked.js`，逻辑：
1. 读取 `baked_levels.js`，提取 `const BAKED_LEVELS = { ... };` 块
2. 读取 `index.html`，找到 `const BAKED_LEVELS = {` 到 `let G = {` 之间的旧块
3. 替换为新块，写回 `index.html`

### 7. 清理

删除 `replace_baked.js` 临时脚本（可选，不删除也不影响）。

### 8. 告知用户变更摘要

列出哪些关卡发生了变化，及具体改动内容（WordCount / QMarkCount 的变化）。
