# 双人打僵尸网页小游戏 Handoff

## 项目状态
- 最终交付文件：`index.html`
- 早期原型：`double_zombie.html`
- 自动测试脚本草稿：`test_double_zombie.js`
- 项目规范：`AGENTS.md`
- 参考美术资源：`assets/zombie_asset_sheet.png`

当前版本是一个单文件 Canvas 网页游戏，样式、脚本和兜底美术都内嵌在 `index.html` 里。无需启动服务器，直接用浏览器打开即可。

## 如何运行
1. 在 Finder 中打开本文件所在文件夹。
2. 双击 `index.html`，或在浏览器地址栏打开：
   `file:///Users/songjunxian/Documents/Codex/2026-05-04/https-chat-deepseek-com-share-fpqu3rvw1pyckt61i9/index.html`
3. 若要跑内置测试，在地址后加：
   `?autotest=1`

## 游戏控制
- 玩家1（蓝色）：`WASD` 移动，`F` 射击
- 玩家2（红色）：方向键移动，`.` 或 `/` 射击
- `R`：重置游戏
- 右上角按钮：切换 `合作模式` / `对抗模式`
- 对抗模式清完一波后：点击 `下一波`

## 主要玩法
- 第 1 波生成 7 只普通僵尸。
- 每波总数 = `5 + 当前波次 * 2`。
- 第 3 波开始出现精英僵尸，精英替代普通僵尸，不额外增加总数。
- 精英僵尸需要 5 枪击杀，移动更慢，碰撞造成 2 点伤害，并显示 5 格血条。
- 同时存在的僵尸最多 20 只。
- 合作模式：任意玩家死亡即失败，清完第 10 波人类获胜。
- 对抗模式：每波结束时击杀数少的一方扣 1 血，最低保留 1 血；被僵尸打到 0 血时另一方获胜。

## 已验证项目
内置测试已经覆盖：
- 双人独立移动与射击
- 第 1 波和第 3 波生成规则
- 精英僵尸 5 枪死亡与血条更新
- 普通/精英碰撞伤害
- 合作/对抗模式切换
- 对抗模式低分扣血和下一波按钮
- 波次切换清空僵尸、子弹并重置玩家位置
- `R` 键完整重置
- 僵尸数量上限和性能裕量

## Git 本地版本控制
本项目建议使用如下流程：

```bash
git status
git add .
git commit -m "Initial zombie game"
```

以后每次改完一个小功能，建议执行：

```bash
git status
git diff
git add index.html HANDOFF.md
git commit -m "Describe the change"
```

常用命令：
- `git status`：查看哪些文件改了
- `git diff`：查看具体改动
- `git log --oneline`：查看提交历史
- `git restore <文件名>`：撤销某个未提交文件的改动，使用前要确认不需要保留

## 创建 GitHub 仓库并推送
推荐新手使用网页创建仓库：

1. 打开 GitHub，点击右上角 `+`，选择 `New repository`。
2. 仓库名可以叫：`double-zombie-game`。
3. 选择 `Public` 或 `Private`。
4. 不要勾选 `Add a README file`，因为本地已经有文件。
5. 创建后，GitHub 会显示一段 `push an existing repository` 的命令。

本项目当前远程仓库地址是：
`https://github.com/junxian509/zombie-game.git`

首次推送在本项目目录运行：

```bash
git branch -M main
git remote add origin https://github.com/junxian509/zombie-game.git
git push -u origin main
```

如果已经添加过 `origin`，只需要运行：

```bash
git push -u origin main
```

GitHub 现在不再接受账号密码直接推送。若终端提示需要认证，推荐使用 GitHub Desktop 登录后推送，或使用 GitHub CLI 登录：

```bash
gh auth login
git push -u origin main
```

## 后续开发建议
1. 增加武器箱：临时强化子弹尺寸和范围。
2. 增加大僵尸波次：第 10、20、30 只僵尸触发特殊敌人。
3. 增加 90 秒生存模式：倒计时结束按击杀数结算。
4. 增加音效：射击、击中、波次开始、游戏结束。
5. 拆分代码：当 `index.html` 继续变大时，再拆成 `style.css` 和 `game.js`。

## 注意事项
- 目前 `index.html` 是最终主文件，优先修改它。
- `double_zombie.html` 可以保留为早期版本参考。
- 若要继续使用单文件交付，不要引入外部图片或 CDN。
