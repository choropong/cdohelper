var currentRelic = null;
var currentLevel = 1;

document.addEventListener("DOMContentLoaded", function() {
    renderRelics();
    initModal();
    initSearch();
});

function renderRelics(filter) {
    filter = filter || "";
    var container = document.getElementById("relicContainer");
    container.innerHTML = "";
    var groups = {};
    for (var i = 0; i < RELIC_DATA.length; i++) {
        var r = RELIC_DATA[i];
        if (!groups[r.tier]) groups[r.tier] = [];
        if (filter && r.name.indexOf(filter) === -1) continue;
        groups[r.tier].push(r);
    }
    for (var t = 0; t < TIER_ORDER.length; t++) {
        var tier = TIER_ORDER[t];
        if (!groups[tier] || groups[tier].length === 0) continue;
        var section = document.createElement("div");
        section.className = "category-section";
        var title = document.createElement("h2");
        title.className = "category-title";
        title.textContent = tier;
        section.appendChild(title);
        var grid = document.createElement("div");
        grid.className = "relic-grid";
        for (var j = 0; j < groups[tier].length; j++) {
            var relic = groups[tier][j];
            var item = document.createElement("div");
            item.className = "relic-item";
            var imgDiv = document.createElement("div");
            imgDiv.className = "relic-img";
            imgDiv.textContent = relic.name.substring(0, 2);
            var nameDiv = document.createElement("div");
            nameDiv.className = "relic-name";
            nameDiv.textContent = relic.name;
            item.appendChild(imgDiv);
            item.appendChild(nameDiv);
            item.setAttribute("data-id", relic.id);
            item.onclick = function() {
                var id = this.getAttribute("data-id");
                for (var k = 0; k < RELIC_DATA.length; k++) {
                    if (RELIC_DATA[k].id === id) { openModal(RELIC_DATA[k]); break; }
                }
            };
            grid.appendChild(item);
        }
        section.appendChild(grid);
        container.appendChild(section);
    }
}

function initSearch() {
    document.getElementById("searchInput").addEventListener("input", function(e) {
        renderRelics(e.target.value);
    });
}

function initModal() {
    document.getElementById("modalClose").onclick = closeModal;
    document.getElementById("modalOverlay").onclick = function(e) {
        if (e.target === e.currentTarget) closeModal();
    };
}

function openModal(relic) {
    currentRelic = relic;
    currentLevel = 1;
    document.getElementById("modalName").textContent = relic.name;
    document.getElementById("modalTier").textContent = relic.tier;
    document.getElementById("modalImgPlaceholder").textContent = relic.name.substring(0, 2);
    var overlay = document.getElementById("modalOverlay");
    if (relic.customAbility === "blackhammer") {
        overlay.classList.add("blackhammer-modal");
        renderBlackhammerUI();
    } else {
        overlay.classList.remove("blackhammer-modal");
        renderLevelSelector(relic);
        updateInfo(1);
    }
    overlay.classList.add("active");
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("active");
    currentRelic = null;
}

function renderBlackhammerUI() {
    var body = document.getElementById("modalBody");
    var html = "<div class=\"blackhammer-info\">";
    html += "<div class=\"blackhammer-desc\"><h4>블랙해머 효과</h4><p>다른 유물들의 특수능력을 +1강 증가시킵니다.<br>(장착 무관하며 보유 시 발동)</p></div>";
    html += "<div class=\"blackhammer-9plus\"><strong>9강 추가 효과</strong><br><span style=\"font-size:0.85rem; opacity:0.9;\">데미갓 이상일 경우 유물 장착 슬롯 +1</span></div>";
    html += "<h4 style=\"font-size:0.85rem; opacity:0.6; margin-bottom:12px;\">강화 단계별 적용 유물</h4>";
    for (var tier = 1; tier <= 8; tier++) {
        var relics = BLACKHAMMER_TIERS[tier] || [];
        if (relics.length === 0) continue;
        html += "<div class=\"tier-section\"><div class=\"tier-header\"><span class=\"tier-badge\">" + tier + "강</span><span>부터 적용</span></div><div class=\"tier-relics\">";
        for (var i = 0; i < relics.length; i++) { html += "<span class=\"tier-relic\">" + relics[i] + "</span>"; }
        html += "</div></div>";
    }
    html += "</div>";
    body.innerHTML = html;
}

function renderLevelSelector(relic) {
    var body = document.getElementById("modalBody");
    var maxLevel = relic.blackhammerTier ? 10 : 9;
    var html = "<div class=\"level-selector\">";
    html += "<div class=\"level-display\"><span id=\"levelText\">1강</span></div>";
    html += "<input type=\"range\" class=\"level-slider\" id=\"levelSlider\" min=\"1\" max=\"" + maxLevel + "\" value=\"1\">";
    html += "<div class=\"level-labels\"><span>1강</span><span>" + (maxLevel === 10 ? "9+1" : "9강") + "</span></div>";
    html += "</div><div id=\"statsSection\"></div><div class=\"info-section\" id=\"abilitySection\"></div>";
    body.innerHTML = html;
    var slider = document.getElementById("levelSlider");
    slider.oninput = function() {
        var level = parseInt(this.value);
        var label = (level === 10) ? "9+1" : level + "강";
        document.getElementById("levelText").textContent = label;
        currentLevel = level;
        updateInfo(level);
    };
}

function updateInfo(level) { renderStats(level); renderAbility(level); }

function renderStats(level) {
    var section = document.getElementById("statsSection");
    if (!currentRelic || currentRelic.baseStat.length === 0) { section.innerHTML = ""; return; }
    var statLevel = level === 10 ? 9 : level;
    var html = "<div class=\"info-section\"><h4>기본 스탯</h4>";
    for (var i = 0; i < currentRelic.baseStat.length; i++) {
        var stat = currentRelic.baseStat[i];
        var name = stat[0], base = stat[1], unit = stat[2] || "";
        var value = currentRelic.noStatMultiplier ? base : base * statLevel;
        var sign = value >= 0 ? "+" : "";
        html += "<div class=\"stat-line\"><span class=\"label\">" + name + "</span><span class=\"value" + (value < 0 ? " negative" : "") + "\">" + sign + value + unit + "</span></div>";
    }
    html += "</div>";
    section.innerHTML = html;
}

function renderAbility(level) {
    var section = document.getElementById("abilitySection");
    if (!currentRelic) { section.innerHTML = ""; return; }
    var html = "<h4>유물 능력</h4>";
    if (level < currentRelic.abilityStart) {
        html += "<div class=\"ability-text inactive\">" + currentRelic.abilityStart + "강부터 능력 발동</div>";
    } else {
        var abilityText = calculateAbility(currentRelic, level);
        html += "<div class=\"ability-text\">" + abilityText + "</div>";
        if (level === 10 && currentRelic.blackhammerTier) {
            html += "<div class=\"blackhammer-note\">블랙해머 " + currentRelic.blackhammerTier + "강 이상 보유 시 적용</div>";
        }
    }
    section.innerHTML = html;
}

function calculateAbility(relic, level) {
    var multiplier = level >= relic.abilityStart ? level - relic.abilityStart + 1 : 0;
    var result;
    if (relic.customAbility) { result = calculateCustomAbility(relic, level, multiplier); }
    else if (relic.noAbilityMultiplier) { result = relic.ability.replace(/\{([\d.]+)\}/g, "$1"); }
    else {
        result = relic.ability.replace(/\{([\d.]+)\}/g, function(m, n) {
            return (Math.round(parseFloat(n) * multiplier * 100) / 100).toString();
        });
    }
    return result.replace(/\(고정\)/g, "");
}

function calculateCustomAbility(relic, level, multiplier) {
    var id = relic.customAbility;
    if (id === "solomonring") {
        var cd = Math.max(0.5, 5 - (multiplier - 1) * 0.5);
        var skulls = level >= 9 ? 3 : (level >= 7 ? 2 : 1);
        return "네크로맨서가 장착 시 매 " + cd + "초마다 전방으로 해골 " + skulls + "기 소환, 해골 소환 시 체력 100 회복";
    }
    if (id === "imperialjade") {
        var cd = Math.max(5, 30 - (multiplier - 1) * 5);
        return "전 아군에게 적용되는 공격력 15% 버프 토템을 성에 설치하고 " + cd + "초마다 5초간 버프 부여(다수 보유 시 1%씩 증가)";
    }
    if (id === "brancauldron") {
        var cd = Math.max(5, 95 - (multiplier - 1) * 15);
        return "체력이 30% 이하일 때 즉시 체력 전체 회복(" + cd + "초 쿨다운), 피에로가 장착 시 방어력 " + (20 * multiplier) + " 추가 상승";
    }
    if (id === "trident") {
        var targets = level >= 9 ? 3 : (level >= 7 ? 2 : 1);
        return "쉐프와 랜서, 로그, 파이터의 일반 공격 사거리 " + (10 * multiplier) + "% 증가 및 적군 " + targets + "기 다중 타격";
    }
    if (id === "ajaxshield") {
        if (level < 3) return "3강부터 능력 발동";
        return "적의 공격을 " + (level - 2) + "회 막는 방벽 생성(쿨타임 80초), 가디언, 팔라딘 2배 적용";
    }
    if (id === "tahlum") { return "머스킷티어와 거너, 메카닉이 장착 시 전방의 적을 2초마다 1회 자동 공격 (누적 " + (70 + (multiplier - 1) * 10) + "%)"; }
    if (id === "talaria") { return (3 + multiplier - 1) + "단 점프, 점프 횟수마다 3%씩 3초간 공격력 버프 획득, 메카닉 레이저 쿨타임 " + multiplier + "초 감소"; }
    if (id === "oracle") { return "쌓인 실버량 1000 마다 공격력 추가 +" + (3 + level - 1) + " (최대 공격력 " + (60 + (level - 1) * 5) + ", 장착 무관하며 보유 시 발동)"; }
    if (id === "silverhunter") { return "1초간 움직임 지속 시 은화 +" + (34 + (level - 1) * 2) + " (장착무관, 최대 " + (2000 + (level - 1) * 1000) + "), 5초마다 공격력의 20% 폭탄 생성, 공격력은 보유 은화 " + (900 - (level - 1) * 50) + "당 +1% (최대 +20%)"; }
    if (id === "blueprint") {
        var text = "다이아 보상 " + level + "% 증가";
        if (level >= 8) text += "\n디펜스 모드 미니맵 터치로 성 복귀 가능";
        if (level >= 9) text += "\n디펜스 모드 아이템 장착 슬롯 1개 추가";
        return text;
    }
    if (id === "goldenduck") { return "디펜스 모드(난이도 11 이상) 게임 클리어 시 골드 보상 +" + level + " (하루 최대 " + (40 + (level - 1) * 20) + "개, 장착 무관하며 보유 시 발동)"; }
    if (id === "heropentagon") { return "(레이드 및 주간보스 한정) 내 영웅의 공격력 +" + (2 + level - 1) + "% 증가, 피격 시 " + (0.6 + (level - 1) * 0.3).toFixed(1) + "% 확률로 1회 보호막 생성 (장착 무관, 보유 시 자동 발동)"; }
    if (id === "transcendbook") { var v = 10 + (level - 1) * 5; return "출석체크 시 초월석 " + v + "개 추가 지급, 레이드에서 획득 가능한 초월석 +" + v + " (장착 무관, 보유 시 자동 발동)"; }
    return relic.ability;
}