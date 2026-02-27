// 성지키기 영혼 계산기 앱

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCalculator();
    initSimulator();
});

// ========== 탭 ==========
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.tab-content');
            parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            parent.querySelector(`#${btn.dataset.subtab}`).classList.add('active');
        });
    });
}

// ========== 계산기 ==========
let calcState = {
    equipType: 'relic',
    selectedStat: '크리티컬 데미지',
    mode: 'range'
};

function initCalculator() {
    // 장비 타입
    document.querySelectorAll('input[name="calcEquip"]').forEach(radio => {
        radio.addEventListener('change', () => {
            calcState.equipType = radio.value;
            updateCalcStatGrid();
            updateRangeSliders();
            updateInstantProb();
        });
    });

    // 모드
    document.querySelectorAll('input[name="calcMode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            calcState.mode = radio.value;
            updateModeUI();
            updateInstantProb();
        });
    });

    // 스텟 그리드
    updateCalcStatGrid();

    // 슬라이더 & 입력
    const sliderA = document.getElementById('sliderA');
    const sliderB = document.getElementById('sliderB');
    const rangeA = document.getElementById('rangeA');
    const rangeB = document.getElementById('rangeB');
    const trySlider = document.getElementById('trySlider');
    const tryCount = document.getElementById('tryCount');

    sliderA.addEventListener('input', () => {
        rangeA.value = sliderA.value;
        if (parseInt(sliderA.value) > parseInt(sliderB.value)) {
            sliderB.value = sliderA.value;
            rangeB.value = sliderA.value;
        }
        updateInstantProb();
    });

    sliderB.addEventListener('input', () => {
        rangeB.value = sliderB.value;
        if (parseInt(sliderB.value) < parseInt(sliderA.value)) {
            sliderA.value = sliderB.value;
            rangeA.value = sliderB.value;
        }
        updateInstantProb();
    });

    rangeA.addEventListener('change', () => {
        let val = roundToStep(parseInt(rangeA.value) || 1);
        const info = SOUL_DATA[calcState.equipType][calcState.selectedStat];
        val = Math.max(info.min, Math.min(info.max, val));
        rangeA.value = val;
        sliderA.value = val;
        if (val > parseInt(rangeB.value)) {
            rangeB.value = val;
            sliderB.value = val;
        }
        updateInstantProb();
    });

    rangeB.addEventListener('change', () => {
        let val = roundToStep(parseInt(rangeB.value) || 1);
        const info = SOUL_DATA[calcState.equipType][calcState.selectedStat];
        val = Math.max(info.min, Math.min(info.max, val));
        rangeB.value = val;
        sliderB.value = val;
        if (val < parseInt(rangeA.value)) {
            rangeA.value = val;
            sliderA.value = val;
        }
        updateInstantProb();
    });

    trySlider.addEventListener('input', () => tryCount.value = trySlider.value);
    tryCount.addEventListener('change', () => {
        let val = Math.max(1, Math.min(100, parseInt(tryCount.value) || 1));
        tryCount.value = val;
        trySlider.value = val;
    });

    document.getElementById('calculateBtn').addEventListener('click', calculate);

    updateRangeSliders();
    updateInstantProb();
}

function roundToStep(value) {
    const info = SOUL_DATA[calcState.equipType][calcState.selectedStat];
    return info.step === 10 ? Math.round(value / 10) * 10 : value;
}

function updateCalcStatGrid() {
    const grid = document.getElementById('calcStatGrid');
    grid.innerHTML = '';
    
    STAT_LIST.forEach(stat => {
        const btn = document.createElement('button');
        btn.className = 'stat-btn' + (stat === calcState.selectedStat ? ' active' : '');
        btn.innerHTML = `<img src="${STAT_ICONS[stat]}" alt="" style="width:16px;height:16px;vertical-align:middle;margin-right:3px;">${stat}`;
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.stat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calcState.selectedStat = stat;
            updateRangeSliders();
            updateInstantProb();
        });
        grid.appendChild(btn);
    });
}

function updateRangeSliders() {
    const info = SOUL_DATA[calcState.equipType][calcState.selectedStat];
    const sliderA = document.getElementById('sliderA');
    const sliderB = document.getElementById('sliderB');
    const rangeA = document.getElementById('rangeA');
    const rangeB = document.getElementById('rangeB');

    sliderA.min = info.min;
    sliderA.max = info.max;
    sliderA.step = info.step;
    sliderB.min = info.min;
    sliderB.max = info.max;
    sliderB.step = info.step;

    sliderA.value = info.min;
    sliderB.value = info.max;
    rangeA.value = info.min;
    rangeB.value = info.max;
}

function updateModeUI() {
    const rangeAGroup = document.getElementById('rangeAGroup');
    const rangeBGroup = document.getElementById('rangeBGroup');
    const labelA = rangeAGroup.querySelector('label');
    const labelB = rangeBGroup.querySelector('label');

    if (calcState.mode === 'gte') {
        rangeAGroup.classList.remove('hidden');
        rangeBGroup.classList.add('hidden');
        labelA.textContent = '기준값';
    } else if (calcState.mode === 'lte') {
        rangeAGroup.classList.add('hidden');
        rangeBGroup.classList.remove('hidden');
        labelB.textContent = '기준값';
    } else {
        rangeAGroup.classList.remove('hidden');
        rangeBGroup.classList.remove('hidden');
        labelA.textContent = '시작';
        labelB.textContent = '끝';
    }
}

function updateInstantProb() {
    const a = parseInt(document.getElementById('rangeA').value);
    const b = parseInt(document.getElementById('rangeB').value);
    const prob = calculateRangeProbability(calcState.equipType, calcState.selectedStat, a, b, calcState.mode);
    document.getElementById('instantProbValue').textContent = prob.toFixed(4) + '%';
}

function calculate() {
    const a = parseInt(document.getElementById('rangeA').value);
    const b = parseInt(document.getElementById('rangeB').value);
    const tries = parseInt(document.getElementById('tryCount').value);

    const prob = calculateRangeProbability(calcState.equipType, calcState.selectedStat, a, b, calcState.mode);
    const success = calculateSuccessInNTries(prob, tries);
    const expected = calculateExpectedTries(prob);
    const tries50 = calculateTriesForProbability(prob, 50);
    const tries90 = calculateTriesForProbability(prob, 90);

    document.getElementById('resultProb').textContent = prob.toFixed(4) + '%';
    document.getElementById('resultAvg').textContent = expected < 10000 ? expected.toFixed(1) + '회' : '10000+회';
    document.getElementById('result50').textContent = tries50 < 10000 ? tries50 + '회' : '10000+회';
    document.getElementById('result90').textContent = tries90 < 10000 ? tries90 + '회' : '10000+회';
    document.getElementById('resultSuccess').textContent = success.toFixed(2) + '%';

    document.getElementById('calcResult').classList.remove('hidden');
}

// ========== 시뮬레이터 ==========
let simState = {
    equipType: 'relic',
    selectedStat: '크리티컬 데미지',
    count: 10
};

function initSimulator() {
    document.querySelectorAll('input[name="simEquip"]').forEach(radio => {
        radio.addEventListener('change', () => {
            simState.equipType = radio.value;
            updateSimStatGrid();
        });
    });

    document.querySelectorAll('input[name="simCount"]').forEach(radio => {
        radio.addEventListener('change', () => simState.count = parseInt(radio.value));
    });

    updateSimStatGrid();
    document.getElementById('simulateBtn').addEventListener('click', runSimulation);
}

function updateSimStatGrid() {
    const grid = document.getElementById('simStatGrid');
    grid.innerHTML = '';
    
    STAT_LIST.forEach(stat => {
        const btn = document.createElement('button');
        btn.className = 'stat-btn' + (stat === simState.selectedStat ? ' active' : '');
        btn.innerHTML = `<img src="${STAT_ICONS[stat]}" alt="" style="width:16px;height:16px;vertical-align:middle;margin-right:3px;">${stat}`;
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.stat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            simState.selectedStat = stat;
        });
        grid.appendChild(btn);
    });
}

function runSimulation() {
    const results = [];
    const tiers = STAT_TIERS[simState.equipType][simState.selectedStat];
    
    for (let i = 0; i < simState.count; i++) {
        const r = simulateRoll(simState.equipType, simState.selectedStat);
        if (r) {
            r.tier = getValueTier(simState.equipType, simState.selectedStat, r.value);
            results.push(r);
        }
    }
    displaySimResults(results, tiers);
}

function displaySimResults(results, tiers) {
    document.getElementById('simResults').classList.remove('hidden');

    const values = results.map(r => r.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const tierCount = { t1: 0, t2: 0, t3: 0 };
    results.forEach(r => {
        if (r.tier.tier !== 'common') tierCount[r.tier.tier]++;
    });

    document.getElementById('simSummary').innerHTML = `
        <div class="sim-summary-item"><span class="label">최소</span><span class="value">${min}</span></div>
        <div class="sim-summary-item"><span class="label">최대</span><span class="value">${max}</span></div>
        <div class="sim-summary-item"><span class="label">평균</span><span class="value">${avg.toFixed(1)}</span></div>
        <div class="sim-summary-item"><span class="label">${tiers.t3}+</span><span class="value" style="color:#3b82f6">${tierCount.t3 + tierCount.t2 + tierCount.t1}</span></div>
        <div class="sim-summary-item"><span class="label">${tiers.t2}+</span><span class="value" style="color:#f59e0b">${tierCount.t2 + tierCount.t1}</span></div>
        <div class="sim-summary-item"><span class="label">${tiers.t1}</span><span class="value" style="color:#ef4444">${tierCount.t1}</span></div>
    `;

    document.getElementById('simHistory').innerHTML = results.map((r, i) => `
        <div class="sim-item ${r.tier.tier}">
            <div class="sim-item-stat">
                <span class="sim-item-num">#${i + 1}</span>
                <span class="sim-item-value">${r.value}</span>
            </div>
            <span class="sim-item-prob">${r.prob.toFixed(4)}%</span>
        </div>
    `).join('');
}
