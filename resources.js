// Community reference observed on 2026-10-06: https://ogameutilities.it/Ogame-Orion/
// Names below are descriptive translations, not verified official localizations.
const resourceBuildings = {
  metal: { base: [112500, 37500, 18000], unlock: 150, en: "Metal recycling line", ru: "Линия переработки металла" },
  crystal: { base: [37500, 67500, 27000], unlock: 200, en: "Crystal treatment", ru: "Обработка кристалла" },
  deut: { base: [30000, 37500, 45000], unlock: 300, en: "High-pressure deuterium tanks", ru: "Резервуары дейтерия высокого давления" }
};
const resourceText = {
  "OGame Orion IAS Calculator": { en: "OGame Orion Resource Bonus Calculator", ru: "Калькулятор ресурсных бонусов Ориона" },
  "IAS level": { en: "Building level", ru: "Уровень подздания" },
  "Lithium output gain charts": { en: "Mission resource bonus charts", ru: "Графики ресурсных бонусов миссий" },
  "MSU per +1% output": { en: "MSU per +1% modeled reward", ru: "МСУ за +1% награды по модели" },
  "Upgrade MSU divided by its percentage gain versus the previous level. All selected planets; lower is cheaper.": {en: "Upgrade MSU divided by the modeled reward gain versus the previous level. All selected planets; lower is cheaper.", ru: "Стоимость улучшения в МСУ, делённая на прирост награды по модели к предыдущему уровню. Для всех выбранных планет; ниже — дешевле."},
  "The starting level is 0%; each point compares output with that same starting level.": {en: "Each point compares modeled rewards with the selected starting level; the baseline point is 0%.", ru: "Каждая точка сравнивает награду по модели с выбранным начальным уровнем; в начальной точке прирост 0%."},
  "These charts show lithium output, not confirmed loot gains or payback. Y axes use separate linear scales starting at zero.": {
    en: "Reward gains follow the selected model (base reward × (1 + bonus)). Stacking across planets is unverified. Other modifiers are excluded; this is not a payback forecast.",
    ru: "Прирост рассчитан по выбранной модели: базовая награда × (1 + бонус). Сложение между планетами не подтверждено. Другие модификаторы исключены; это не прогноз окупаемости."
  },
  "Starting IAS level must be an integer from 0 to 79.": {en: "Starting building level must be an integer from 0 to 49.", ru: "Начальный уровень подздания должен быть целым числом от 0 до 49."},
  "Target IAS level must be an integer from 1 to 80.": {en: "Target building level must be an integer from 1 to 50.", ru: "Целевой уровень подздания должен быть целым числом от 1 до 50."},
  "Target IAS level must be higher than the starting level.": {en: "Target building level must be higher than the starting level.", ru: "Целевой уровень подздания должен быть выше начального."}
};
function resourceCostAtLevel(level, type) {
  if (!level) return { metal: 0, crystal: 0, deut: 0 };
  const numerator = 3n ** BigInt(level - 1), denominator = 2n ** BigInt(level - 1);
  const [metal, crystal, deut] = resourceBuildings[type].base.map(base => Number(BigInt(base) * numerator / denominator));
  return { metal, crystal, deut };
}
function resourceFactor(level) {
  const planets = Number($("planets").value);
  const contributing = $("stackBonuses").checked ? planets : 1;
  return 1 + 0.002 * level * contributing;
}
function initializeResources() {
  const pairs = {
    s1: ["Orion Resource Bonus Calculator", "Калькулятор ресурсных бонусов Ориона"],
    s2: ["Compare Control Center resource-building costs across your planets and explore mission reward bonuses.", "Сравните стоимость ресурсных подзданий Центра управления на ваших планетах и бонусы к наградам миссий."],
    s4: ["Starting building level", "Начальный уровень подздания"],
    s5: ["Target building level", "Целевой уровень подздания"],
    s12: ["Bonus per building", "Бонус одного подздания"],
    s13: ["Modeled reward gain", "Прирост награды по модели"],
    s14: ["Selected bonus model", "Выбранная модель бонуса"],
    s16: ["Each row upgrades the selected resource building on <strong>every selected planet</strong>.", "Каждая строка — улучшение выбранного ресурсного подздания <strong>на всех выбранных планетах</strong>."],
    s17: ["Scroll horizontally. Bonus is shown in percentage points (pp); relative reward gains use the selected model.", "Прокрутите таблицу по горизонтали. Бонус указан в процентных пунктах (п.п.); относительный прирост награды рассчитан по выбранной модели."],
    s21: ["Total building levels", "Суммарные уровни"],
    s22: ["Modeled bonus<br><span>percentage points</span>", "Бонус по модели<br><span>процентные пункты</span>"],
    s28: ["Level cost per planet", "Стоимость уровня на одной планете"],
    s29: ["floor(Base resource cost × 1.5^(L−1))", "⌊Базовая стоимость ресурса × 1,5^(L−1)⌋"],
    small0: ["Each resource is floored separately, matching the reference calculator.", "Каждый ресурс округляется вниз отдельно, как в справочном калькуляторе."],
    s30: ["Bonus per building", "Бонус одного подздания"],
    s31: ["0.2 percentage points × L", "0,2 процентного пункта × L"],
    small1: ["Applies to the selected resource from missions, not mine production.", "Относится к выбранному ресурсу из миссий, не к выработке шахт."],
    s34: ["Costs and unlocks come from a community calculator, not independently verified game data. Additive cross-planet stacking is a selectable, unverified scenario. This calculator excludes unlock mission costs and other reward modifiers. Levels 0–50 are a calculator range, not a confirmed game cap. Building names are descriptive translations.", "Цены и условия открытия взяты из калькулятора сообщества, а не независимо проверены в игре. Сложение бонусов между планетами — переключаемый неподтверждённый сценарий. Затраты на миссии открытия и другие бонусы не учитываются. Диапазон 0–50 — ограничение калькулятора, не подтверждённый игровой максимум. Названия подзданий — описательный перевод."],
    resourceChoice: ["Resource", "Ресурс"],
    stackModel: ["Model: bonuses stack across planets", "Модель: бонусы складываются между планетами"],
    sourceWarning: ["Costs and +0.2 pp per level are from a community reference. Cross-planet stacking is unverified. Disable the model to use one building's bonus while keeping upgrade costs for all planets.", "Цены и +0,2 п.п. за уровень — из справочника сообщества. Сложение между планетами не подтверждено. Отключите модель, чтобы использовать бонус одного подздания, сохранив затраты на все планеты."],
    sourceLink: ["Source: OGame Utilities ↗", "Источник: OGame Utilities ↗"],
    showCharts: ["Show charts", "Показать графики"],
    hideCharts: ["Hide charts", "Скрыть графики"],
    chartsCaption: ["Modeled reward gain and cost efficiency", "Прирост награды по модели и эффективность затрат"]
  };
  for (const [key, [en, ru]] of Object.entries(pairs)) staticTranslations[key] = { en, ru };
  const params = new URLSearchParams(window.location.search);
  if (resourceBuildings[params.get("resource")]) $("resourceSelect").value = params.get("resource");
  $("stackBonuses").checked = params.get("stack") !== "0";
  $("resourceSelect").addEventListener("change", render);
  $("stackBonuses").addEventListener("change", render);
}
function renderResources() {
  const state = readState();
  const error = validate(state) || (state.fromLevel > 49 || state.toLevel > 50 ? (language === "ru" ? "Диапазон калькулятора: начальный уровень 0–49, целевой 1–50." : "Calculator range: starting level 0–49, target level 1–50.") : "");
  $("ratioValue").textContent = [els.ratioMetal, els.ratioCrystal, els.ratioDeut].map(input => input.value || "—").join(":");
  els.validation.hidden = !error;
  els.validation.textContent = error;
  els.copyLink.disabled = Boolean(error);
  if (error) {
    els.results.innerHTML = "";
    $("gainCharts").innerHTML = "";
    ["upgradeCost", "upgradeCostExact", "targetLithium", "currentLithium", "outputGain", "outputMultiplier", "targetIas", "currentIas", "resourceTotals", "buildingInfo"].forEach(id => $(id).textContent = "—");
    els.tableTitle.textContent = t("Check your inputs");
    return;
  }
  updateUrl(state);
  const url = new URL(window.location.href);
  url.searchParams.set("resource", $("resourceSelect").value);
  url.searchParams.set("stack", $("stackBonuses").checked ? "1" : "0");
  window.history.replaceState({}, "", url);
  const building = resourceBuildings[$("resourceSelect").value];
  const pp = value => fmt(value) + (language === "ru" ? " п.п." : " pp");
  const start = resourceFactor(state.fromLevel), target = resourceFactor(state.toLevel);
  const total = upgradeResources(state.fromLevel, state.toLevel, state.planets);
  const exact = resources => (language === "ru" ? "Металл " : "Metal ") + fmt(resources.metal) + (language === "ru" ? " · Кристалл " : " · Crystal ") + fmt(resources.crystal) + (language === "ru" ? " · Дейтерий " : " · Deuterium ") + fmt(resources.deut);
  els.upgradeCost.textContent = fmtCompact(msu(total, state.ratio)) + " " + t("MSU");
  els.upgradeCostExact.textContent = fmt(msu(total, state.ratio)) + " " + t("MSU") + " · " + resourceLine(total);
  els.targetLithium.textContent = "+" + pp(0.2 * state.toLevel);
  els.currentLithium.textContent = pp(0.2 * state.fromLevel) + " → " + pp(0.2 * state.toLevel);
  els.outputGain.textContent = "+" + fmtPct(target / start - 1);
  els.outputMultiplier.textContent = "×" + (target / start).toFixed(4) + (language === "ru" ? " к старту" : " vs start");
  els.targetIas.textContent = "+" + pp((target - 1) * 100);
  els.currentIas.textContent = pp((start - 1) * 100) + " → " + pp((target - 1) * 100);
  $("resourceTotals").textContent = exact(total);
  $("buildingInfo").textContent = building[language] + (language === "ru" ? " · Открытие: завершить миссию аномалии уровня " : " · Unlock: complete an anomaly mission of level ") + building.unlock + (language === "ru" ? " · Базовая цена: " : " · Base cost: ") + exact(resourceCostAtLevel(1, $("resourceSelect").value));
  els.tableTitle.textContent = t("Levels {from} → {to}", {from:state.fromLevel,to:state.toLevel});
  const rows = [];
  for (let level = state.fromLevel + 1; level <= state.toLevel; level++) {
    const cost = scaleResources(costAtLevel(level), state.planets), factor = resourceFactor(level);
    rows.push("<tr><td><strong>" + level + "</strong><small>" + (level-1) + " → " + level + "</small></td><td><strong>" + fmtCompact(msu(cost,state.ratio)) + " " + t("MSU") + "</strong><small>" + exact(cost) + "</small></td><td>" + fmtCompact(msu(upgradeResources(state.fromLevel,level,state.planets),state.ratio)) + "</td><td>" + fmtCompact(msu(cumulativeResources(level,state.planets),state.ratio)) + "</td><td>" + fmt(level * state.planets) + "</td><td><strong>+" + pp((factor-1)*100) + "</strong><small>+" + pp(0.2*level) + (language === "ru" ? " / подздание" : " / building") + "</small></td><td>+" + fmtPct(factor / resourceFactor(level-1)-1) + "</td><td>+" + fmtPct(factor/start-1) + "</td><td>" + fmtCompact(msuPerPercentAtLevel(level,state.planets,state.ratio)) + "</td></tr>");
  }
  els.results.innerHTML = rows.join("");
  renderCharts(state);
}
