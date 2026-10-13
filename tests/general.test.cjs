const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const defaults = {planets:'18',fromLevel:'0',toLevel:'10',ratioMetal:'3',ratioCrystal:'2',ratioDeut:'1',raceSelect:'mecha',labLevel:'20',lifeformLevel:'0',techBoost:'0',missionSelect:'pvp'};
function calculator() {
  const elements = {};
  const context = vm.createContext({URL,URLSearchParams,Intl,Number,BigInt,Math,setTimeout,
    document:{body:{dataset:{calculator:'general'}},getElementById(id){return elements[id] ??= {value:defaults[id]??'',textContent:'',addEventListener(){}}},querySelectorAll(){return []}},
    window:{location:{href:'https://example.com/general.html',search:''},history:{replaceState(){}}}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../general.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context);
  return {elements,run:expression=>vm.runInContext(expression,context)};
}
test('exact T18 costs include level factor and local capped discount',()=>{
 const c=calculator();
 assert.equal(c.run('generalCostAtLevel(1,0).metal'),300000n);
 assert.equal(c.run('generalCostAtLevel(2,0).metal'),1020000n);
 assert.equal(c.run('generalCostAtLevel(1,20).metal'),285000n);
 assert.equal(c.run('generalCostAtLevel(1,100).metal'),225000n);
 assert.equal(c.run('generalDiscount(200)'),.25);
});
test('all lifeform building bases and cost scaling',()=>{
 const c=calculator();
 for(const [race,base] of [['human',[20000,25000,10000]],['rocktal',[40000,10000,15000]],['mecha',[30000,20000,10000]],['kaelesh',[20000,15000,15000]]]){
  for(const [key,index] of [['metal',0],['crystal',1],['deut',2]]){
   assert.equal(c.run('generalLabCostAtLevel(1,"'+race+'").'+key),BigInt(base[index]));
   assert.equal(c.run('generalLabCostAtLevel(2,"'+race+'").'+key),BigInt(base[index]*2.6));
  }
 }
});
test('PvE/PvP differ and optional building cost is added once without changing rewards',()=>{
 const c=calculator();
 assert.equal(c.elements.pveGainValue.textContent,'+12.00%');
 assert.equal(c.elements.pvpGainValue.textContent,'+18.00%');
 const before=c.run('msu(upgradeResources(0,10,18),readState().ratio)');
 c.elements.includeBuilding.checked=true;c.run('render()');
 assert.equal(c.run('msu(addResources(upgradeResources(0,10,18),generalLabTotal(20,"mecha",18)),readState().ratio)'),before+c.run('msu(generalLabTotal(20,"mecha",18),readState().ratio)'));
 assert.equal(c.elements.pveGainValue.textContent,'+12.00%');
 assert.equal((c.elements.results.innerHTML.match(/<tr>/g)||[]).length,10);
 c.elements.lifeformLevel.value='50';c.elements.techBoost.value='5';
 assert.ok(Math.abs(c.run('generalEnhancement(10,generalSettings())')-.396)<1e-12);
 c.elements.labLevel.value='';c.run('render()');assert.equal(c.elements.copyLink.disabled,true);
});
