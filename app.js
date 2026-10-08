const $ = (id) => document.getElementById(id);
const resourceMode = document.body?.dataset?.calculator === "resources";

const els = {
  planets: $("planets"),
  fromLevel: $("fromLevel"),
  toLevel: $("toLevel"),
  ratioMetal: $("ratioMetal"),
  ratioCrystal: $("ratioCrystal"),
  ratioDeut: $("ratioDeut"),
  copyLink: $("copyLink"),
  validation: $("validation"),
  upgradeCost: $("upgradeCost"),
  upgradeCostExact: $("upgradeCostExact"),
  targetLithium: $("targetLithium"),
  currentLithium: $("currentLithium"),
  outputGain: $("outputGain"),
  outputMultiplier: $("outputMultiplier"),
  targetIas: $("targetIas"),
  currentIas: $("currentIas"),
  tableTitle: $("tableTitle"),
  results: $("results")
};

let integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
let compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
let percent = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let language = "en";
const russian = {
  "OGame · Project Orion": "OGame · Проект Орион",
  "Interstellar Anomaly Scanner Calculator": "Калькулятор сканера межзвёздных аномалий",
  "Enter the number of planets to calculate the cost of upgrading the Interstellar Anomaly Scanner on every planet, total IAS, lithium production and the relative gain from each level.": "Укажите количество планет и уровни IAS, чтобы рассчитать стоимость улучшений на всех планетах, суммарный IAS, выработку лития и прирост на каждом уровне.",
  "Number of planets": "Количество планет",
  "Starting IAS level": "Начальный уровень IAS",
  "Target IAS level": "Целевой уровень IAS",
  "MSU trade ratio": "Курс ресурсов для МСУ",
  "Metal": "Металл",
  "Crystal": "Кристалл",
  "Deut": "Дейтерий",
  "Deuterium": "Дейтерий",
  "Copy share link": "Скопировать ссылку",
  "Upgrade cost": "Стоимость улучшений",
  "Lithium/hour": "Литий в час",
  "Output gain": "Прирост выработки",
  "Total IAS": "Суммарный IAS",
  "Upgrade path": "Путь улучшений",
  "Each row means upgrading <strong>every selected planet</strong> to that IAS level.": "Каждая строка — улучшение IAS до указанного уровня <strong>на всех выбранных планетах</strong>.",
  "Scroll horizontally to compare every column. MSU / +1% uses each upgrade’s gain versus the previous level.": "Прокрутите таблицу по горизонтали, чтобы увидеть все столбцы. МСУ / +1% рассчитывается по приросту относительно предыдущего уровня.",
  "Level": "Уровень",
  "This level<br><span>all planets</span>": "Цена уровня<br><span>все планеты</span>",
  "Extra from start<br><span>MSU</span>": "Затраты от старта<br><span>МСУ</span>",
  "Total invested<br><span>to this level</span>": "Всего вложено<br><span>с 0 до этого уровня</span>",
  "Lithium/hour<br><span>all planets</span>": "Литий в час<br><span>все планеты</span>",
  "Gain vs prev.": "Прирост к пред.",
  "Gain vs start": "Прирост к старту",
  "MSU / +1%": "МСУ / +1%",
  "Formulas used": "Формулы",
  "How it is calculated": "Как считается",
  "Level cost per planet": "Цена уровня на одной планете",
  "M/C/D = 90/45/15 × 1.5^(L−1)": "М/К/Д = 90/45/15 × 1,5^(L−1)",
  "Each resource is rounded to the nearest whole unit.": "Каждый ресурс округляется до ближайшего целого числа.",
  "Lithium/hour per planet": "Литий в час на одной планете",
  "floor(168.96 × L × 1.1^(L−1))": "⌊168,96 × L × 1,1^(L−1)⌋",
  "PTS balance: 8 October 2026. Matches observed lithium output at levels 37–50.": "Баланс PTS от 8 октября 2026. Совпадает с выработкой лития на уровнях 37–50.",
  "Default MSU (3:2:1)": "МСУ по умолчанию (3:2:1)",
  "MSU = Metal + 1.5 × Crystal + 3 × Deuterium": "МСУ = Металл + 1,5 × Кристалл + 3 × Дейтерий",
  "You can change the trade ratio above.": "Курс ресурсов можно изменить выше.",
  "“Output gain” refers to lithium/hour only. The Orion loot formula is unconfirmed; these percentages are not confirmed loot gains. Percentage gains from IAS 0 are undefined and shown as N/A.": "«Прирост выработки» относится только к литию в час. Формула лута Ориона не подтверждена: эти проценты не означают подтверждённый прирост лута. Прирост в процентах от IAS 0 не определён и обозначается «н/д».",
  "Unofficial community calculator for OGame Project Orion.": "Неофициальный калькулятор сообщества OGame для проекта Орион.",
  "Mechanics may change while Orion is being tested.": "Механики могут измениться во время тестирования Ориона.",
  "Calculator settings": "Настройки калькулятора",
  "Summary": "Итог",
  "Scrollable upgrade results": "Прокручиваемая таблица улучшений",
  "Number of planets must be an integer from 1 to 50.": "Количество планет должно быть целым числом от 1 до 50.",
  "Starting IAS level must be an integer from 0 to 79.": "Начальный уровень IAS должен быть целым числом от 0 до 79.",
  "Target IAS level must be an integer from 1 to 80.": "Целевой уровень IAS должен быть целым числом от 1 до 80.",
  "Target IAS level must be higher than the starting level.": "Целевой уровень IAS должен быть выше начального.",
  "MSU ratio values must be finite numbers.": "Курс ресурсов для МСУ должен содержать конечные числа.",
  "MSU ratio values must be greater than zero.": "Значения курса ресурсов для МСУ должны быть больше нуля.",
  "Check your inputs": "Проверьте введённые значения",
  "N/A": "н/д",
  "MSU": "МСУ",
  "/h": "/ч",
  "M ": "М ",
  " · C ": " · К ",
  " · D ": " · Д ",
  " / planet": " / планета",
  "From {start}/h to {target}/h": "С {start}/ч до {target}/ч",
  " vs level ": " к уровню ",
  "Percentage gain is undefined from zero output": "Прирост в процентах от нулевой выработки не определён",
  "All planets: Metal {metal} · Crystal {crystal} · Deuterium {deut}": "Все планеты: Металл {metal} · Кристалл {crystal} · Дейтерий {deut}",
  "From {ias} IAS": "Было {ias} IAS",
  "Levels {start} → {target}": "Уровни {start} → {target}",
  "Link copied": "Ссылка скопирована",
  "Copy failed": "Не удалось скопировать",
  "Language": "Язык",
  "OGame Orion IAS Calculator": "Калькулятор IAS — OGame Орион",
  "Language and project links": "Язык и ссылки проекта"
};
const staticTranslations = {
  "s0": {
    "en": "OGame · Project Orion",
    "ru": "OGame · Проект Орион"
  },
  "s1": {
    "en": "Interstellar Anomaly Scanner Calculator",
    "ru": "Калькулятор сканера межзвёздных аномалий"
  },
  "s2": {
    "en": "Enter the number of planets to calculate the cost of upgrading the Interstellar Anomaly Scanner on every planet, total IAS, lithium production and the relative gain from each level.",
    "ru": "Укажите количество планет и уровни IAS, чтобы рассчитать стоимость улучшений на всех планетах, суммарный IAS, выработку лития и прирост на каждом уровне."
  },
  "s3": {
    "en": "Number of planets",
    "ru": "Количество планет"
  },
  "s4": {
    "en": "Starting IAS level",
    "ru": "Начальный уровень IAS"
  },
  "s5": {
    "en": "Target IAS level",
    "ru": "Целевой уровень IAS"
  },
  "s6": {
    "en": "MSU trade ratio",
    "ru": "Курс ресурсов для МСУ"
  },
  "s7": {
    "en": "Metal",
    "ru": "Металл"
  },
  "s8": {
    "en": "Crystal",
    "ru": "Кристалл"
  },
  "s9": {
    "en": "Deut",
    "ru": "Дейтерий"
  },
  "s10": {
    "en": "Copy share link",
    "ru": "Скопировать ссылку"
  },
  "s11": {
    "en": "Upgrade cost",
    "ru": "Стоимость улучшений"
  },
  "s12": {
    "en": "Lithium/hour",
    "ru": "Литий в час"
  },
  "s13": {
    "en": "Output gain",
    "ru": "Прирост выработки"
  },
  "s14": {
    "en": "Total IAS",
    "ru": "Суммарный IAS"
  },
  "s15": {
    "en": "Upgrade path",
    "ru": "Путь улучшений"
  },
  "s16": {
    "en": "Each row means upgrading <strong>every selected planet</strong> to that IAS level.",
    "ru": "Каждая строка — улучшение IAS до указанного уровня <strong>на всех выбранных планетах</strong>."
  },
  "s17": {
    "en": "Scroll horizontally to compare every column. MSU / +1% uses each upgrade’s gain versus the previous level.",
    "ru": "Прокрутите таблицу по горизонтали, чтобы увидеть все столбцы. МСУ / +1% рассчитывается по приросту относительно предыдущего уровня."
  },
  "s18": {
    "en": "This level<br><span>all planets</span>",
    "ru": "Цена уровня<br><span>все планеты</span>"
  },
  "s19": {
    "en": "Extra from start<br><span>MSU</span>",
    "ru": "Затраты от старта<br><span>МСУ</span>"
  },
  "s20": {
    "en": "Total invested<br><span>to this level</span>",
    "ru": "Всего вложено<br><span>с 0 до этого уровня</span>"
  },
  "s21": {
    "en": "Total IAS",
    "ru": "Суммарный IAS"
  },
  "s22": {
    "en": "Lithium/hour<br><span>all planets</span>",
    "ru": "Литий в час<br><span>все планеты</span>"
  },
  "s23": {
    "en": "Gain vs prev.",
    "ru": "Прирост к пред."
  },
  "s24": {
    "en": "Gain vs start",
    "ru": "Прирост к старту"
  },
  "s25": {
    "en": "MSU / +1%",
    "ru": "МСУ / +1%"
  },
  "s26": {
    "en": "Formulas used",
    "ru": "Формулы"
  },
  "s27": {
    "en": "How it is calculated",
    "ru": "Как считается"
  },
  "s28": {
    "en": "Level cost per planet",
    "ru": "Цена уровня на одной планете"
  },
  "s29": {
    "en": "M/C/D = 90/45/15 × 1.5^(L−1)",
    "ru": "М/К/Д = 90/45/15 × 1,5^(L−1)"
  },
  "s30": {
    "en": "Lithium/hour per planet",
    "ru": "Литий в час на одной планете"
  },
  "s31": {
    "en": "floor(168.96 × L × 1.1^(L−1))",
    "ru": "⌊168,96 × L × 1,1^(L−1)⌋"
  },
  "s32": {
    "en": "Default MSU (3:2:1)",
    "ru": "МСУ по умолчанию (3:2:1)"
  },
  "s33": {
    "en": "MSU = Metal + 1.5 × Crystal + 3 × Deuterium",
    "ru": "МСУ = Металл + 1,5 × Кристалл + 3 × Дейтерий"
  },
  "s34": {
    "en": "“Output gain” refers to lithium/hour only. The Orion loot formula is unconfirmed; these percentages are not confirmed loot gains. Percentage gains from IAS 0 are undefined and shown as N/A.",
    "ru": "«Прирост выработки» относится только к литию в час. Формула лута Ориона не подтверждена: эти проценты не означают подтверждённый прирост лута. Прирост в процентах от IAS 0 не определён и обозначается «н/д»."
  },
  "s35": {
    "en": "Unofficial community calculator for OGame Project Orion.",
    "ru": "Неофициальный калькулятор сообщества OGame для проекта Орион."
  },
  "s36": {
    "en": "Mechanics may change while Orion is being tested.",
    "ru": "Механики могут измениться во время тестирования Ориона."
  },
  "small0": {
    "en": "Each resource is rounded to the nearest whole unit.",
    "ru": "Каждый ресурс округляется до ближайшего целого числа."
  },
  "small1": {
    "en": "PTS balance: 8 October 2026. Matches observed lithium output at levels 37–50.",
    "ru": "Баланс PTS от 8 октября 2026. Совпадает с выработкой лития на уровнях 37–50."
  },
  "small2": {
    "en": "You can change the trade ratio above.",
    "ru": "Курс ресурсов можно изменить выше."
  }
};
staticTranslations.level = { en: "Level", ru: "Уровень" };
staticTranslations.themeLabel = { en: "Design", ru: "Дизайн" };
staticTranslations.themeMinimal = { en: "Minimal", ru: "Минимализм" };
staticTranslations.themeCosmic = { en: "Cosmic", ru: "Космос" };
russian.Design = "Дизайн";
let theme = "minimal";
function setTheme(next, persist = true) {
  theme = next === "cosmic" ? "cosmic" : "minimal";
  if (document.documentElement?.setAttribute) document.documentElement.setAttribute("data-theme", theme);
  $("themeSelect").value = theme;
  if (persist) { try { localStorage.setItem("ias-theme", theme); } catch {} }
  const url = new URL(window.location.href);
  url.searchParams.set("theme", theme);
  window.history.replaceState({}, "", url);
  syncNavigation(url);
}
function initialTheme() {
  const urlTheme = new URLSearchParams(window.location.search).get("theme");
  if (urlTheme === "minimal" || urlTheme === "cosmic") return urlTheme;
  try { return localStorage.getItem("ias-theme") === "cosmic" ? "cosmic" : "minimal"; } catch { return "minimal"; }
}
function t(text, values = {}) {
  let translated = resourceMode && resourceText[text] ? resourceText[text][language] : language === "ru" ? (russian[text] ?? text) : text;
  for (const [key, value] of Object.entries(values)) translated = translated.replaceAll("{" + key + "}", value);
  return translated;
}
Object.assign(staticTranslations, {
  ratioMenu: { en: "Trade ratio", ru: "Курс ресурсов" },
  ratioHelp: { en: "Metal : Crystal : Deuterium. Default: 3:2:1.", ru: "Металл : Кристалл : Дейтерий. По умолчанию: 3:2:1." },
  showCharts: { en: "Show charts", ru: "Показать графики" },
  hideCharts: { en: "Hide charts", ru: "Скрыть графики" },
  chartsCaption: { en: "Output gain and MSU per +1%", ru: "Прирост выработки и МСУ за +1%" }
});
function setLanguage(next, persist = true) {
  language = next === "ru" ? "ru" : "en";
  const locale = language === "ru" ? "ru-RU" : "en-US";
  integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 });
  percent = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (document.documentElement) document.documentElement.lang = language;
  document.title = t("OGame Orion IAS Calculator");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerHTML = staticTranslations[el.getAttribute("data-i18n")][language];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  ["en", "ru"].forEach(lang => {
    const button = $(lang === "en" ? "langEn" : "langRu");
    if (button?.setAttribute) button.setAttribute("aria-pressed", String(lang === language));
  });
  if (persist) { try { localStorage.setItem("ias-language", language); } catch {} }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.replaceState({}, "", url);
  render();
}
function initialLanguage() {
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  if (urlLanguage === "ru" || urlLanguage === "en") return urlLanguage;
  try { return localStorage.getItem("ias-language") === "ru" ? "ru" : "en"; } catch { return "en"; }
}

function costAtLevel(level) {
  if (resourceMode) return resourceCostAtLevel(level, $("resourceSelect").value);
  if (level === 0) return { metal: 0, crystal: 0, deut: 0 };
  // Rational arithmetic avoids floating point errors at whole-unit boundaries.
  const numerator = 3n ** BigInt(level - 1);
  const denominator = 2n ** BigInt(level - 1);
  const rounded = (base) => Number((BigInt(base) * numerator * 2n + denominator) / (2n * denominator));
  return { metal: rounded(90), crystal: rounded(45), deut: rounded(15) };
}

function lithiumPerPlanet(level) {
  if (level === 0) return 0;
  // 168.96 = 4224/25; floor only after evaluating the complete expression.
  return Number(4224n * BigInt(level) * 11n ** BigInt(level - 1) / (25n * 10n ** BigInt(level - 1)));
}

function outputAtLevel(level) {
  return resourceMode ? resourceFactor(level) : lithiumPerPlanet(level);
}

function msu(resources, ratio) {
  return Number(resources.metal) + Number(resources.crystal) * (ratio.metal / ratio.crystal) +
    Number(resources.deut) * (ratio.metal / ratio.deut);
}

function scaleResources(resources, multiplier) {
  // IAS per-planet costs are safe integers through level 80; fleet-wide totals may exceed that range.
  if (!resourceMode) return {
    metal: BigInt(resources.metal) * BigInt(multiplier),
    crystal: BigInt(resources.crystal) * BigInt(multiplier),
    deut: BigInt(resources.deut) * BigInt(multiplier)
  };
  return {
    metal: resources.metal * multiplier,
    crystal: resources.crystal * multiplier,
    deut: resources.deut * multiplier
  };
}

function addResources(a, b) {
  if (!resourceMode) return {
    metal: BigInt(a.metal) + BigInt(b.metal),
    crystal: BigInt(a.crystal) + BigInt(b.crystal),
    deut: BigInt(a.deut) + BigInt(b.deut)
  };
  return {
    metal: a.metal + b.metal,
    crystal: a.crystal + b.crystal,
    deut: a.deut + b.deut
  };
}

function cumulativeResources(toLevel, planets) {
  let total = { metal: 0, crystal: 0, deut: 0 };
  for (let level = 1; level <= toLevel; level += 1) {
    total = addResources(total, scaleResources(costAtLevel(level), planets));
  }
  return total;
}

function upgradeResources(fromLevel, toLevel, planets) {
  let total = { metal: 0, crystal: 0, deut: 0 };
  for (let level = fromLevel + 1; level <= toLevel; level += 1) {
    total = addResources(total, scaleResources(costAtLevel(level), planets));
  }
  return total;
}

function inputNumber(el) {
  return el.value.trim() === "" ? NaN : Number(el.value);
}

function readState() {
  return {
    planets: inputNumber(els.planets),
    fromLevel: inputNumber(els.fromLevel),
    toLevel: inputNumber(els.toLevel),
    ratio: {
      metal: inputNumber(els.ratioMetal),
      crystal: inputNumber(els.ratioCrystal),
      deut: inputNumber(els.ratioDeut)
    }
  };
}

function validate(state) {
  if (!Number.isInteger(state.planets) || state.planets < 1 || state.planets > 50) {
    return t("Number of planets must be an integer from 1 to 50.");
  }
  if (!Number.isInteger(state.fromLevel) || state.fromLevel < 0 || state.fromLevel > 79) {
    return t("Starting IAS level must be an integer from 0 to 79.");
  }
  if (!Number.isInteger(state.toLevel) || state.toLevel < 1 || state.toLevel > 80) {
    return t("Target IAS level must be an integer from 1 to 80.");
  }
  if (state.toLevel <= state.fromLevel) {
    return t("Target IAS level must be higher than the starting level.");
  }
  if (!Object.values(state.ratio).every(Number.isFinite)) return t("MSU ratio values must be finite numbers.");
  if (!state.ratio.metal || !state.ratio.crystal || !state.ratio.deut ||
      state.ratio.metal <= 0 || state.ratio.crystal <= 0 || state.ratio.deut <= 0) {
    return t("MSU ratio values must be greater than zero.");
  }
  return "";
}

function fmt(value) {
  return integer.format(value);
}

function fmtCompact(value) {
  return compact.format(value);
}

function fmtPct(value) {
  return percent.format(value * 100) + "%";
}

function resourceLine(resources) {
  return t("M ") + fmtCompact(resources.metal) +
    t(" · C ") + fmtCompact(resources.crystal) +
    t(" · D ") + fmtCompact(resources.deut);
}

function updateUrl(state) {
  const url = new URL(window.location.href);
  url.searchParams.set("p", state.planets);
  url.searchParams.set("from", state.fromLevel);
  url.searchParams.set("to", state.toLevel);
  url.searchParams.set("mr", state.ratio.metal);
  url.searchParams.set("cr", state.ratio.crystal);
  url.searchParams.set("dr", state.ratio.deut);
  syncNavigation(url);
  window.history.replaceState({}, "", url);
}

function syncNavigation(url = new URL(window.location.href)) {
  document.querySelectorAll(".calculator-tabs a").forEach(link => {
    const destination = new URL(link.getAttribute("href"), url);
    for (const key of ["p", "mr", "cr", "dr", "lang", "theme"]) if (url.searchParams.has(key)) destination.searchParams.set(key, url.searchParams.get(key));
    link.setAttribute("href", destination.href);
    if (destination.pathname.endsWith("resources.html") === resourceMode) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}


russian["Lithium output gain charts"] = "Графики прироста выработки лития";
Object.assign(russian, {"Gain vs previous level":"Прирост к предыдущему уровню","Gain vs starting level":"Прирост к начальному уровню","Each point is the gain of that upgrade over the previous level.":"Каждая точка — прирост от этого улучшения относительно предыдущего уровня.","The starting level is 0%; each point compares output with that same starting level.":"Начальный уровень — 0%; каждая точка сравнивает выработку с этим же начальным уровнем.","These charts show lithium output, not confirmed loot gains or payback. Y axes use separate linear scales starting at zero.":"Графики показывают выработку лития, а не подтверждённый прирост лута или окупаемость. Шкалы Y отдельные, линейные, начинаются с нуля.","Select a point to see its exact gain.":"Выберите точку, чтобы увидеть точный прирост.","Gain, %":"Прирост, %","IAS level":"Уровень IAS","Level {level}: +{gain}":"Уровень {level}: +{gain}","Step gains: +{first} → +{last}":"Прирост за уровень: +{first} → +{last}","Total gain from level {start}: +{gain}":"Общий прирост от уровня {start}: +{gain}"});
Object.assign(russian, {
  "MSU per +1% output": "МСУ за +1% выработки",
  "Upgrade MSU divided by its percentage gain versus the previous level. All selected planets; lower is cheaper.": "Цена улучшения в МСУ, делённая на прирост в процентах к предыдущему уровню. Для всех выбранных планет; ниже — дешевле.",
  "Select a point to see its exact cost.": "Выберите точку, чтобы увидеть точную стоимость.",
  "Level {level}: {cost} MSU / +1%": "Уровень {level}: {cost} МСУ / +1%",
  "Cost per +1%: {first} → {last} MSU": "Цена +1%: {first} → {last} МСУ",
  "MSU / +1%": "МСУ / +1%"
});
function msuPerPercentAtLevel(level, planets, ratio) {
  const before = outputAtLevel(level - 1);
  if (!before) return NaN;
  const gain = outputAtLevel(level) / before - 1;
  return msu(scaleResources(costAtLevel(level), planets), ratio) / (gain * 100);
}
function efficiencySeries(state) {
  const points = [];
  for (let level = state.fromLevel + 1; level <= state.toLevel; level++) {
    const value = msuPerPercentAtLevel(level, state.planets, state.ratio);
    if (Number.isFinite(value)) points.push({level, gain: value});
  }
  return points;
}
function pointLabel(level, value, unit) {
  return unit === "msu"
    ? t("Level {level}: {cost} MSU / +1%", {level, cost:fmt(value)})
    : t("Level {level}: +{gain}", {level, gain:fmtPct(value)});
}
function gainSeries(start, target) {
  const baseline = outputAtLevel(start);
  const previous = [], cumulative = [];
  for (let level = start; level <= target; level++) {
    const output = outputAtLevel(level);
    if (baseline) cumulative.push({ level, gain: output / baseline - 1 });
    if (level > start) {
      const before = outputAtLevel(level - 1);
      if (before) previous.push({ level, gain: output / before - 1 });
    }
  }
  return { previous, cumulative };
}
function gainChart(id, points, heading, description, insight, unit = "percent") {
  if (!points.length) return '<article class="panel chart-card'+(unit === "msu" ? ' efficiency-card' : '')+'"><h2>' + t(heading) +
    '</h2><p>' + t("Percentage gain is undefined from zero output") + '</p></article>';
  const w = 420, h = 290, left = 76, right = 22, top = 36, bottom = 54;
  const scale = unit === "msu" ? 1 : 100;
  const max = Math.max(...points.map(p => p.gain * scale), 1) * 1.08;
  const first = points[0].level, last = points.at(-1).level;
  const x = level => left + (last === first ? (w-left-right)/2 : (level-first)/(last-first)*(w-left-right));
  const y = gain => h-bottom - gain*scale/max*(h-top-bottom);
  let svg = '<svg viewBox="0 0 '+w+' '+h+'" role="group" aria-label="'+t(heading)+'">';
  svg += '<text class="chart-axis-label" x="'+left+'" y="19">'+t(unit === "msu" ? "MSU / +1%" : "Gain, %")+'</text>';
  for (let tick = 0; tick <= 4; tick++) {
    const value = max*tick/4, yy = y(value/scale);
    svg += '<line class="chart-grid-line" x1="'+left+'" x2="'+(w-right)+'" y1="'+yy+'" y2="'+yy+'"/>';
    svg += '<text class="chart-tick" x="'+(left-8)+'" y="'+(yy+5)+'" text-anchor="end">'+fmtCompact(value)+(unit === "msu" ? "" : "%")+'</text>';
  }
  const stride = Math.max(1, Math.ceil((last-first)/5));
  for (const point of points) {
    if ((point.level-first)%stride === 0 || point.level === last)
      svg += '<text class="chart-tick" x="'+x(point.level)+'" y="'+(h-bottom+24)+'" text-anchor="middle">'+point.level+'</text>';
  }
  svg += '<text class="chart-axis-label" x="'+((left+w-right)/2)+'" y="'+(h-6)+'" text-anchor="middle">'+t("IAS level")+'</text>';
  svg += '<polyline class="chart-line" points="'+points.map(p=>x(p.level)+','+y(p.gain)).join(' ')+'"/>';
  for (const p of points) {
    const label = pointLabel(p.level, p.gain, unit);
    svg += '<circle class="chart-point" cx="'+x(p.level)+'" cy="'+y(p.gain)+'" r="4" tabindex="0" role="button" aria-label="'+label+'" data-chart="'+id+'" data-level="'+p.level+'" data-gain="'+p.gain+'" data-unit="'+unit+'"><title>'+label+'</title></circle>';
  }
  svg += '</svg>';
  return '<article class="panel chart-card'+(unit === "msu" ? ' efficiency-card' : '')+'"><h2>'+t(heading)+'</h2><p class="chart-description">'+t(description)+'</p>'+
    svg+'<p class="chart-insight">'+insight+'</p><p id="'+id+'Readout" class="chart-readout" aria-live="polite">'+t(unit === "msu" ? "Select a point to see its exact cost." : "Select a point to see its exact gain.")+'</p></article>';
}
function renderCharts(state) {
  const series = gainSeries(state.fromLevel, state.toLevel);
  const prev = series.previous;
  const efficiency = efficiencySeries(state);
  const efficiencyInsight = efficiency.length ? t("Cost per +1%: {first} → {last} MSU", {first:fmtCompact(efficiency[0].gain),last:fmtCompact(efficiency.at(-1).gain)}) : "";
  const prevInsight = prev.length ? t("Step gains: +{first} → +{last}", {first:fmtPct(prev[0].gain),last:fmtPct(prev.at(-1).gain)}) : "";
  const totalInsight = series.cumulative.length ? t("Total gain from level {start}: +{gain}", {start:state.fromLevel,gain:fmtPct(series.cumulative.at(-1).gain)}) : "";
  $("gainCharts").innerHTML =
    '<div class="chart-grid">' +
    gainChart("stepChart",prev,"Gain vs previous level","Each point is the gain of that upgrade over the previous level.",prevInsight) +
    gainChart("totalChart",series.cumulative,"Gain vs starting level","The starting level is 0%; each point compares output with that same starting level.",totalInsight) +
    gainChart("efficiencyChart",efficiency,"MSU per +1% output","Upgrade MSU divided by its percentage gain versus the previous level. All selected planets; lower is cheaper.",efficiencyInsight,"msu") +
    '</div><p class="chart-note">'+t("These charts show lithium output, not confirmed loot gains or payback. Y axes use separate linear scales starting at zero.")+'</p>';
  document.querySelectorAll(".chart-point").forEach(point => {
    const show = () => $(point.dataset.chart+"Readout").textContent = pointLabel(point.dataset.level, Number(point.dataset.gain), point.dataset.unit);
    point.addEventListener("mouseenter", show);
    point.addEventListener("focus", show);
    point.addEventListener("click", show);
    point.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); }
    });
  });
}

function render() {
  if (resourceMode) return renderResources();
  const ratioValue = $("ratioValue");
  if (ratioValue) ratioValue.textContent = [els.ratioMetal, els.ratioCrystal, els.ratioDeut].map(input => input.value || "—").join(":");
  const state = readState();
  const error = validate(state);

  els.validation.hidden = !error;
  els.validation.textContent = error;

  if (error) {
    els.results.innerHTML = "";
    $("gainCharts").innerHTML = "";
    ["upgradeCost", "upgradeCostExact", "targetLithium", "currentLithium", "outputGain", "outputMultiplier", "targetIas", "currentIas", "resourceTotals"].forEach(id => $(id).textContent = "—");
    els.tableTitle.textContent = t("Check your inputs");
    els.copyLink.disabled = true;
    return;
  }

  els.copyLink.disabled = false;
  updateUrl(state);

  const startLithium = lithiumPerPlanet(state.fromLevel) * state.planets;
  const targetLithium = lithiumPerPlanet(state.toLevel) * state.planets;
  const gain = startLithium ? targetLithium / startLithium - 1 : NaN;
  const upgrade = upgradeResources(state.fromLevel, state.toLevel, state.planets);
  const upgradeMsu = msu(upgrade, state.ratio);

  els.upgradeCost.textContent = fmtCompact(upgradeMsu) + " " + t("MSU");
  els.upgradeCostExact.textContent = fmt(upgradeMsu) + " " + t("MSU") + " · " + resourceLine(upgrade);
  els.targetLithium.textContent = fmtCompact(targetLithium) + t("/h");
  els.currentLithium.textContent = t("From {start}/h to {target}/h", {start:fmt(startLithium), target:fmt(targetLithium)});
  els.outputGain.textContent = Number.isFinite(gain) ? "+" + fmtPct(gain) : t("N/A");
  els.outputMultiplier.textContent = startLithium ? "×" + (targetLithium / startLithium).toFixed(4).replace(".", language === "ru" ? "," : ".") + t(" vs level ") + state.fromLevel : t("Percentage gain is undefined from zero output");
  $("resourceTotals").textContent = t("All planets: Metal {metal} · Crystal {crystal} · Deuterium {deut}", {metal:fmt(upgrade.metal), crystal:fmt(upgrade.crystal), deut:fmt(upgrade.deut)});
  els.targetIas.textContent = fmt(state.toLevel * state.planets);
  els.currentIas.textContent = t("From {ias} IAS", {ias:fmt(state.fromLevel * state.planets)});
  els.tableTitle.textContent = t("Levels {start} → {target}", {start:state.fromLevel, target:state.toLevel});

  let extraFromStart = { metal: 0, crystal: 0, deut: 0 };
  let rows = "";

  for (let level = state.fromLevel + 1; level <= state.toLevel; level += 1) {
    const perPlanet = costAtLevel(level);
    const allPlanets = scaleResources(perPlanet, state.planets);
    const levelMsu = msu(allPlanets, state.ratio);
    extraFromStart = addResources(extraFromStart, allPlanets);
    const extraMsu = msu(extraFromStart, state.ratio);
    const invested = cumulativeResources(level, state.planets);
    const investedMsu = msu(invested, state.ratio);

    const previousLithium = lithiumPerPlanet(level - 1) * state.planets;
    const lithium = lithiumPerPlanet(level) * state.planets;
    const gainPrev = previousLithium ? lithium / previousLithium - 1 : NaN;
    const gainStart = startLithium ? lithium / startLithium - 1 : NaN;
    const msuPerOnePercent = msuPerPercentAtLevel(level, state.planets, state.ratio);

    rows += "<tr>" +
      "<td><strong>" + level + "</strong><span class=\"sub\">" + (level - 1) + " → " + level + "</span></td>" +
      "<td class=\"cost\"><strong>" + fmtCompact(levelMsu) + " " + t("MSU") + "</strong><span class=\"sub\" title=\"" +
        t("Metal") + " " + fmt(allPlanets.metal) + ", " + t("Crystal") + " " + fmt(allPlanets.crystal) + ", " + t("Deuterium") + " " + fmt(allPlanets.deut) +
        "\">" + t("M ") + fmt(allPlanets.metal) + t(" · C ") + fmt(allPlanets.crystal) + t(" · D ") + fmt(allPlanets.deut) + "</span></td>" +
      "<td title=\"" + fmt(extraMsu) + " " + t("MSU") + "\">" + fmtCompact(extraMsu) + "</td>" +
      "<td title=\"" + fmt(investedMsu) + " " + t("MSU") + "\">" + fmtCompact(investedMsu) + "</td>" +
      "<td>" + fmt(level * state.planets) + "</td>" +
      "<td><strong>" + fmt(lithium) + "</strong><span class=\"sub\">" + fmt(lithiumPerPlanet(level)) + t(" / planet") + "</span></td>" +
      "<td class=\"positive\">" + (Number.isFinite(gainPrev) ? "+" + fmtPct(gainPrev) : t("N/A")) + "</td>" +
      "<td class=\"positive\">" + (Number.isFinite(gainStart) ? "+" + fmtPct(gainStart) : t("N/A")) + "</td>" +
      "<td>" + (Number.isFinite(msuPerOnePercent) ? fmtCompact(msuPerOnePercent) : t("N/A")) + "</td>" +
    "</tr>";
  }

  els.results.innerHTML = rows;
  renderCharts(state);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const mapping = [
    ["p", els.planets],
    ["from", els.fromLevel],
    ["to", els.toLevel],
    ["mr", els.ratioMetal],
    ["cr", els.ratioCrystal],
    ["dr", els.ratioDeut]
  ];
  mapping.forEach(([key, el]) => {
    if (params.has(key)) el.value = params.get(key);
  });
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", render));

els.copyLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    els.copyLink.textContent = t("Link copied");
    setTimeout(() => { els.copyLink.textContent = t("Copy share link"); }, 1200);
  } catch {
    els.copyLink.textContent = t("Copy failed");
    setTimeout(() => { els.copyLink.textContent = t("Copy share link"); }, 1200);
  }
});

loadFromUrl();
Object.assign(staticTranslations, { navIas: {en: "IAS calculator", ru: "Калькулятор IAS"}, navResources: {en: "Resource bonuses", ru: "Ресурсные бонусы"} });
russian["Calculators"] = "Калькуляторы";
if (resourceMode) initializeResources();
$("themeSelect").addEventListener("change", event => setTheme(event.target.value));
setTheme(initialTheme(), false);
$("langEn").addEventListener("click", () => setLanguage("en"));
$("langRu").addEventListener("click", () => setLanguage("ru"));
setLanguage(initialLanguage(), false);
