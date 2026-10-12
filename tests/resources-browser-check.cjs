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
      assert.equal(await page.locator('#stackBonuses').count(),0);
      assert.equal(await page.locator('.resource-model').count(),0);
      await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/resources.html?lang=en&stack=0');
      assert.equal(await page.locator('#outputGain').textContent(),'+36.00%');
      assert.equal(new URL(page.url()).searchParams.has('stack'),false);
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
        assert.match(await page.locator('h1').textContent(),lang==='ru'?/технологий/:/Technology/);
        const fit=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
        assert.ok(fit,'No horizontal page overflow at '+width+' '+design+' '+lang);
      }
      await page.reload();
      assert.equal(await page.locator('#resourceSelect').inputValue(),'deut');
      assert.equal(await page.locator('#stackBonuses').count(),0);
      await page.locator('#fromLevel').fill('0');await page.locator('#toLevel').fill('10');
      await page.locator('#addTechnology').click();
      assert.equal(await page.locator('.technology-block').count(),2);
      assert.equal(await page.locator('#tech1-resourceSelect').inputValue(),'lithium');
      await page.locator('#tech1-fromLevel').fill('10');await page.locator('#tech1-toLevel').fill('20');
      assert.equal(await page.locator('#tech1-outputGain').textContent(),'+26,47%');
      assert.equal(await page.locator('#tech1-results tr').count(),10);
      assert.match(await page.locator('#tech1-outputMultiplier').textContent(),/литий из аномалий/);
      assert.equal(await page.locator('#results tr').count(),10);
      await page.locator('#tech1-chartsPanel > summary').click();
      assert.equal(await page.locator('#tech1-gainCharts svg').count(),3);
      await page.locator('[data-chart="tech1-totalChart"]').last().click();
      assert.match(await page.locator('#tech1-totalChartReadout').textContent(),/26,47%/);
      assert.equal(await page.locator('#chartsPanel').getAttribute('open'),null);
      await page.locator('#planets').fill('9');
      assert.equal(await page.locator('#tech1-outputGain').textContent(),'+15,25%');
      assert.equal(await page.locator('#outputGain').textContent(),'+18,00%');
      await page.locator('#ratioMenu > summary').click();await page.locator('#ratioMetal').fill('3');await page.locator('#ratioCrystal').fill('2');await page.locator('#ratioMenu > summary').click();
      assert.equal(await page.locator('#tech1-outputGain').textContent(),'+15,25%');
      assert.equal(await page.evaluate(()=>new Set([...document.querySelectorAll('[id]')].map(el=>el.id)).size===document.querySelectorAll('[id]').length),true);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.reload();
      assert.equal(await page.locator('.technology-block').count(),2);
      assert.equal(await page.locator('#tech1-fromLevel').inputValue(),'10');
      assert.equal(await page.locator('#tech1-toLevel').inputValue(),'20');
      await page.locator('#langEn').click();
      assert.match(await page.locator('#tech1-outputMultiplier').textContent(),/anomaly lithium/);
      await page.locator('#tech1-fromLevel').fill('');
      assert.equal(await page.locator('#copyLink').isDisabled(),true);
      assert.equal(await page.locator('#results tr').count(),10);
      await page.locator('#tech1-fromLevel').fill('10');
      await page.locator('.remove-technology').first().click();
      assert.equal(await page.locator('.technology-block').count(),1);
      assert.equal(await page.locator('#resourceSelect').inputValue(),'lithium');
      assert.equal(await page.locator('#outputGain').textContent(),'+15.25%');
      assert.equal(await page.locator('.remove-technology').isDisabled(),true);
      await page.locator('#fromLevel').fill('');assert.equal(await page.locator('#copyLink').isDisabled(),true);
      assert.deepEqual(errors,[]);
      console.log('PASS live resource calculator '+width+'px, all resources, models, designs and languages');
      await context.close();
    }
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
