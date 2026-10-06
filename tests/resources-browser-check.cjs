const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    for(const width of [1440,768,390,320]) {
      const context=await browser.newContext({viewport:{width,height:1000}});
      const page=await context.newPage(), errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      const response=await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/resources.html?lang=en');
      assert.equal(response.status(),200);
      assert.equal(await page.locator('#results tr').count(),10);
      assert.equal(await page.locator('#outputGain').textContent(),'+36.00%');
      assert.equal(await page.locator('#chartsPanel').getAttribute('open'),null);
      await page.locator('#chartsPanel > summary').click();
      assert.equal(await page.locator('#gainCharts svg').count(),3);
      await page.locator('[data-chart="efficiencyChart"]').last().click();
      assert.match(await page.locator('#efficiencyChartReadout').textContent(),/MSU/);
      await page.locator('#chartsPanel > summary').click();
      await page.locator('#stackBonuses').uncheck();
      assert.equal(await page.locator('#outputGain').textContent(),'+2.00%');
      await page.locator('#stackBonuses').check();
      await page.locator('#toLevel').fill('1');
      for(const [resource,cost] of [['metal','4,009,500'],['crystal','3,955,500'],['deut','3,982,500']]){
        await page.locator('#resourceSelect').selectOption(resource);
        assert.match(await page.locator('#upgradeCostExact').textContent(),new RegExp('^'+cost+' MSU'));
        assert.match(await page.locator('#buildingInfo').textContent(),/Unlock/);
      }
      await page.locator('#ratioMenu > summary').click();
      await page.locator('#ratioMetal').fill('1');await page.locator('#ratioCrystal').fill('1');
      assert.match(await page.locator('#upgradeCostExact').textContent(),/^2,025,000 MSU/);
      await page.locator('#ratioMenu > summary').click();
      for(const design of ['minimal','cosmic']) for(const lang of ['en','ru']){
        await page.locator('#themeSelect').selectOption(design);await page.locator(lang==='ru'?'#langRu':'#langEn').click();
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.match(await page.locator('h1').textContent(),lang==='ru'?/ресурсных/:/Resource/);
        const fit=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
        assert.ok(fit,'No horizontal page overflow at '+width+' '+design+' '+lang);
      }
      await page.reload();
      assert.equal(await page.locator('#resourceSelect').inputValue(),'deut');
      assert.equal(await page.locator('#stackBonuses').isChecked(),true);
      await page.locator('#fromLevel').fill('');assert.equal(await page.locator('#copyLink').isDisabled(),true);
      assert.deepEqual(errors,[]);
      console.log('PASS live resource calculator '+width+'px, all resources, models, designs and languages');
      await context.close();
    }
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
