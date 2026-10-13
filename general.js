// LFMaster_Global.xlsx (official forum publication), inspected 2026-10-13.
const generalLabs = {
  human: {base:[20000,25000,10000],en:"Research Centre",ru:"Исследовательский центр"},
  rocktal: {base:[40000,10000,15000],en:"Rune Technologium",ru:"Рунный технологиум"},
  mecha: {base:[30000,20000,10000],en:"Robotics Research Centre",ru:"Исследовательский центр робототехники"},
  kaelesh: {base:[20000,15000,15000],en:"Vortex Chamber",ru:"Вихревая камера"}
};
const generalText = {
  "OGame Orion IAS Calculator":{en:"OGame Orion General T18 Calculator",ru:"Калькулятор T18 Генерала — OGame Орион"},
  "IAS level":{en:"T18 level",ru:"Уровень T18"},
  "Lithium output gain charts":{en:"General T18 reward gain charts",ru:"Графики прироста наград от T18 Генерала"},
  "MSU per +1% output":{en:"T18 MSU per +1% reward",ru:"МСУ T18 за +1% награды"},
  "Upgrade MSU divided by its percentage gain versus the previous level. All selected planets; lower is cheaper.":{en:"T18 upgrade cost divided by reward gain versus the previous level. Building construction is excluded.",ru:"Стоимость улучшения T18, делённая на прирост награды к предыдущему уровню. Строительство здания не включено."},
  "These charts show lithium output, not confirmed loot gains or payback. Y axes use separate linear scales starting at zero.":{en:"Charts use the selected PvE/PvP mode. They compare the General reward multiplier, not payback or IAS production.",ru:"Графики используют выбранный режим PvE/PvP. Они сравнивают множитель награды Генерала, а не окупаемость или производство IAS."},
  "The starting level is 0%; each point compares output with that same starting level.":{en:"Each point compares the reward multiplier with the selected starting T18 level.",ru:"Каждая точка сравнивает множитель награды с выбранным начальным уровнем T18."},
  "Starting IAS level must be an integer from 0 to 79.":{en:"Starting T18 level must be an integer from 0 to 79.",ru:"Начальный уровень T18 должен быть целым числом от 0 до 79."},
  "Target IAS level must be an integer from 1 to 80.":{en:"Target T18 level must be an integer from 1 to 80.",ru:"Целевой уровень T18 должен быть целым числом от 1 до 80."},
  "Target IAS level must be higher than the starting level.":{en:"Target T18 level must be higher than the starting level.",ru:"Целевой уровень T18 должен быть выше начального."}
};
function generalDiscount(level) { return Math.min(level * .0025, .25); }
function generalCostAtLevel(level, labLevel) {
  if (!level) return {metal:0n,crystal:0n,deut:0n};
  const discountUnits = BigInt(400 - Math.min(labLevel,100));
  const numerator = BigInt(level) * 17n ** BigInt(level-1) * discountUnits;
  const denominator = 10n ** BigInt(level-1) * 400n;
  const [metal,crystal,deut] = [300000n,180000n,120000n].map(base=>base*numerator/denominator);
  return {metal,crystal,deut};
}
function generalLabCostAtLevel(level, race) {
  if (!level) return {metal:0n,crystal:0n,deut:0n};
  const numerator = BigInt(level) * 13n ** BigInt(level-1), denominator = 10n ** BigInt(level-1);
  const [metal,crystal,deut] = generalLabs[race].base.map(base=>BigInt(base)*numerator/denominator);
  return {metal,crystal,deut};
}
function generalLabTotal(level, race, planets) {
  let total={metal:0n,crystal:0n,deut:0n};
  for(let l=1;l<=level;l++) total=addResources(total,scaleResources(generalLabCostAtLevel(l,race),planets));
  return total;
}
function generalSettings() {
  return {...readState(),race:$("raceSelect").value,labLevel:inputNumber($("labLevel")),
    includeBuilding:$("includeBuilding").checked,lifeformLevel:inputNumber($("lifeformLevel")),
    techBoost:inputNumber($("techBoost")),mission:$("missionSelect").value};
}
function generalEnhancement(level,state) {
  return .002 * level * state.planets * (1 + .001 * state.lifeformLevel + state.techBoost / 100);
}
function generalRewardFactor(level,state,mission=state.mission) {
  return 1 + (mission === "pvp" ? 1 : .5) * (1 + generalEnhancement(level,state));
}
function generalError(state) {
  return validate(state) || (!generalLabs[state.race] ? (language==="ru"?"Выберите расу.":"Choose a lifeform.") : "") ||
    (!Number.isInteger(state.labLevel)||state.labLevel<1||state.labLevel>100 ? (language==="ru"?"Уровень здания: целое число от 1 до 100.":"Building level must be an integer from 1 to 100.") : "") ||
    (!Number.isInteger(state.lifeformLevel)||state.lifeformLevel<0||state.lifeformLevel>100 ? (language==="ru"?"Уровень формы жизни: целое число от 0 до 100.":"Lifeform level must be an integer from 0 to 100.") : "") ||
    (!Number.isFinite(state.techBoost)||state.techBoost<0||state.techBoost>1000 ? (language==="ru"?"Усиление технологиями зданий: от 0 до 1000%.":"Building technology boost must be between 0 and 1000%.") : "");
}
function initializeGeneral() {
  const pairs={
    s1:["General T18 Calculator","Калькулятор T18 Генерала"],
    s2:["Compare Mechan General Enhancement upgrades across all your planets, research discounts and Orion PvE/PvP reward gains.","Сравните улучшения T18 «Улучшение меха-генерала» на всех планетах, скидку на исследования и прирост наград Orion в PvE/PvP."],
    raceChoice:["Active lifeform on all planets","Активная раса на всех планетах"],human:["Humans","Люди"],rocktal:["Rock’tal","Рок’тал"],mecha:["Mecha","Мехи"],kaelesh:["Kaelesh","Каэлеш"],
    labLevelLabel:["Research building level","Уровень исследовательского здания"],
    includeBuilding:["Include building construction in total MSU","Учитывать строительство здания в общих МСУ"],
    discountLabel:["T18 research cost discount","Скидка на стоимость T18"],
    labCostHelp:["Construction from 0 to the selected level on every planet. No discounts on the building itself.","Строительство с 0 до выбранного уровня на всех планетах. Без скидок на само здание."],
    enhancements:["Lifeform technology modifiers","Модификаторы технологий ФЖ"],
    lifeformLevel:["Active lifeform experience level","Уровень опыта активной формы жизни"],
    techBoost:["Technology boost from buildings, %","Усиление технологий зданиями, %"],
    boostHelp:["These modifiers strengthen T18 effects; they do not increase the research cost discount. Same values on all planets.","Эти модификаторы усиливают эффект T18; скидку на исследования они не увеличивают. Значения одинаковые на всех планетах."],
    fromT18:["Starting T18 level","Начальный уровень T18"],toT18:["Target T18 level","Целевой уровень T18"],
    missionChoice:["Chart and table gain mode","Режим прироста для графиков и таблицы"],
    generalTotalCost:["Total investment","Общие затраты"],generalEnhancement:["General class enhancement","Усиление бонуса Генерала"],
    pveGain:["PvE reward gain","Прирост награды PvE"],pvpGain:["PvP reward gain","Прирост награды PvP"],
    tableHint:["Each row upgrades T18 on every planet. Costs include the selected research discount. Table and efficiency charts show T18 only; optional building construction is added once to the total investment above.","Каждая строка — улучшение T18 на всех планетах с выбранной скидкой. Таблица и график эффективности показывают только T18; строительство здания добавляется один раз к общим затратам выше."],
    showTable:["Show upgrade table","Показать таблицу улучшений"],hideTable:["Hide upgrade table","Скрыть таблицу улучшений"],
    generalLevel:["T18 level","Уровень T18"],generalStepCost:["Upgrade cost · all planets","Цена уровня · все планеты"],
    generalFromCost:["T18 cost from start","Затраты T18 от старта"],generalCumulative:["T18 invested from level 0","Всего вложено в T18 с 0"],
    generalBonus:["Class enhancement","Усиление класса"],generalPve:["PvE class bonus","Бонус класса PvE"],generalPvp:["PvP class bonus","Бонус класса PvP"],
    generalPrev:["Gain vs previous","Прирост к предыдущему"],generalStart:["Gain vs start","Прирост к старту"],generalEfficiency:["T18 MSU / +1% reward","МСУ T18 / +1% награды"],
    generalFormulas:["How it is calculated","Как считается"],
    generalCostFormula:["T18 cost per planet after discount","Стоимость T18 на планете после скидки"],
    generalLabFormula:["Research building cost per planet","Стоимость исследовательского здания на планете"],
    generalDiscountFormula:["Research discount","Скидка на исследования"],generalBoostFormula:["General enhancement (E)","Усиление Генерала (E)"],
    generalRewardFormula:["Orion reward multiplier","Множитель награды Orion"],
    generalFormulaHelp:["P = planets; L = T18 level; H = research building level; R = active lifeform experience level; B = technology boost from buildings as a decimal. Each resource is floored after applying the discount. Bonuses assume the General class is active. PvP’s own mission reward multiplier is part of the mission’s base reward, separate from these class multipliers. Other reward modifiers and unlock costs are excluded. Resources use exact integer arithmetic; MSU is approximate at very large totals. Levels are calculator ranges, not game caps.","P — планеты; L — уровень T18; H — уровень исследовательского здания; R — уровень опыта активной ФЖ; B — усиление технологий зданиями в долях единицы. Каждый ресурс округляется вниз после скидки. Расчёт предполагает активный класс Генерал. Собственное удвоение награды PvP входит в базовую награду миссии отдельно от этих множителей класса. Другие бонусы наград и затраты на открытие T18 не учтены. Ресурсы рассчитываются точно; МСУ при очень больших суммах приблизительны. Диапазоны уровней — ограничения калькулятора, не игры."],
    generalSources:["Sources: official Lifeform Master and Orion FAQ","Источники: официальный Lifeform Master и FAQ Orion"],
    chartsCaption:["Selected mode: reward gain and T18 efficiency","Выбранный режим: прирост награды и эффективность T18"]
  };
  for(const [key,[en,ru]] of Object.entries(pairs)) staticTranslations[key]={en,ru};
  const params=new URLSearchParams(window.location.search);
  if(generalLabs[params.get("race")]) $("raceSelect").value=params.get("race");
  for(const [key,id] of [["h","labLevel"],["lf","lifeformLevel"],["boost","techBoost"]]) if(params.has(key)) $(id).value=params.get(key);
  $("includeBuilding").checked=params.get("building")==="1";
  $("missionSelect").value=params.get("mission")==="pve"?"pve":"pvp";
  $("raceSelect").addEventListener("change",render);
  $("missionSelect").addEventListener("change",render);
}
function renderGeneral() {
  const state=generalSettings(),error=generalError(state);
  els.validation.hidden=!error;els.validation.textContent=error;els.copyLink.disabled=Boolean(error);
  $("ratioValue").textContent=[els.ratioMetal,els.ratioCrystal,els.ratioDeut].map(input=>input.value||"—").join(":");
  $("buildingCostInfo").hidden=!state.includeBuilding;
  const summaryIds=["upgradeCost","upgradeCostExact","t18Breakdown","enhancementValue","enhancementFrom","pveGainValue","pveMultiplier","pvpGainValue","pvpMultiplier","labDiscount","labTime","buildingCostExact","resourceTotals"];
  if(error){for(const id of summaryIds) $(id).textContent="—";els.results.innerHTML="";$("gainCharts").innerHTML="";return;}
  $("labName").textContent=generalLabs[state.race][language];
  $("labDiscount").textContent="−"+fmtPct(generalDiscount(state.labLevel));
  $("labTime").textContent=(language==="ru"?"Время исследований: −":"Research time: −")+fmtPct(Math.min(state.labLevel*.02,.99));
  const building=generalLabTotal(state.labLevel,state.race,state.planets);
  const t18=upgradeResources(state.fromLevel,state.toLevel,state.planets);
  const total=state.includeBuilding?addResources(t18,building):t18;
  const exact=r=>t("Metal")+" "+fmt(r.metal)+" · "+t("Crystal")+" "+fmt(r.crystal)+" · "+t("Deuterium")+" "+fmt(r.deut);
  $("buildingCostExact").textContent=fmt(msu(building,state.ratio))+" "+t("MSU")+" · "+exact(building);
  $("upgradeCost").textContent=fmtCompact(msu(total,state.ratio))+" "+t("MSU");
  $("upgradeCostExact").textContent=fmt(msu(total,state.ratio))+" "+t("MSU");
  $("t18Breakdown").textContent="T18: "+fmt(msu(t18,state.ratio))+" "+t("MSU")+(state.includeBuilding?(language==="ru"?" · Здание: ":" · Building: ")+fmt(msu(building,state.ratio))+" "+t("MSU"):"");
  $("resourceTotals").textContent=exact(total);
  $("enhancementValue").textContent="+"+fmtPct(generalEnhancement(state.toLevel,state));
  $("enhancementFrom").textContent=fmtPct(generalEnhancement(state.fromLevel,state))+" → "+fmtPct(generalEnhancement(state.toLevel,state));
  for(const mode of ["pve","pvp"]){
    const before=generalRewardFactor(state.fromLevel,state,mode),after=generalRewardFactor(state.toLevel,state,mode);
    $(mode+"GainValue").textContent="+"+fmtPct(after/before-1);
    $(mode+"Multiplier").textContent="×"+fmt(before)+" → ×"+fmt(after)+" · "+(language==="ru"?"бонус ":"bonus ")+fmtPct(before-1)+" → "+fmtPct(after-1);
  }
  els.tableTitle.textContent="T18 "+state.fromLevel+" → "+state.toLevel+" · "+state.mission.toUpperCase();
  let extra={metal:0n,crystal:0n,deut:0n},rows="";
  const baseline=generalRewardFactor(state.fromLevel,state);
  for(let level=state.fromLevel+1;level<=state.toLevel;level++){
    const cost=scaleResources(costAtLevel(level),state.planets);extra=addResources(extra,cost);
    const factor=generalRewardFactor(level,state),previous=generalRewardFactor(level-1,state);
    rows+='<tr><td><strong>'+level+'</strong><small class="sub">'+(level-1)+' → '+level+'</small></td><td><strong>'+fmtCompact(msu(cost,state.ratio))+' '+t("MSU")+'</strong><small class="sub">'+exact(cost)+'</small></td><td title="'+fmt(msu(extra,state.ratio))+'">'+fmtCompact(msu(extra,state.ratio))+'</td><td>'+fmtCompact(msu(cumulativeResources(level,state.planets),state.ratio))+'</td><td>+'+fmtPct(generalEnhancement(level,state))+'</td><td>+'+fmtPct(generalRewardFactor(level,state,"pve")-1)+'</td><td>+'+fmtPct(generalRewardFactor(level,state,"pvp")-1)+'</td><td>+'+fmtPct(factor/previous-1)+'</td><td>+'+fmtPct(factor/baseline-1)+'</td><td>'+fmtCompact(msuPerPercentAtLevel(level,state.planets,state.ratio))+'</td></tr>';
  }
  els.results.innerHTML=rows;renderCharts(state);
  updateUrl(state);
  const url=new URL(window.location.href);
  for(const [key,value] of Object.entries({race:state.race,h:state.labLevel,building:state.includeBuilding?1:0,lf:state.lifeformLevel,boost:state.techBoost,mission:state.mission})) url.searchParams.set(key,value);
  window.history.replaceState({},"",url);
}
