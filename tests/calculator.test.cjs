const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
function calculator() {
  const defaults = { planets: '18', fromLevel: '55', toLevel: '60', ratioMetal: '3', ratioCrystal: '2', ratioDeut: '1' };
  const elements = {};
  const context = vm.createContext({ URL, URLSearchParams, Intl, Number, BigInt, Math, setTimeout,
    document: { getElementById(id) { return elements[id] ??= { value: defaults[id] ?? '', textContent: '', addEventListener() {} }; }, querySelectorAll() { return []; } },
    window: { location: { href: 'https://example.com/', search: '' }, history: { replaceState() {} } }
  });
  vm.runInContext(source, context);
  return { elements, run: expression => vm.runInContext(expression, context) };
}
test('matches all supplied in-game lithium checkpoints', () => {
  const c = calculator();
  for (const [level, expected] of [[0,0],[1,220],[20,26909],[21,31081],[22,35817],[33,153286],[34,173724]]) assert.equal(c.run(`lithiumPerPlanet(${level})`), expected);
});
test('base cost, all-planet scaling, cumulative sums and editable MSU ratio', () => {
  const c = calculator();
  assert.equal(c.run('JSON.stringify(costAtLevel(1))'), '{"metal":84,"crystal":42,"deut":14}');
  assert.equal(c.run('JSON.stringify(upgradeResources(0,1,18))'), '{"metal":1512,"crystal":756,"deut":252}');
  assert.equal(c.run('msu(costAtLevel(1), {metal:3,crystal:2,deut:1})'), 189);
  assert.equal(c.run('msu({metal:0,crystal:1,deut:0}, {metal:3,crystal:2,deut:1})'), 1.5);
  assert.equal(c.run('msu(costAtLevel(1), {metal:1,crystal:1,deut:1})'), 140);
  assert.equal(c.run('cumulativeResources(60,18).metal - cumulativeResources(55,18).metal'), c.run('upgradeResources(55,60,18).metal'));
  assert.ok(c.run('Object.values(cumulativeResources(80,50)).every(Number.isSafeInteger)'));
});
test('18 planets, 55 to 60, and invalid/zero-start interface behavior', () => {
  const c = calculator();
  assert.equal(c.elements.currentIas.textContent, 'From 990 IAS');
  assert.equal(c.elements.targetIas.textContent, '1,080');
  assert.equal(c.elements.outputGain.textContent, '+75.69%');
  assert.equal((c.elements.results.innerHTML.match(/<tr>/g)||[]).length, 5);
  c.elements.fromLevel.value = '';
  c.run('render()');
  assert.equal(c.elements.outputGain.textContent, '—');
  assert.equal(c.elements.copyLink.disabled, true);
  c.elements.fromLevel.value = '0'; c.elements.toLevel.value = '1';
  c.run('render()');
  assert.equal(c.elements.outputGain.textContent, 'N/A');
  assert.ok(!/NaN|Infinity/.test(c.elements.results.innerHTML));
  c.elements.ratioMetal.value = 'Infinity';
  c.run('render()');
  assert.match(c.elements.validation.textContent, /finite/);
});

test('chart series use the selected baseline and exclude undefined zero-output gains', () => {
  const c = calculator();
  assert.equal(c.run('gainSeries(55,60).previous.length'), 5);
  assert.equal(c.run('gainSeries(55,60).cumulative.length'), 6);
  assert.equal(c.run('gainSeries(55,60).cumulative[0].gain'), 0);
  assert.equal(c.run('gainSeries(55,60).cumulative.at(-1).gain'), 65768022/37433700-1);
  assert.ok(c.run('gainSeries(1,60).previous.every((p,i,a) => !i || p.gain < a[i-1].gain)'));
  assert.ok(c.run('gainSeries(1,60).cumulative.every((p,i,a) => !i || p.gain > a[i-1].gain)'));
  assert.equal(c.run('gainSeries(0,1).previous.length'), 0);
  assert.equal(c.run('gainSeries(0,1).cumulative.length'), 0);
});

test('MSU per percentage point matches upgrade cost, scales with planets and responds to ratio', () => {
  const c = calculator();
  const before = c.run('lithiumPerPlanet(54)');
  const after = c.run('lithiumPerPlanet(55)');
  const cost = c.run('msu(scaleResources(costAtLevel(55),18),{metal:3,crystal:2,deut:1})');
  assert.equal(c.run('msuPerPercentAtLevel(55,18,{metal:3,crystal:2,deut:1})'), cost/((after/before-1)*100));
  assert.equal(c.run('msuPerPercentAtLevel(55,9,{metal:3,crystal:2,deut:1})'), cost/2/((after/before-1)*100));
  assert.ok(c.run('msuPerPercentAtLevel(55,18,{metal:1,crystal:1,deut:1})') < cost/((after/before-1)*100));
  assert.ok(c.run('Number.isNaN(msuPerPercentAtLevel(1,18,{metal:3,crystal:2,deut:1}))'));
  assert.equal(c.run('efficiencySeries({fromLevel:50,toLevel:60,planets:18,ratio:{metal:3,crystal:2,deut:1}}).length'), 10);
});
