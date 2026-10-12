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
      assert.equal(await page.locator('.technology-block').count(),0);
      assert.equal(await page.locator('#combinedSummary').isVisible(),false);
      assert.equal(await page.locator('#technologyHelp').isVisible(),false);
      await page.locator('#addTechnology').click();
      assert.equal(await page.locator('.technology-block').count(),1);
      assert.equal(await page.locator('#resourceSelect').inputValue(),'metal');
      assert.equal(await page.locator('#outputGain').textContent(),'+36.00%');
      await page.locator('#toLevel').fill('1');
      assert.equal(await page.locator('#results tr').count(),1);
      assert.equal(await page.locator('#tablePanel').getAttribute('open'),null);
      assert.equal(await page.locator('#chartsPanel').getAttribute('open'),null);
      await page.locator('#tablePanel > summary').click();
      await page.locator('#chartsPanel > summary').click();
      assert.equal(await page.locator('#results').isVisible(),true);
      assert.equal(await page.locator('#gainCharts svg').count(),3);
      await page.locator('#addTechnology').click();
      assert.equal(await page.locator('.technology-block').count(),2);
      for(const id of ['chartsPanel','tablePanel','tech1-chartsPanel','tech1-tablePanel'])
        assert.equal(await page.locator('#'+id).getAttribute('open'),null);
      await page.locator('#tech1-resourceSelect').selectOption('lithium');
      await page.locator('#tech1-toLevel').fill('1');
      assert.match(await page.locator('#combinedCostExact').textContent(),/^7,992,000 MSU/);
      assert.match(await page.locator('#combinedResourceGains').textContent(),/Metal.*3.60%/);
      assert.equal(await page.locator('#combinedLithiumGain').textContent(),'+3.60%');
      assert.match(await page.locator('#tech1-outputMultiplier').textContent(),/anomaly lithium/);
      await page.locator('#tech1-chartsPanel > summary').click();
      await page.locator('[data-chart="tech1-totalChart"]').last().click();
      assert.match(await page.locator('#tech1-totalChartReadout').textContent(),/3.60%/);
      await page.locator('#planets').fill('9');
      assert.match(await page.locator('#combinedCostExact').textContent(),/^3,996,000 MSU/);
      assert.equal(await page.locator('#combinedLithiumGain').textContent(),'+1.80%');
      await page.locator('#ratioMenu > summary').click();
      await page.locator('#ratioMetal').fill('1');await page.locator('#ratioCrystal').fill('1');
      await page.locator('#ratioMenu > summary').click();
      assert.match(await page.locator('#combinedCostExact').textContent(),/^2,659,500 MSU/);
      assert.equal(await page.locator('#combinedLithiumGain').textContent(),'+1.80%');
      await page.locator('#tech1-fromLevel').fill('');
      assert.equal(await page.locator('#combinedCost').textContent(),'—');
      assert.equal(await page.locator('#copyLink').isDisabled(),true);
      assert.equal(await page.locator('#results tr').count(),1);
      await page.locator('#tech1-fromLevel').fill('0');
      for(const design of ['minimal','cosmic']) for(const lang of ['en','ru']){
        await page.locator('#themeSelect').selectOption(design);
        await page.locator(lang==='ru'?'#langRu':'#langEn').click();
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.match(await page.locator('#combinedSummary h2').textContent(),lang==='ru'?/Итог/:/All selected/);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow at '+width+' '+design+' '+lang);
      }
      await page.locator('#langEn').click();
      assert.equal(await page.evaluate(()=>new Set([...document.querySelectorAll('[id]')].map(el=>el.id)).size===document.querySelectorAll('[id]').length),true);
      await page.reload();
      assert.equal(await page.locator('.technology-block').count(),2);
      assert.equal(await page.locator('#tech1-resourceSelect').inputValue(),'lithium');
      assert.equal(await page.locator('#tech1-toLevel').inputValue(),'1');
      assert.match(await page.locator('#combinedCostExact').textContent(),/^2,659,500 MSU/);
      await page.locator('.remove-technology').first().click();
      assert.equal(await page.locator('#resourceSelect').inputValue(),'lithium');
      assert.equal(await page.locator('#combinedResourcesCard').isVisible(),false);
      await page.locator('.remove-technology').click();
      assert.equal(await page.locator('.technology-block').count(),0);
      assert.equal(await page.locator('#combinedSummary').isVisible(),false);
      await page.reload();
      assert.equal(await page.locator('.technology-block').count(),0);
      for(let i=0;i<4;i++) await page.locator('#addTechnology').click();
      assert.equal(await page.locator('.technology-block').count(),4);
      assert.equal(await page.locator('#addTechnology').isDisabled(),true);
      assert.equal(await page.locator('#tech3-resourceSelect').inputValue(),'lithium');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/resources.html?lang=en&resource=metal&from=0&to=10&p=18&stack=0');
      assert.equal(await page.locator('.technology-block').count(),1);
      assert.equal(await page.locator('#outputGain').textContent(),'+36.00%');
      assert.equal(new URL(page.url()).searchParams.has('stack'),false);
      assert.deepEqual(errors,[]);
      console.log('PASS compact planner '+width+'px: empty start, collapse, totals, lithium, URLs, removal, EN/RU and themes');
      await context.close();
    }
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
