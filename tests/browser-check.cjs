const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 1100, 768, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, isMobile: width < 500, hasTouch: width < 500 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/');
      assert.equal(response.status(), 200);
      await page.locator('#outputGain').waitFor();
      assert.equal(await page.locator('#outputGain').textContent(), '+75.69%');
      assert.equal(await page.locator('#results tr').count(), 5);
      assert.equal(await page.locator('#gainCharts svg').count(), 2);
      assert.equal(await page.locator('[data-chart="stepChart"]').count(), 5);
      assert.equal(await page.locator('[data-chart="totalChart"]').count(), 6);
      assert.equal(await page.locator('[data-chart="totalChart"]').first().getAttribute('data-gain'), '0');
      const totalGain = Number(await page.locator('[data-chart="totalChart"]').last().getAttribute('data-gain'));
      assert.ok(Math.abs(totalGain - 0.756919) < 0.00001);
      await page.locator('[data-chart="totalChart"]').last().click();
      assert.match(await page.locator('#totalChartReadout').textContent(), /75.69%/);
      const layout = await page.evaluate(() => ({
        viewport: innerWidth, document: document.documentElement.scrollWidth,
        inputsFit: [...document.querySelectorAll('input')].every(el => {
          const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth;
        }),
        tableScrollable: document.querySelector('.table-wrap').scrollWidth > document.querySelector('.table-wrap').clientWidth
      }));
      assert.ok(layout.document <= layout.viewport, JSON.stringify(layout));
      assert.ok(layout.inputsFit, JSON.stringify(layout));
      if (width < 500) assert.ok(layout.tableScrollable);
      await page.locator('#fromLevel').fill('1');
      assert.equal(await page.locator('[data-chart="totalChart"]').count(), 60);
      assert.equal(await page.locator('[data-chart="stepChart"]').count(), 59);
      assert.ok(!/NaN|Infinity/.test(await page.locator('#gainCharts').textContent()));
      const longRangeLayout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      assert.ok(longRangeLayout.document <= longRangeLayout.viewport, JSON.stringify(longRangeLayout));
      await page.locator('#planets').fill('1');
      await page.locator('#fromLevel').fill('20');
      await page.locator('#toLevel').fill('21');
      assert.equal(await page.locator('#currentLithium').textContent(), 'From 26,909/h to 31,081/h');
      await page.locator('#ratioMetal').fill('1');
      await page.locator('#ratioCrystal').fill('1');
      assert.match(await page.locator('#upgradeCostExact').textContent(), /^117,136 MSU/);
      await page.locator('#fromLevel').fill('');
      assert.equal(await page.locator('#outputGain').textContent(), '—');
      assert.equal(await page.locator('#copyLink').isDisabled(), true);
      await page.locator('#fromLevel').fill('0');
      await page.locator('#toLevel').fill('1');
      assert.equal(await page.locator('#outputGain').textContent(), 'N/A');
      assert.equal(await page.locator('#gainCharts svg').count(), 0);
      assert.ok(!/NaN|Infinity/.test(await page.locator('#results').textContent()));
      assert.deepEqual(errors, []);
      console.log('PASS live calculator viewport ' + width + 'px');
      await page.locator('#langRu').click();
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      assert.equal(await page.locator('#outputGain').textContent(), 'н/д');
      assert.match(await page.locator('h1').textContent(), /Калькулятор/);
      assert.equal(await page.locator('th').first().textContent(), 'Уровень');
      assert.match(await page.locator('#results').textContent(), /МСУ/);
      await page.locator('#fromLevel').fill('2');
      assert.match(await page.locator('#validation').textContent(), /выше начального/);
      await page.locator('#fromLevel').fill('0');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/');
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      const russianLayout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      assert.ok(russianLayout.document <= russianLayout.viewport, JSON.stringify(russianLayout));
      await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/?lang=en');
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/?lang=ru');
      assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
      await page.locator('#langEn').click();
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.equal(await page.locator('#outputGain').textContent(), '+75.69%');
      assert.equal(await page.locator('#gainCharts svg').count(), 2);
      console.log('PASS EN/RU switch and persistence viewport ' + width + 'px');
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
