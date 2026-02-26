// 상태
let relicLevels = {};
let currentRelic = null;
let tempLevel = 0;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderRelics();
    initModal();
    initSearch();
});

function loadData() {
    const saved = localStorage.getItem('relicLevels');
    if (saved) relicLevels = JSON.parse(saved);
}

function saveData() {
    localStorage.setItem('relicLevels', JSON.stringify(relicLevels));
}

function getRelicLevel(id) {
    return relicLevels[id] || 0;
}

function setRelicLevel(id, level) {
    relicLevels[id] = Math.max(0, Math.min(9, level));
    saveData();
}

// 렌더링
function renderRelics(filter = '') {
    const container = document.getElementById('relicContainer');
    container.innerHTML = '';

    const groups = {};
    RELIC_DATA.forEach(r => {
        if (!groups[r.tier]) groups[r.tier] = [];
        if (filter && !r.name.includes(filter)) return;
        groups[r.tier].push(r);
    });

    TIER_ORDER.forEach(tier => {
        if (!groups[tier] || groups[tier].length === 0) return;

        const section = document.createElement('div');
        section.className = 'category-section';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = tier;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'relic-grid';

        groups[tier].forEach(relic => {
            const item = document.createElement('div');
            item.className = 'relic-item';
            const level = getRelicLevel(relic.id);
            if (level > 0) item.classList.add('owned');

            item.innerHTML = `
                <div class="relic-img">
                    <img src="images/${relic.name}.png" alt="${relic.name}" 
                         onerror="this.style.display='none'; this.parentElement.textContent='${relic.name.substring(0,2)}'">
                </div>
                <div class="relic-info">
                    <div class="relic-name">${relic.name}</div>
                    <div class="relic-level ${level > 0 ? '' : 'not-owned'}">${level > 0 ? level + '강' : '미보유'}</div>
                </div>
            `;
            item.onclick = () => openModal(relic);
            grid.appendChild(item);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

// 검색
function initSearch() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderRelics(e.target.value);
    });
}

// 모달
function initModal() {
    document.getElementById('modalClose').onclick = closeModal;
    document.getElementById('modalOverlay').onclick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };
    
    // 내 유물 레벨 조절 - 즉시 저장
    document.getElementById('myLevelMinus').onclick = () => {
        tempLevel = Math.max(0, tempLevel - 1);
        if (currentRelic) {
            setRelicLevel(currentRelic.id, tempLevel);
            renderRelics(document.getElementById('searchInput').value);
        }
        updateMyLevelDisplay();
    };
    document.getElementById('myLevelPlus').onclick = () => {
        tempLevel = Math.min(9, tempLevel + 1);
        if (currentRelic) {
            setRelicLevel(currentRelic.id, tempLevel);
            renderRelics(document.getElementById('searchInput').value);
        }
        updateMyLevelDisplay();
    };
    
    document.getElementById('levelSlider').oninput = (e) => {
        updatePreview(parseInt(e.target.value));
    };
}

function openModal(relic) {
    currentRelic = relic;
    tempLevel = getRelicLevel(relic.id);
    
    document.getElementById('modalName').textContent = relic.name;
    document.getElementById('modalTier').textContent = relic.tier;
    document.getElementById('modalImgPlaceholder').textContent = relic.name.substring(0, 2);
    
    const img = document.getElementById('modalImg');
    img.src = `images/${relic.name}.png`;
    img.style.display = 'none';
    img.onload = () => {
        img.style.display = 'block';
        document.getElementById('modalImgPlaceholder').style.display = 'none';
    };
    img.onerror = () => {
        img.style.display = 'none';
        document.getElementById('modalImgPlaceholder').style.display = 'block';
    };
    
    // 블랙해머 적용 유물인지 확인하여 슬라이더 최대값 설정
    const slider = document.getElementById('levelSlider');
    const sliderLabels = document.querySelector('.slider-labels');
    if (relic.blackhammerTier) {
        slider.max = 10;
        sliderLabels.innerHTML = '<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>9+1</span>';
    } else {
        slider.max = 9;
        sliderLabels.innerHTML = '<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>';
    }
    
    updateMyLevelDisplay();
    slider.value = tempLevel;
    updatePreview(tempLevel);
    
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    currentRelic = null;
}

function updateMyLevelDisplay() {
    document.getElementById('myLevelDisplay').textContent = tempLevel > 0 ? `${tempLevel}강` : '미보유';
}

function updatePreview(level) {
    const preview = document.getElementById('previewLevel');
    if (level === 10 && currentRelic && currentRelic.blackhammerTier) {
        preview.textContent = '9강 + 블랙해머 효과';
        preview.className = 'preview-level blackhammer';
    } else {
        preview.textContent = level > 0 ? `${level}강` : '0강 (미장착)';
        preview.className = 'preview-level';
    }
    
    renderStats(level);
    renderAbility(level);
}

function renderStats(level) {
    const section = document.getElementById('statsSection');
    if (!currentRelic || currentRelic.baseStat.length === 0) {
        section.innerHTML = '';
        return;
    }
    
    let html = '<h4>기본 스탯</h4>';
    const effectiveLevel = level === 10 ? 10 : level;
    
    currentRelic.baseStat.forEach(stat => {
        const [name, base, unit = ''] = stat;
        let value;
        if (currentRelic.noStatMultiplier) {
            value = base;
        } else {
            value = base * effectiveLevel;
        }
        const sign = value >= 0 ? '+' : '';
        const isNegative = value < 0;
        
        if (effectiveLevel > 0) {
            html += `<div class="stat-line">
                <span class="label">${name}</span>
                <span class="value ${isNegative ? 'negative' : ''}">${sign}${value}${unit}</span>
            </div>`;
        }
    });
    
    section.innerHTML = effectiveLevel > 0 ? html : '';
}

function renderAbility(level) {
    const section = document.getElementById('abilitySection');
    if (!currentRelic) {
        section.innerHTML = '';
        return;
    }
    
    const effectiveLevel = level === 10 ? 10 : level;
    let html = '<h4>유물 능력</h4>';
    
    if (effectiveLevel < currentRelic.abilityStart) {
        html += `<div class="ability-text inactive">${currentRelic.abilityStart}강부터 능력 발동</div>`;
    } else {
        const abilityText = calculateAbility(currentRelic, effectiveLevel);
        html += `<div class="ability-text">${abilityText}</div>`;
        
        if (level === 10 && currentRelic.blackhammerTier) {
            html += `<div class="blackhammer-note">🔨 블랙해머 ${currentRelic.blackhammerTier}강 이상 보유 시 적용</div>`;
        }
    }
    
    section.innerHTML = html;
}

function calculateAbility(relic, level) {
    const multiplier = level >= relic.abilityStart ? level - relic.abilityStart + 1 : 0;
    
    let result;
    
    // 커스텀 능력 계산
    if (relic.customAbility) {
        result = calculateCustomAbility(relic, level, multiplier);
    } else if (relic.noAbilityMultiplier) {
        result = relic.ability.replace(/\{([\d.]+)\}/g, '$1');
    } else {
        // 기본 능력 계산: {숫자}를 배수 적용
        result = relic.ability.replace(/\{([\d.]+)\}/g, (match, num) => {
            const base = parseFloat(num);
            return (base * multiplier).toString();
        });
    }
    
    // (고정) 텍스트 제거 - 사용자에게 표시하지 않음
    return result.replace(/\(고정\)/g, '');
}

function calculateCustomAbility(relic, level, multiplier) {
    const id = relic.customAbility;
    
    switch(id) {
        case 'solomonring': {
            const cd = Math.max(0.5, 5 - (multiplier - 1) * 0.5);
            let skulls = 1;
            if (level >= 7) skulls = 2;
            if (level >= 9) skulls = 3;
            return `네크로맨서가 장착 시 매 ${cd}초마다 전방으로 해골 ${skulls}기 소환, 해골 소환 시 체력 100(고정) 회복`;
        }
        case 'imperialjade': {
            const cd = Math.max(5, 30 - (multiplier - 1) * 5);
            return `전 아군에게 적용되는 공격력 15%(고정) 버프 토템을 성에 설치하고 ${cd}초마다 5초(고정)간 버프 부여(다수 보유 시 1%(고정)씩 증가)`;
        }
        case 'brancauldron': {
            const cd = Math.max(5, 95 - (multiplier - 1) * 15);
            const def = 20 * multiplier;
            return `체력이 30%(고정) 이하일 때 즉시 체력 전체 회복(${cd}초 쿨다운), 피에로가 장착 시 방어력 ${def} 추가 상승`;
        }
        case 'trident': {
            const range = 10 * multiplier;
            let targets = 1;
            if (level >= 7) targets = 2;
            if (level >= 9) targets = 3;
            return `쉐프와 랜서, 로그, 파이터의 일반 공격 사거리 ${range}% 증가 및 적군 ${targets}기 다중 타격`;
        }
        case 'ajaxshield': {
            if (level < 3) return '3강부터 능력 발동';
            const shields = level - 2;
            return `적의 공격을 ${shields}회 막는 방벽 생성(쿨타임 80초(고정)), 가디언, 팔라딘 2배 적용`;
        }
        case 'tahlum': {
            const pct = 70 + (multiplier - 1) * 10;
            return `머스킷티어와 거너, 메카닉이 장착 시 전방의 적을 2초(고정)마다 1회 자동 공격 (누적 ${pct}%)`;
        }
        case 'talaria': {
            const jumps = 3 + (multiplier - 1);
            const cd = multiplier;
            return `${jumps}단 점프, 점프 횟수마다 3%(고정)씩 3초(고정)간 공격력 버프 획득, 메카닉 레이저 쿨타임 ${cd}초 감소`;
        }
        case 'oracle': {
            const atk = 3 + (level - 1);
            const max = 60 + (level - 1) * 5;
            return `쌓인 실버량 1000(고정) 마다 공격력 추가 +${atk} (최대 공격력 ${max}, 장착 무관하며 보유 시 발동)`;
        }
        case 'silverhunter': {
            const silver = 34 + (level - 1) * 2;
            const maxSilver = 2000 + (level - 1) * 1000;
            const per = 900 - (level - 1) * 50;
            return `1초(고정)간 움직임 지속 시 은화 +${silver} (장착무관, 최대 ${maxSilver}), 5초마다 공격력의 20%(고정) 폭탄 생성, 공격력은 보유 은화 ${per}당 +1%(고정) (최대 +20%(고정))`;
        }
        case 'blackhammer': {
            if (level === 0) return '다른 유물들의 특수능력을 +1강 증가시킴';
            const affected = [];
            for (let i = 1; i <= 8; i++) {
                if (BLACKHAMMER_TIERS[i]) {
                    affected.push(...BLACKHAMMER_TIERS[i]);
                }
            }
            if (level >= 9) {
                return `다른 유물들의 특수능력을 +1강 증가시킴\n\n데미갓 이상일 경우 유물 장착 슬롯 +1 (장착 무관하며 보유 시 발동)\n\n+1강 효과 적용 유물: ${affected.join(', ')}`;
            }
            const currentAffected = [];
            for (let i = 1; i <= level; i++) {
                if (BLACKHAMMER_TIERS[i]) {
                    currentAffected.push(...BLACKHAMMER_TIERS[i]);
                }
            }
            return `다른 유물들의 특수능력을 +1강 증가시킴\n\n+1강 효과 적용 유물: ${currentAffected.join(', ')}`;
        }
        case 'blueprint': {
            let text = `다이아 보상 ${level}% 증가`;
            if (level >= 8) text += '\n디펜스 모드 미니맵 터치로 성 복귀 가능';
            if (level >= 9) text += '\n디펜스 모드 아이템 장착 슬롯 1개 추가';
            return text;
        }
        case 'goldenduck': {
            const max = 40 + (level - 1) * 20;
            return `디펜스 모드(난이도 11(고정) 이상) 게임 클리어 시 골드 보상 +1 (하루 최대 ${max}개, 장착 무관하며 보유 시 발동)`;
        }
        case 'heropentagon': {
            const atk = 2 + (level - 1);
            const shield = (0.6 + (level - 1) * 0.3).toFixed(1);
            return `(레이드 및 주간보스 한정) 내 영웅의 공격력 +${atk}% 증가, 피격 시 ${shield}% 확률로 1회(고정) 보호막 생성 (장착 무관, 보유 시 자동 발동)`;
        }
        case 'transcendbook': {
            const daily = 10 + (level - 1) * 5;
            const raid = 10 + (level - 1) * 5;
            return `출석체크 시 초월석 ${daily}개 추가 지급, 레이드에서 획득 가능한 초월석 +${raid} (장착 무관, 보유 시 자동 발동)`;
        }
    }
    
    return relic.ability;
}
