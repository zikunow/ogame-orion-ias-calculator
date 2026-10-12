// Community reference: https://ogameutilities.it/Ogame-Orion/
// Resource checkpoints observed 2026-10-06; lithium engine.mjs inspected 2026-10-12.
// Names below are descriptive translations, not verified official localizations.
const resourceBuildings = {
  metal: { base: [112500, 37500, 18000], unlock: 150, en: "Metal recycling line", ru: "Линия переработки металла" },
  crystal: { base: [37500, 67500, 27000], unlock: 200, en: "Crystal treatment", ru: "Обработка кристалла" },
  deut: { base: [30000, 37500, 45000], unlock: 300, en: "High-pressure deuterium tanks", ru: "Резервуары дейтерия высокого давления" },
  lithium: { base: [52500, 37500, 37500], unlock: 100, en: "Lithium electrolysis laboratory", ru: "Лаборатория электролиза лития" }
};
const resourceText = {
  "OGame Orion IAS Calculator": { en: "OGame Orion Technology Calculator", ru: "Калькулятор технологий Ориона" },
  "IAS level": { en: "Building level", ru: "Уровень подздания" },
  "Lithium output gain charts": { en: "Mission resource bonus charts", ru: "Графики ресурсных бонусов миссий" },
  "MSU per +1% output": { en: "MSU per +1% modeled reward", ru: "МСУ за +1% награды по модели" },
  "Upgrade MSU divided by its percentage gain versus the previous level. All selected planets; lower is cheaper.": {en: "Upgrade MSU divided by the modeled reward gain versus the previous level. All selected planets; lower is cheaper.", ru: "Стоимость улучшения в МСУ, делённая на прирост награды по модели к предыдущему уровню. Для всех выбранных планет; ниже — дешевле."},
  "The starting level is 0%; each point compares output with that same starting level.": {en: "Each point compares modeled rewards with the selected starting level; the baseline point is 0%.", ru: "Каждая точка сравнивает награду по модели с выбранным начальным уровнем; в начальной точке прирост 0%."},
  "These charts show lithium output, not confirmed loot gains or payback. Y axes use separate linear scales starting at zero.": {
    en: "Bonuses from all selected planets are added: 0.2 percentage points × level × planets. Relative gains compare base reward × (1 + bonus). Other modifiers are excluded; this is not a payback forecast.",
    ru: "Бонусы всех выбранных планет складываются: 0,2 процентного пункта × уровень × планеты. Относительный прирост сравнивает базовую награду × (1 + бонус). Другие модификаторы исключены; это не прогноз окупаемости."
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
  return 1 + 0.002 * level * planets;
}
function initializeResources() {
  const pairs = {
    s1: ["Orion Technology Calculator", "Калькулятор технологий Ориона"],
    s2: ["Add resource or lithium technologies, choose their upgrade ranges and compare costs and anomaly reward gains. Planet count applies to every technology.", "Добавьте технологии ресурсов или лития, выберите уровни улучшений и сравните затраты и прирост наград аномалий. Количество планет общее для всех технологий."],
    s4: ["Starting building level", "Начальный уровень подздания"],
    s5: ["Target building level", "Целевой уровень подздания"],
    s12: ["Bonus per building", "Бонус одного подздания"],
    s13: ["Reward gain", "Прирост награды"],
    s14: ["Total reward bonus", "Суммарный бонус награды"],
    s16: ["Each row upgrades the selected resource building on <strong>every selected planet</strong>.", "Каждая строка — улучшение выбранного ресурсного подздания <strong>на всех выбранных планетах</strong>."],
    s17: ["Scroll horizontally. Bonus is shown in percentage points (pp); relative reward gains use the selected model.", "Прокрутите таблицу по горизонтали. Бонус указан в процентных пунктах (п.п.); относительный прирост награды рассчитан по выбранной модели."],
    s21: ["Total building levels", "Суммарные уровни"],
    s22: ["Total bonus<br><span>percentage points</span>", "Суммарный бонус<br><span>процентные пункты</span>"],
    s28: ["Level cost per planet", "Стоимость уровня на одной планете"],
    s29: ["floor(Base resource cost × 1.5^(L−1))", "⌊Базовая стоимость ресурса × 1,5^(L−1)⌋"],
    small0: ["Each resource is floored separately, matching the reference calculator.", "Каждый ресурс округляется вниз отдельно, как в справочном калькуляторе."],
    s30: ["Bonus per building", "Бонус одного подздания"],
    s31: ["0.2 percentage points × L", "0,2 процентного пункта × L"],
    small1: ["Applies to the selected resource from missions, not mine production.", "Относится к выбранному ресурсу из миссий, не к выработке шахт."],
    s34: ["Costs and unlocks come from a community calculator, not independently verified game data. This calculator excludes unlock mission costs and other reward modifiers. Levels 0–50 are a calculator range, not a confirmed game cap. Building names are descriptive translations.", "Цены и условия открытия взяты из калькулятора сообщества, а не независимо проверены в игре. Затраты на миссии открытия и другие бонусы не учитываются. Диапазон 0–50 — ограничение калькулятора, не подтверждённый игровой максимум. Названия подзданий — описательный перевод."],
    resourceChoice: ["Resource", "Ресурс"],
    lithiumChoice: ["Lithium", "Литий"],
    sharedPlanets: ["Planet count applies to every technology below.", "Количество планет применяется ко всем технологиям ниже."],
    addTechnology: ["+ Add technology", "+ Добавить технологию"],
    removeTechnology: ["Remove", "Удалить"],
    showTable: ["Show upgrade table", "Показать таблицу улучшений"],
    hideTable: ["Hide upgrade table", "Скрыть таблицу улучшений"],
    combinedHeading: ["All selected technologies", "Итог по всем технологиям"],
    combinedCostLabel: ["Total upgrade cost", "Общая стоимость улучшений"],
    combinedResourcesLabel: ["Resource reward gains", "Прирост ресурсных наград"],
    combinedResourcesHelp: ["Each percentage applies to its resource; different resource percentages are not added together.", "Каждый процент относится к своему ресурсу; проценты разных ресурсов не складываются."],
    combinedLithiumLabel: ["Lithium reward gain", "Прирост лития в награде"],
    combinedLithiumHelp: ["Lithium is shown separately; its upgrade cost is included in the total MSU.", "Литий показан отдельно; стоимость его улучшений включена в общие МСУ."],
    sourceLink: ["Source: OGame Utilities ↗", "Источник: OGame Utilities ↗"],
    showCharts: ["Show charts", "Показать графики"],
    hideCharts: ["Hide charts", "Скрыть графики"],
    chartsCaption: ["Reward gain and cost efficiency", "Прирост награды и эффективность затрат"]
  };
  for (const [key, [en, ru]] of Object.entries(pairs)) staticTranslations[key] = { en, ru };
  const params = new URLSearchParams(window.location.search);
  if (resourceBuildings[params.get("resource")]) $("resourceSelect").value = params.get("resource");
  $("resourceSelect").addEventListener("change", render);
  initializeTechnologyPlanner(params);
}
function renderSingleResource() {
  const state = readState();
  const duplicate = resourceRenderScope && technologyPanels.some(panel => panel !== resourceRenderScope && panel.querySelector('[data-field="resourceSelect"]').value === $("resourceSelect").value);
  const error = validate(state) || (state.fromLevel > 49 || state.toLevel > 50 ? (language === "ru" ? "Диапазон калькулятора: начальный уровень 0–49, целевой 1–50." : "Calculator range: starting level 0–49, target level 1–50.") : "") || (duplicate ? (language === "ru" ? "Эта технология уже добавлена. Выберите другую." : "This technology is already added. Choose a different one.") : "");
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
  if (!resourceRenderScope) {
    updateUrl(state);
    const url = new URL(window.location.href);
    url.searchParams.set("resource", $("resourceSelect").value);
    url.searchParams.delete("stack");
    window.history.replaceState({}, "", url);
  }
  const building = resourceBuildings[$("resourceSelect").value];
  const lithium = $("resourceSelect").value === "lithium";
  if (resourceRenderScope) {
    $("technologyTitle").textContent = building[language];
    resourceRenderScope.querySelector('[data-i18n="s13"]').textContent = lithium ? (language === "ru" ? "Прирост лития в награде" : "Lithium reward gain") : staticTranslations.s13[language];
    resourceRenderScope.querySelector('[data-i18n="s22"]').innerHTML = lithium ? (language === "ru" ? "Бонус лития в награде<br><span>процентные пункты</span>" : "Lithium reward bonus<br><span>percentage points</span>") : staticTranslations.s22[language];
    resourceRenderScope.querySelector('[data-i18n="s25"]').textContent = lithium ? (language === "ru" ? "МСУ / +1% лития" : "MSU / +1% lithium") : staticTranslations.s25[language];
  }
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
  els.tableTitle.textContent = t("Levels {start} → {target}", {start:state.fromLevel,target:state.toLevel});
  const rows = [];
  for (let level = state.fromLevel + 1; level <= state.toLevel; level++) {
    const cost = scaleResources(costAtLevel(level), state.planets), factor = resourceFactor(level);
    rows.push("<tr><td><strong>" + level + "</strong><small class='sub'>" + (level-1) + " → " + level + "</small></td><td><strong>" + fmtCompact(msu(cost,state.ratio)) + " " + t("MSU") + "</strong><small class='sub'>" + exact(cost) + "</small></td><td>" + fmtCompact(msu(upgradeResources(state.fromLevel,level,state.planets),state.ratio)) + "</td><td>" + fmtCompact(msu(cumulativeResources(level,state.planets),state.ratio)) + "</td><td>" + fmt(level * state.planets) + "</td><td><strong>+" + pp((factor-1)*100) + "</strong><small class='sub'>+" + pp(0.2*level) + (language === "ru" ? " / подздание" : " / building") + "</small></td><td>+" + fmtPct(factor / resourceFactor(level-1)-1) + "</td><td>+" + fmtPct(factor/start-1) + "</td><td>" + fmtCompact(msuPerPercentAtLevel(level,state.planets,state.ratio)) + "</td></tr>");
  }
  els.results.innerHTML = rows.join("");
  renderCharts(state);
  if (lithium && resourceRenderScope) {
    const headings = $("gainCharts").querySelectorAll("h2");
    headings[0].textContent = language === "ru" ? "Прирост лития к предыдущему уровню" : "Lithium gain vs previous level";
    headings[1].textContent = language === "ru" ? "Прирост лития к начальному уровню" : "Lithium gain vs starting level";
    headings[2].textContent = language === "ru" ? "Затраты МСУ за +1% лития в награде" : "MSU cost per +1% lithium reward";
    $("outputMultiplier").textContent += language === "ru" ? " · литий из аномалий, не производство IAS" : " · anomaly lithium, not IAS production";
  }
  return true;
}

// Each panel has unique DOM IDs; shared settings remain outside the panel.
let technologyTemplate = null;
let technologyPanels = [];
const scopedResourceFields = ["fromLevel", "toLevel", "validation", "upgradeCost", "upgradeCostExact", "targetLithium", "currentLithium", "outputGain", "outputMultiplier", "targetIas", "currentIas", "tableTitle", "results"];
function initializeTechnologyPlanner(params) {
  const list = document.getElementById("technologyList");
  if (!list?.querySelector) return; // The calculation-only test harness has no DOM.
  const first = list.querySelector(".technology-block");
  first.querySelectorAll("[id]").forEach(el => { el.dataset.field = el.id; });
  technologyTemplate = first.cloneNode(true);
  let plans = [];
  const encoded = params.get("techs");
  if (encoded) plans = encoded.split(",").slice(0, 4).map(entry => {
    const [type, from, to] = entry.split(":");
    return { type, from, to };
  }).filter(plan => resourceBuildings[plan.type]);
  if (!params.has("techs") && ["resource", "from", "to"].some(key => params.has(key))) plans = [{
    type: resourceBuildings[params.get("resource")] ? params.get("resource") : "metal",
    from: $("fromLevel").value,
    to: $("toLevel").value
  }];
  buildTechnologyPanels(plans);
  list.hidden = false;
  list.addEventListener("input", render);
  list.addEventListener("change", render);
  list.addEventListener("click", event => {
    const button = event.target.closest(".remove-technology");
    if (!button) return;
    const index = technologyPanels.indexOf(button.closest(".technology-block"));
    const plans = readTechnologyPlans();
    plans.splice(index, 1);
    buildTechnologyPanels(plans);
    setLanguage(language, false);
  });
  document.getElementById("addTechnology").addEventListener("click", () => {
    if (technologyPanels.length >= 4) return;
    const plans = readTechnologyPlans().map(plan => ({ ...plan, open: false, tableOpen: false }));
    const type = ["metal", "crystal", "deut", "lithium"].find(key => !plans.some(p => p.type === key));
    plans.push({ type, from: "0", to: "10" });
    buildTechnologyPanels(plans);
    setLanguage(language, false);
    technologyPanels.at(-1).querySelector('[data-field="resourceSelect"]').focus();
  });
}
function readTechnologyPlans() {
  return technologyPanels.map(panel => ({
    type: panel.querySelector('[data-field="resourceSelect"]').value,
    from: panel.querySelector('[data-field="fromLevel"]').value,
    to: panel.querySelector('[data-field="toLevel"]').value,
    open: panel.querySelector('[data-field="chartsPanel"]').open,
    tableOpen: panel.querySelector('[data-field="tablePanel"]').open
  }));
}
function buildTechnologyPanels(plans) {
  const list = document.getElementById("technologyList");
  list.replaceChildren();
  technologyPanels = plans.map((plan, index) => {
    const panel = technologyTemplate.cloneNode(true);
    panel.dataset.chartPrefix = index ? `tech${index}-` : "";
    panel.querySelectorAll("[data-field][id]").forEach(el => { el.id = index ? `tech${index}-${el.dataset.field}` : el.dataset.field; });
    panel.querySelector('[data-field="resourceSelect"]').value = plan.type;
    panel.querySelector('[data-field="fromLevel"]').value = plan.from;
    panel.querySelector('[data-field="toLevel"]').value = plan.to;
    panel.querySelector('[data-field="chartsPanel"]').open = Boolean(plan.open);
    panel.querySelector('[data-field="tablePanel"]').open = Boolean(plan.tableOpen);
    panel.querySelector(".remove-technology").disabled = false;
    list.append(panel);
    return panel;
  });
  for (const key of scopedResourceFields) els[key] = document.getElementById(key);
}
function renderResources() {
  if (!technologyTemplate) return renderSingleResource();
  const plans = readTechnologyPlans();
  const globalState = { planets: inputNumber(els.planets), fromLevel: 0, toLevel: 1, ratio: {
    metal: inputNumber(els.ratioMetal), crystal: inputNumber(els.ratioCrystal), deut: inputNumber(els.ratioDeut)
  } };
  const globalError = validate(globalState);
  $("globalValidation").hidden = !globalError;
  $("globalValidation").textContent = globalError;
  $("ratioValue").textContent = [els.ratioMetal, els.ratioCrystal, els.ratioDeut].map(input => input.value || "—").join(":");
  for (const id of ["technologyHelp", "technologyFooter", "combinedSummary"]) $(id).hidden = !plans.length;
  const saved = Object.fromEntries(scopedResourceFields.map(key => [key, els[key]]));
  let valid = !globalError;
  try {
    for (const panel of technologyPanels) {
      resourceRenderScope = panel;
      for (const key of scopedResourceFields) els[key] = $(key);
      valid = Boolean(renderSingleResource()) && valid;
      panel.querySelector('[data-field="resourceSelect"]').querySelectorAll("option").forEach(option => {
        option.disabled = plans.some(plan => plan.type === option.value && plan.type !== $("resourceSelect").value);
      });
    }
  } finally {
    resourceRenderScope = null;
    Object.assign(els, saved);
  }
  els.copyLink.disabled = !valid;
  document.getElementById("addTechnology").disabled = technologyPanels.length >= 4;
  renderCombinedSummary(plans, globalState, valid);
  if (!valid) return;
  updateUrl(plans.length ? readState() : globalState);
  const url = new URL(window.location.href);
  if (plans.length) url.searchParams.set("resource", plans[0].type);
  else for (const key of ["resource", "from", "to"]) url.searchParams.delete(key);
  url.searchParams.delete("stack");
  if (plans.length > 1) url.searchParams.set("techs", plans.map(p => `${p.type}:${p.from}:${p.to}`).join(","));
  else url.searchParams.delete("techs");
  window.history.replaceState({}, "", url);
}

function combinedTechnologyTotals(plans, planets) {
  const resources = { metal: 0n, crystal: 0n, deut: 0n };
  const gains = {};
  for (const plan of plans) {
    for (let level = Number(plan.from) + 1; level <= Number(plan.to); level++) {
      const cost = resourceCostAtLevel(level, plan.type);
      for (const key of Object.keys(resources)) resources[key] += BigInt(cost[key]) * BigInt(planets);
    }
    gains[plan.type] = (1 + .002 * Number(plan.to) * planets) / (1 + .002 * Number(plan.from) * planets) - 1;
  }
  return { resources, gains };
}
function renderCombinedSummary(plans, state, valid) {
  $("combinedValidation").hidden = valid;
  $("combinedValidation").textContent = language === "ru" ? "Исправьте параметры, чтобы увидеть общий итог." : "Correct the inputs to see the combined totals.";
  $("combinedResourcesCard").hidden = !plans.some(plan => plan.type !== "lithium");
  $("combinedLithiumCard").hidden = !plans.some(plan => plan.type === "lithium");
  if (!valid || !plans.length) {
    $("combinedCost").textContent = "—";
    $("combinedCostExact").textContent = "—";
    $("combinedResourceGains").textContent = "—";
    $("combinedLithiumGain").textContent = "—";
    return;
  }
  const { resources, gains } = combinedTechnologyTotals(plans, state.planets);
  const cost = msu(resources, state.ratio);
  $("combinedCost").textContent = fmtCompact(cost) + " " + t("MSU");
  $("combinedCostExact").textContent = fmt(cost) + " " + t("MSU") + " · " + t("Metal") + " " + fmt(resources.metal) + " · " + t("Crystal") + " " + fmt(resources.crystal) + " · " + t("Deuterium") + " " + fmt(resources.deut);
  const names = { metal: t("Metal"), crystal: t("Crystal"), deut: t("Deuterium") };
  $("combinedResourceGains").innerHTML = ["metal", "crystal", "deut"].filter(type => type in gains).map(type => '<p class="combined-gain"><span>' + names[type] + '</span><strong>+' + fmtPct(gains[type]) + '</strong></p>').join("");
  $("combinedLithiumGain").textContent = "lithium" in gains ? "+" + fmtPct(gains.lithium) : "—";
}
