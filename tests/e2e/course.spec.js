const { test, expect } = require('@playwright/test');

// Optional web fonts must not make course acceptance depend on a third-party network.
// Exercise the supported local-font fallback without intercepting any course asset.
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
});

async function openLesson(page, name) {
  const activate = locator => test.info().project.use.hasTouch ? locator.tap() : locator.click();
  const menu = page.getByRole('button', { name: '打开课程目录', exact: true });
  if (await menu.isVisible()) {
    await activate(menu);
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
  }
  await activate(page.getByRole('navigation', { name: '课程目录' }).getByRole('button', { name }));
  if (await menu.isVisible()) {
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(async () => {
      const box = await page.locator('#sidebar').boundingBox();
      return box.x + box.width;
    }).toBeLessThanOrEqual(0);
  }
}

test('four lessons work, wrong answers do not complete lessons, progress survives refresh', async ({ page, request }, testInfo) => {
  const pageErrors = [];
  const failedAssets = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', req => {
    if (/\/(app\.js|styles\.css)(?:\?|$)/.test(req.url())) failedAssets.push(req.url());
  });
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(/从零理解黎曼猜想/);
  for (const [asset, mime] of [['styles.css', /text\/css/], ['app.js', /(?:javascript|ecmascript)/], ['extra-lessons.js', /(?:javascript|ecmascript)/]]) {
    const response = await request.get(`/${asset}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(mime);
  }

  await page.getByRole('button', { name: '开始第一节 →', exact: true }).click();
  await page.getByRole('region', { name: '可交互实验' }).getByRole('button', { name: '2', exact: true }).click();
  await expect(page.locator('.machine-box strong').last()).toHaveText('5');
  const input = page.getByRole('slider', { name: '函数输入值' });
  await input.press('End');
  await expect(page.locator('.machine-box strong').last()).toHaveText('25');
  const quiz = page.getByRole('group', { name: '选择答案' });
  await quiz.getByRole('button', { name: '8', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('还差一点');
  await expect(page.locator('#progressText')).toHaveText('0 / 9');
  await quiz.getByRole('button', { name: '9', exact: true }).click();
  await expect(page.locator('#progressText')).toHaveText('1 / 9');

  await page.getByRole('button', { name: '下一节 →', exact: true }).click();
  await page.getByRole('button', { name: '1 项', exact: true }).click();
  await expect(page.locator('.metric strong').first()).toHaveText('1.000000');
  await page.getByRole('slider', { name: 'ζ(2) 累加项数' }).press('ArrowRight');
  await expect(page.locator('.metric strong').first()).toHaveText('1.250000');
  await page.getByRole('slider', { name: 'ζ(2) 累加项数' }).press('End');
  const partial = Number(await page.locator('.metric strong').first().textContent());
  // Integral bounds for the omitted tail: 1/201 < zeta(2) - S_200 < 1/200.
  const error = Math.PI ** 2 / 6 - partial;
  expect(error).toBeGreaterThan(1 / 201 - 0.0000005);
  expect(error).toBeLessThan(1 / 200 + 0.0000005);
  await expect(page.locator('.bar-label')).toContainText('0.004988');
  await quiz.getByRole('button', { name: '1.25', exact: true }).click();

  await page.getByRole('button', { name: '下一节 →', exact: true }).click();
  for (const [index, value] of ['i', '−1', '−i', '1'].entries()) {
    await page.getByRole('button', { name: '× i · 再旋转 90° ↶', exact: true }).click();
    await expect(page.locator('.metric strong').first()).toHaveText(value);
    await expect(page.locator('.metric strong').last()).toHaveText(`${(index + 1) * 90}°`);
  }
  await page.getByRole('button', { name: '回到 1', exact: true }).click();
  await expect(page.locator('.metric strong').last()).toHaveText('0°');
  await quiz.getByRole('button', { name: '−1', exact: true }).click();

  await page.getByRole('button', { name: '下一节 →', exact: true }).click();
  await page.getByRole('slider', { name: '实部 a', exact: true }).press('Home');
  await page.getByRole('slider', { name: '虚部系数 b', exact: true }).press('End');
  await expect(page.locator('.math-result')).toContainText('(-4, 4)');
  await expect(page.getByRole('img')).toHaveAttribute('aria-label', '复平面坐标图，点 -4 + 4i');
  // Check the rendered point moves to the upper-left quadrant, not just its label.
  await expect(page.locator('.plane-point')).toHaveAttribute('cx', '75');
  await expect(page.locator('.plane-point')).toHaveAttribute('cy', '39');
  await quiz.getByRole('button', { name: '(3, 2)', exact: true }).click();
  await expect(page.locator('#progressText')).toHaveText('4 / 9');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#progressText')).toHaveText('4 / 9');
  await expect(page.getByRole('heading', { name: /已开放的课程实验/ })).toContainText('4/9 完成');
  await openLesson(page, /04 复数为什么像二维坐标/);
  await expect(page.getByRole('status')).toContainText('这节课已完成');
  await page.evaluate(() => window.scrollTo(0, 0));
  await testInfo.attach('completed-course', { body: await page.screenshot({ fullPage: true, animations: 'disabled' }), contentType: 'image/png' });
  expect(pageErrors).toEqual([]);
  expect(failedAssets).toEqual([]);
});

test('overview and all lessons fit the viewport and mobile navigation closes', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/从零理解黎曼猜想/);
  for (const [id, name] of [
    ['home', /课程总览/],
    ['machine', /01 函数是一台计算机器/],
    ['zeta', /02 ζ\(2\)/],
    ['rotate', /03 为什么乘以 i/],
    ['plane', /04 复数为什么/],
  ]) {
    await openLesson(page, name);
    if (id === 'machine' && testInfo.project.use.hasTouch) {
      const slider = page.getByRole('slider', { name: '函数输入值' });
      const box = await slider.boundingBox();
      await slider.tap({ position: { x: box.width * 0.75, y: box.height / 2 } });
      await expect(page.locator('#inputValue')).toHaveText('9');
      await expect(page.locator('.machine-box strong').last()).toHaveText('19');
    }
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    await page.evaluate(() => window.scrollTo(0, 0));
    await testInfo.attach(id, { body: await page.screenshot({ fullPage: true, animations: 'disabled' }), contentType: 'image/png' });
  }
});
