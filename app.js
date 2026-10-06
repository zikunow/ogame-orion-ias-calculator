const $ = (id) => document.getElementById(id);

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

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function costAtLevel(level) {
  const f = Math.pow(1.4, level - 1);
  return {
    metal: Math.round(84 * f),
    crystal: Math.round(42 * f),
    deut: Math.round(14 * f)
  };
}

function lithiumPerPlanet(level) {
  return Math.floor(220 * level * Math.pow(1.1, level - 1));
}

function msu(resources, ratio) {
  return Math.ceil(
    resources.metal +
    resources.crystal * (ratio.metal / ratio.crystal) +
    resources.deut * (ratio.metal / ratio.deut)
  );
}

function scaleResources(resources, multiplier) {
  return {
    metal: resources.metal * multiplier,
    crystal: resources.crystal * multiplier,
    deut: resources.deut * multiplier
  };
}

function addResources(a, b) {
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

function readState() {
  return {
    planets: Number(els.planets.value),
    fromLevel: Number(els.fromLevel.value),
    toLevel: Number(els.toLevel.value),
    ratio: {
      metal: Number(els.ratioMetal.value),
      crystal: Number(els.ratioCrystal.value),
      deut: Number(els.ratioDeut.value)
    }
  };
}

function validate(state) {
  if (!Number.isInteger(state.planets) || state.planets < 1 || state.planets > 50) {
    return "Number of planets must be an integer from 1 to 50.";
  }
  if (!Number.isInteger(state.fromLevel) || state.fromLevel < 1 || state.fromLevel > 79) {
    return "Starting IAS level must be an integer from 1 to 79.";
  }
  if (!Number.isInteger(state.toLevel) || state.toLevel < 2 || state.toLevel > 80) {
    return "Target IAS level must be an integer from 2 to 80.";
  }
  if (state.toLevel <= state.fromLevel) {
    return "Target IAS level must be higher than the starting level.";
  }
  if (!state.ratio.metal || !state.ratio.crystal || !state.ratio.deut ||
      state.ratio.metal <= 0 || state.ratio.crystal <= 0 || state.ratio.deut <= 0) {
    return "MSU ratio values must be greater than zero.";
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
  return "M " + fmtCompact(resources.metal) +
    " · C " + fmtCompact(resources.crystal) +
    " · D " + fmtCompact(resources.deut);
}

function updateUrl(state) {
  const url = new URL(window.location.href);
  url.searchParams.set("p", state.planets);
  url.searchParams.set("from", state.fromLevel);
  url.searchParams.set("to", state.toLevel);
  url.searchParams.set("mr", state.ratio.metal);
  url.searchParams.set("cr", state.ratio.crystal);
  url.searchParams.set("dr", state.ratio.deut);
  window.history.replaceState({}, "", url);
}

function render() {
  const state = readState();
  const error = validate(state);

  els.validation.hidden = !error;
  els.validation.textContent = error;

  if (error) {
    els.results.innerHTML = "";
    return;
  }

  updateUrl(state);

  const startLithium = lithiumPerPlanet(state.fromLevel) * state.planets;
  const targetLithium = lithiumPerPlanet(state.toLevel) * state.planets;
  const gain = targetLithium / startLithium - 1;
  const upgrade = upgradeResources(state.fromLevel, state.toLevel, state.planets);
  const upgradeMsu = msu(upgrade, state.ratio);

  els.upgradeCost.textContent = fmtCompact(upgradeMsu) + " MSU";
  els.upgradeCostExact.textContent = fmt(upgradeMsu) + " MSU · " + resourceLine(upgrade);
  els.targetLithium.textContent = fmtCompact(targetLithium) + "/h";
  els.currentLithium.textContent = "From " + fmt(startLithium) + "/h to " + fmt(targetLithium) + "/h";
  els.outputGain.textContent = "+" + fmtPct(gain);
  els.outputMultiplier.textContent = "×" + (targetLithium / startLithium).toFixed(4) + " vs level " + state.fromLevel;
  els.targetIas.textContent = fmt(state.toLevel * state.planets);
  els.currentIas.textContent = "From " + fmt(state.fromLevel * state.planets) + " IAS";
  els.tableTitle.textContent = "Levels " + state.fromLevel + " → " + state.toLevel;

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
    const gainPrev = lithium / previousLithium - 1;
    const gainStart = lithium / startLithium - 1;
    const msuPerOnePercent = levelMsu / (gainPrev * 100);

    rows += "<tr>" +
      "<td><strong>" + level + "</strong><span class=\"sub\">" + (level - 1) + " → " + level + "</span></td>" +
      "<td class=\"cost\"><strong>" + fmtCompact(levelMsu) + " MSU</strong><span class=\"sub\" title=\"" +
        "Metal " + fmt(allPlanets.metal) + ", Crystal " + fmt(allPlanets.crystal) + ", Deuterium " + fmt(allPlanets.deut) +
        "\">" + resourceLine(allPlanets) + "</span></td>" +
      "<td>" + fmtCompact(extraMsu) + "</td>" +
      "<td>" + fmtCompact(investedMsu) + "</td>" +
      "<td>" + fmt(level * state.planets) + "</td>" +
      "<td><strong>" + fmt(lithium) + "</strong><span class=\"sub\">" + fmt(lithiumPerPlanet(level)) + " / planet</span></td>" +
      "<td class=\"positive\">+" + fmtPct(gainPrev) + "</td>" +
      "<td class=\"positive\">+" + fmtPct(gainStart) + "</td>" +
      "<td>" + fmtCompact(msuPerOnePercent) + "</td>" +
    "</tr>";
  }

  els.results.innerHTML = rows;
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
    const old = els.copyLink.textContent;
    els.copyLink.textContent = "Link copied";
    setTimeout(() => { els.copyLink.textContent = old; }, 1200);
  } catch {
    els.copyLink.textContent = "Copy failed";
    setTimeout(() => { els.copyLink.textContent = "Copy share link"; }, 1200);
  }
});

loadFromUrl();
render();
