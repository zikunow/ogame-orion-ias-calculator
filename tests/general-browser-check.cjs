const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {for(const width of [1440,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('https://zikunow.github.io/ogame-orion-ias-calculator/general.html?lang=en');
  assert.equal(response.status(),200);
  assert.equal(await page.locator('#pveGainValue').textContent(),'+12.00%');
  assert.equal(await page.locator('#pvpGainValue').textContent(),'+18.00%');
  assert.equal(await page.locator('#labDiscount').textContent(),'−5.00%');
  const positions=await page.evaluate(()=>Object.fromEntries(['planets','raceSelect','labLevel','fromLevel','toLevel','missionSelect','copyLink'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [id,{top:r.top,height:r.height}];})));
  if(width>1100){
   assert.ok(Math.abs(positions.planets.top-positions.raceSelect.top)<1);
   assert.ok(Math.abs(positions.planets.top-positions.labLevel.top)<1);
   assert.ok(Math.abs(positions.fromLevel.top-positions.copyLink.top)<1);
   assert.ok(Math.abs(positions.fromLevel.top-positions.missionSelect.top)<1);
  }
  assert.equal(await page.locator('#chartsPanel').getAttribute('open'),null);
  assert.equal(await page.locator('#tablePanel').getAttribute('open'),null);
  const cost=await page.locator('#upgradeCostExact').textContent();
  await page.locator('#includeBuilding').check();
  assert.ok(await page.locator('#buildingCostInfo').isVisible());
  assert.notEqual(await page.locator('#upgradeCostExact').textContent(),cost);
  assert.equal(await page.locator('#pvpGainValue').textContent(),'+18.00%');
  for(const race of ['human','rocktal','mecha','kaelesh']){await page.locator('#raceSelect').selectOption(race);assert.equal(await page.locator('#labDiscount').textContent(),'−5.00%');}
  await page.locator('#chartsPanel > summary').click();await page.locator('#tablePanel > summary').click();
  assert.equal(await page.locator('#gainCharts svg').count(),3);
  assert.equal(await page.locator('#results tr').count(),10);
  const pvp=Number(await page.locator('[data-chart="totalChart"]').last().getAttribute('data-gain'));
  assert.ok(Math.abs(pvp-.18)<1e-12);
  await page.locator('#missionSelect').selectOption('pve');
  assert.ok(Math.abs(Number(await page.locator('[data-chart="totalChart"]').last().getAttribute('data-gain'))-.12)<1e-12);
  await page.locator('#labLevel').fill('100');assert.equal(await page.locator('#labDiscount').textContent(),'−25.00%');
  await page.locator('#labLevel').fill('20');await page.locator('#langRu').click();
  assert.match(await page.locator('h1').textContent(),/T18 Генерала/);
  for(const theme of ['minimal','cosmic']){
   await page.locator('#themeSelect').selectOption(theme);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Viewport overflow '+width+' '+theme);
  }
  await page.locator('#ratioMenu > summary').click();
  assert.ok(await page.locator('.ratio-popover').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));
  await page.locator('#ratioMenu > summary').click();
  await page.reload();assert.equal(await page.locator('#includeBuilding').isChecked(),true);assert.equal(await page.locator('#raceSelect').inputValue(),'kaelesh');assert.equal(await page.locator('#missionSelect').inputValue(),'pve');
  await page.locator('#fromLevel').fill('');assert.equal(await page.locator('#copyLink').isDisabled(),true);
  assert.deepEqual(errors,[]);console.log('PASS General T18 EN/RU, both themes and controls '+width+'px');await context.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
