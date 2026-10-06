const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const defaults = {planets:'18',fromLevel:'0',toLevel:'10',ratioMetal:'3',ratioCrystal:'2',ratioDeut:'1',resourceSelect:'metal'};
function calculator() {
  const elements = {};
  const context = vm.createContext({URL,URLSearchParams,Intl,Number,BigInt,Math,setTimeout,
    document:{body:{dataset:{calculator:'resources'}},getElementById(id){return elements[id] ??= {value:defaults[id]??'',textContent:'',addEventListener(){}}},querySelectorAll(){return []}},
    window:{location:{href:'https://example.com/resources.html',search:''},history:{replaceState(){}}}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../resources.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context);
  return {elements,run:expression=>vm.runInContext(expression,context)};
}
test('matches OGame Utilities resource building checkpoints including floor rounding',()=>{
  const c=calculator();
  for(const [type,level,expected] of [
    ['metal',1,[112500,37500,18000]],['metal',2,[168750,56250,27000]],['metal',3,[253125,84375,40500]],
    ['crystal',1,[37500,67500,27000]],['crystal',4,[126562,227812,91125]],
    ['deut',1,[30000,37500,45000]],['deut',4,[101250,126562,151875]]
  ]) assert.equal(c.run('JSON.stringify(Object.values(resourceCostAtLevel('+level+',"'+type+'")))'),JSON.stringify(expected));
});
test('resource model and costs respond independently to stacking and planets',()=>{
  const c=calculator();
  assert.equal(c.elements.targetLithium.textContent,'+2 pp');
  assert.equal(c.elements.targetIas.textContent,'+36 pp');
  assert.equal(c.elements.outputGain.textContent,'+36.00%');
  assert.equal((c.elements.results.innerHTML.match(/<tr>/g)||[]).length,10);
  const cost=c.elements.upgradeCostExact.textContent;
  c.elements.stackBonuses.checked=false;c.run('render()');
  assert.equal(c.elements.outputGain.textContent,'+2.00%');
  assert.equal(c.elements.upgradeCostExact.textContent,cost);
  assert.equal(c.run('gainSeries(0,10).cumulative.length'),11);
  c.elements.fromLevel.value='';c.run('render()');assert.equal(c.elements.copyLink.disabled,true);
  c.elements.fromLevel.value='0';c.elements.toLevel.value='51';c.run('render()');assert.equal(c.elements.copyLink.disabled,true);
});
