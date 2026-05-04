const path = require("node:path");
const { chromium } = require("playwright");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

(async () => {
  const launchOptions = { headless: true };
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  }
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1100, height: 820 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const file = `file://${path.resolve(__dirname, "double_zombie.html")}`;
  await page.goto(file, { waitUntil: "load" });
  await page.waitForFunction(() => window.__gameTest && document.querySelector("canvas"));
  await page.click("canvas");

  const initial = await page.evaluate(() => window.__gameTest.getState());
  await page.keyboard.down("w");
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(260);
  await page.keyboard.up("w");
  await page.keyboard.up("ArrowUp");
  const moved = await page.evaluate(() => window.__gameTest.getState());
  assert(moved.players[0].y < initial.players[0].y - 20, "玩家1 WASD 移动失败");
  assert(moved.players[1].y < initial.players[1].y - 20, "玩家2 方向键移动失败");

  await page.keyboard.press("f");
  await page.keyboard.press(".");
  await page.waitForTimeout(80);
  const afterShots = await page.evaluate(() => window.__gameTest.getState());
  assert(afterShots.bullets.some((b) => b.owner === 1), "玩家1 F 射击失败");
  assert(afterShots.bullets.some((b) => b.owner === 2), "玩家2 . 射击失败");

  const capped = await page.evaluate(() => window.__gameTest.forceZombieCount(20));
  assert(capped === 12, "僵尸数量没有限制在 12 只");

  await page.evaluate(() => window.__gameTest.reset());
  const lifeAfterHit = await page.evaluate(() => window.__gameTest.collideZombieWithPlayer(0));
  const lifeAfterInvincibleHit = await page.evaluate(() => window.__gameTest.collideZombieWithPlayer(0));
  assert(lifeAfterHit === 2, "首次碰撞没有正确扣 1 条命");
  assert(lifeAfterInvincibleHit === 2, "无敌帧期间发生了连续扣血");

  await page.evaluate(() => {
    window.__gameTest.reset();
    window.__gameTest.setPlayerLives(1, 3);
  });
  await page.evaluate(() => window.__gameTest.collideZombieWithPlayer(0));
  const gameOver = await page.evaluate(() => window.__gameTest.getState());
  assert(gameOver.gameOver === true, "玩家死亡后没有进入游戏结束状态");
  assert(await page.locator("#overlay.show").count() === 1, "游戏结束遮罩没有显示");

  await page.keyboard.press("r");
  await page.waitForTimeout(60);
  const reset = await page.evaluate(() => window.__gameTest.getState());
  assert(reset.gameOver === false, "R 键没有重置游戏结束状态");
  assert(reset.players.every((p) => p.lives === 3 && p.kills === 0 && p.alive), "R 键没有重置玩家状态");
  assert(reset.zombies.length === 0 && reset.bullets.length === 0, "R 键没有清空僵尸或子弹");

  const assetLoaded = await page.evaluate(() => {
    const image = Array.from(document.images).find((img) => img.src.includes("zombie_asset_sheet.png"));
    return !image || image.complete;
  });
  assert(assetLoaded, "ImageGen 素材没有正常加载");
  assert(errors.length === 0, `页面存在错误：${errors.join("; ")}`);

  await browser.close();
  console.log("所有核心玩法测试通过");
})();
