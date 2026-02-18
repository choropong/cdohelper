// 성지키기 영혼 확률 데이터

// 스텟 목록 (순서)
const STAT_LIST = ['크리티컬 데미지', '크리티컬 확률', '방어력', '체력 회복', '공격속도', '공격력', '체력', '이동속도', '경험치획득률'];

// 스텟 이모지
const STAT_EMOJI = {
    '크리티컬 데미지': '💀',
    '크리티컬 확률': '🎯',
    '방어력': '🛡️',
    '체력 회복': '💚',
    '공격속도': '⚡',
    '공격력': '⚔️',
    '체력': '❤️',
    '이동속도': '👟',
    '경험치획득률': '📈'
};

// 스텟별 범위 데이터
const SOUL_DATA = {
    relic: {
        '크리티컬 데미지': { min: 1, max: 10, step: 1 },
        '크리티컬 확률': { min: 1, max: 10, step: 1 },
        '방어력': { min: 1, max: 10, step: 1 },
        '체력 회복': { min: 1, max: 10, step: 1 },
        '공격속도': { min: 1, max: 8, step: 1 },
        '공격력': { min: 1, max: 17, step: 1 },
        '체력': { min: 10, max: 310, step: 10 },
        '이동속도': { min: 1, max: 15, step: 1 },
        '경험치획득률': { min: 1, max: 16, step: 1 }
    },
    accessory: {
        '크리티컬 데미지': { min: 1, max: 6, step: 1 },
        '크리티컬 확률': { min: 1, max: 6, step: 1 },
        '방어력': { min: 1, max: 6, step: 1 },
        '체력 회복': { min: 1, max: 6, step: 1 },
        '공격속도': { min: 1, max: 6, step: 1 },
        '공격력': { min: 1, max: 12, step: 1 },
        '체력': { min: 10, max: 160, step: 10 },
        '이동속도': { min: 1, max: 10, step: 1 },
        '경험치획득률': { min: 1, max: 10, step: 1 }
    }
};

// 확률 데이터 (각 값의 개별 확률)
const PROB_DATA = {
    relic: {
        '크리티컬 데미지': [
            { range: [1, 7], prob: 14.0333 },
            { range: [8, 8], prob: 1.0333 },
            { range: [9, 9], prob: 0.5333 },
            { range: [10, 10], prob: 0.2 }
        ],
        '크리티컬 확률': [
            { range: [1, 7], prob: 14.0333 },
            { range: [8, 8], prob: 1.0333 },
            { range: [9, 9], prob: 0.5333 },
            { range: [10, 10], prob: 0.2 }
        ],
        '방어력': [
            { range: [1, 7], prob: 14.0333 },
            { range: [8, 8], prob: 1.0333 },
            { range: [9, 9], prob: 0.5333 },
            { range: [10, 10], prob: 0.2 }
        ],
        '체력 회복': [
            { range: [1, 7], prob: 14.0333 },
            { range: [8, 8], prob: 1.0333 },
            { range: [9, 9], prob: 0.5333 },
            { range: [10, 10], prob: 0.2 }
        ],
        '공격속도': [
            { range: [1, 5], prob: 19.5452 },
            { range: [6, 6], prob: 1.3452 },
            { range: [7, 7], prob: 0.6786 },
            { range: [8, 8], prob: 0.25 }
        ],
        '공격력': [
            { range: [1, 14], prob: 7.0718 },
            { range: [15, 15], prob: 0.5718 },
            { range: [16, 16], prob: 0.3051 },
            { range: [17, 17], prob: 0.1176 }
        ],
        '체력': [
            { range: [10, 280], prob: 3.5524 },
            { range: [290, 290], prob: 0.3024 },
            { range: [300, 300], prob: 0.1645 },
            { range: [310, 310], prob: 0.0645 }
        ],
        '이동속도': [
            { range: [1, 12], prob: 8.2386 },
            { range: [13, 13], prob: 0.6553 },
            { range: [14, 14], prob: 0.3476 },
            { range: [15, 15], prob: 0.1333 }
        ],
        '경험치획득률': [
            { range: [1, 13], prob: 7.6107 },
            { range: [14, 14], prob: 0.6107 },
            { range: [15, 15], prob: 0.325 },
            { range: [16, 16], prob: 0.125 }
        ]
    },
    accessory: {
        '크리티컬 데미지': [
            { range: [1, 2], prob: 43.65 },
            { range: [3, 3], prob: 8.65 },
            { range: [4, 4], prob: 1.9833 },
            { range: [5, 5], prob: 1.2333 },
            { range: [6, 6], prob: 0.8333 }
        ],
        '공격속도': [
            { range: [1, 2], prob: 43.65 },
            { range: [3, 3], prob: 8.65 },
            { range: [4, 4], prob: 1.9833 },
            { range: [5, 5], prob: 1.2333 },
            { range: [6, 6], prob: 0.8333 }
        ],
        '크리티컬 확률': [
            { range: [1, 2], prob: 43.65 },
            { range: [3, 3], prob: 8.65 },
            { range: [4, 4], prob: 1.9833 },
            { range: [5, 5], prob: 1.2333 },
            { range: [6, 6], prob: 0.8333 }
        ],
        '방어력': [
            { range: [1, 2], prob: 43.65 },
            { range: [3, 3], prob: 8.65 },
            { range: [4, 4], prob: 1.9833 },
            { range: [5, 5], prob: 1.2333 },
            { range: [6, 6], prob: 0.8333 }
        ],
        '체력 회복': [
            { range: [1, 2], prob: 43.65 },
            { range: [3, 3], prob: 8.65 },
            { range: [4, 4], prob: 1.9833 },
            { range: [5, 5], prob: 1.2333 },
            { range: [6, 6], prob: 0.8333 }
        ],
        '공격력': [
            { range: [1, 8], prob: 11.8707 },
            { range: [9, 9], prob: 3.1207 },
            { range: [10, 10], prob: 0.8985 },
            { range: [11, 11], prob: 0.5985 },
            { range: [12, 12], prob: 0.4167 }
        ],
        '체력': [
            { range: [10, 120], prob: 8.0319 },
            { range: [130, 130], prob: 2.1986 },
            { range: [140, 140], prob: 0.6601 },
            { range: [150, 150], prob: 0.4458 },
            { range: [160, 160], prob: 0.3125 }
        ],
        '이동속도': [
            { range: [1, 6], prob: 15.621 },
            { range: [7, 7], prob: 3.9544 },
            { range: [8, 8], prob: 1.0972 },
            { range: [9, 9], prob: 0.7222 },
            { range: [10, 10], prob: 0.5 }
        ],
        '경험치획득률': [
            { range: [1, 6], prob: 15.621 },
            { range: [7, 7], prob: 3.9544 },
            { range: [8, 8], prob: 1.0972 },
            { range: [9, 9], prob: 0.7222 },
            { range: [10, 10], prob: 0.5 }
        ]
    }
};

// 특정 값의 확률 구하기
function getValueProbability(equipType, statName, value) {
    const probData = PROB_DATA[equipType]?.[statName];
    if (!probData) return 0;
    
    const statInfo = SOUL_DATA[equipType][statName];
    if (statInfo.step === 10 && value % 10 !== 0) return 0;
    
    for (const item of probData) {
        if (value >= item.range[0] && value <= item.range[1]) {
            return item.prob;
        }
    }
    return 0;
}

// 범위 확률 계산
function calculateRangeProbability(equipType, statName, minVal, maxVal, mode = 'range') {
    const statInfo = SOUL_DATA[equipType]?.[statName];
    if (!statInfo) return 0;
    
    let actualMin, actualMax;
    
    if (mode === 'gte') {
        actualMin = minVal;
        actualMax = statInfo.max;
    } else if (mode === 'lte') {
        actualMin = statInfo.min;
        actualMax = maxVal;
    } else {
        actualMin = minVal;
        actualMax = maxVal;
    }
    
    actualMin = Math.max(actualMin, statInfo.min);
    actualMax = Math.min(actualMax, statInfo.max);
    
    if (actualMin > actualMax) return 0;
    
    let totalProb = 0;
    
    if (statInfo.step === 10) {
        for (let v = Math.ceil(actualMin / 10) * 10; v <= actualMax; v += 10) {
            totalProb += getValueProbability(equipType, statName, v);
        }
    } else {
        for (let v = actualMin; v <= actualMax; v++) {
            totalProb += getValueProbability(equipType, statName, v);
        }
    }
    
    return totalProb;
}

// N회 시도 시 성공 확률
function calculateSuccessInNTries(probability, tries) {
    if (probability <= 0) return 0;
    if (probability >= 100) return 100;
    return (1 - Math.pow(1 - probability / 100, tries)) * 100;
}

// 기대 시도 횟수
function calculateExpectedTries(probability) {
    if (probability <= 0) return Infinity;
    return 100 / probability;
}

// X% 확률 도달에 필요한 시도 횟수
function calculateTriesForProbability(singleProb, targetProb) {
    if (singleProb <= 0) return Infinity;
    return Math.ceil(Math.log(1 - targetProb / 100) / Math.log(1 - singleProb / 100));
}

// 시뮬레이션
function simulateRoll(equipType, statName) {
    const statInfo = SOUL_DATA[equipType]?.[statName];
    if (!statInfo) return null;
    
    const possibilities = [];
    
    if (statInfo.step === 10) {
        for (let v = statInfo.min; v <= statInfo.max; v += 10) {
            possibilities.push({ value: v, prob: getValueProbability(equipType, statName, v) });
        }
    } else {
        for (let v = statInfo.min; v <= statInfo.max; v++) {
            possibilities.push({ value: v, prob: getValueProbability(equipType, statName, v) });
        }
    }
    
    const totalProb = possibilities.reduce((sum, p) => sum + p.prob, 0);
    const rand = Math.random() * totalProb;
    let cumulative = 0;
    
    for (const p of possibilities) {
        cumulative += p.prob;
        if (rand <= cumulative) return p;
    }
    
    return possibilities[possibilities.length - 1];
}

// 등급 판정 (스텟별 수치 기준)
const STAT_TIERS = {
    relic: {
        '크리티컬 데미지': { t1: 10, t2: 9, t3: 8 },
        '크리티컬 확률': { t1: 10, t2: 9, t3: 8 },
        '방어력': { t1: 10, t2: 9, t3: 8 },
        '체력 회복': { t1: 10, t2: 9, t3: 8 },
        '공격속도': { t1: 8, t2: 7, t3: 6 },
        '공격력': { t1: 17, t2: 16, t3: 15 },
        '체력': { t1: 310, t2: 300, t3: 290 },
        '이동속도': { t1: 15, t2: 14, t3: 13 },
        '경험치획득률': { t1: 16, t2: 15, t3: 14 }
    },
    accessory: {
        '크리티컬 데미지': { t1: 6, t2: 5, t3: 4 },
        '크리티컬 확률': { t1: 6, t2: 5, t3: 4 },
        '방어력': { t1: 6, t2: 5, t3: 4 },
        '체력 회복': { t1: 6, t2: 5, t3: 4 },
        '공격속도': { t1: 6, t2: 5, t3: 4 },
        '공격력': { t1: 12, t2: 11, t3: 10 },
        '체력': { t1: 160, t2: 150, t3: 140 },
        '이동속도': { t1: 10, t2: 9, t3: 8 },
        '경험치획득률': { t1: 10, t2: 9, t3: 8 }
    }
};

function getValueTier(equipType, statName, value) {
    const tiers = STAT_TIERS[equipType]?.[statName];
    if (!tiers) return { tier: 'common', label: '' };
    
    if (value >= tiers.t1) return { tier: 't1', label: `${tiers.t1}` };
    if (value >= tiers.t2) return { tier: 't2', label: `${tiers.t2}+` };
    if (value >= tiers.t3) return { tier: 't3', label: `${tiers.t3}+` };
    return { tier: 'common', label: '' };
}
