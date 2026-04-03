/**
 * 神秘塔罗 - 1920s 盖茨比风格塔罗占卜
 * Art Deco 美学交互逻辑
 */

// ========================================
// 塔罗牌数据（22张大阿卡纳）
// ========================================
const TAROT_CARDS = [
    { id: 0, name: "愚人", nameEn: "The Fool", image: "0愚人.jpg", meaning: "新的开始、冒险、纯真、自发性" },
    { id: 1, name: "魔术师", nameEn: "The Magician", image: "1魔术师.jpg", meaning: "创造力、技能、意志力、显化" },
    { id: 2, name: "女祭司", nameEn: "The High Priestess", image: "2女祭司.jpg", meaning: "直觉、潜意识、神秘、内在智慧" },
    { id: 3, name: "皇后", nameEn: "The Empress", image: "3女皇.jpg", meaning: "丰饶、母性、创造力、自然" },
    { id: 4, name: "皇帝", nameEn: "The Emperor", image: "4皇帝.jpg", meaning: "权威、结构、父性、控制" },
    { id: 5, name: "教皇", nameEn: "The Hierophant", image: "5教皇.jpg", meaning: "传统、信仰、教育、精神指引" },
    { id: 6, name: "恋人", nameEn: "The Lovers", image: "6恋人.jpg", meaning: "爱情、和谐、选择、价值观" },
    { id: 7, name: "战车", nameEn: "The Chariot", image: "7战车.jpg", meaning: "意志力、胜利、决心、控制" },
    { id: 8, name: "力量", nameEn: "Strength", image: "8力量.jpg", meaning: "勇气、耐心、内在力量、同情心" },
    { id: 9, name: "隐士", nameEn: "The Hermit", image: "9隐士.jpg", meaning: "内省、孤独、寻求真理、指引" },
    { id: 10, name: "命运之轮", nameEn: "Wheel of Fortune", image: "10命运之轮.jpg", meaning: "变化、命运、周期、转折点" },
    { id: 11, name: "正义", nameEn: "Justice", image: "11正义.jpg", meaning: "公正、平衡、真理、因果" },
    { id: 12, name: "倒吊人", nameEn: "The Hanged Man", image: "12倒吊人.jpg", meaning: "牺牲、等待、新视角、放下" },
    { id: 13, name: "死神", nameEn: "Death", image: "13死神.jpg", meaning: "转变、结束、新生、释放" },
    { id: 14, name: "节制", nameEn: "Temperance", image: "14节制.jpg", meaning: "平衡、调和、耐心、中庸" },
    { id: 15, name: "恶魔", nameEn: "The Devil", image: "15恶魔.jpg", meaning: "束缚、欲望、物质主义、阴影面" },
    { id: 16, name: "塔", nameEn: "The Tower", image: "16塔.jpg", meaning: "突变、觉醒、破坏、启示" },
    { id: 17, name: "星星", nameEn: "The Star", image: "17星星.jpg", meaning: "希望、灵感、宁静、指引" },
    { id: 18, name: "月亮", nameEn: "The Moon", image: "18月亮.jpg", meaning: "幻觉、恐惧、潜意识、直觉" },
    { id: 19, name: "太阳", nameEn: "The Sun", image: "19太阳.jpg", meaning: "快乐、成功、活力、清晰" },
    { id: 20, name: "审判", nameEn: "Judgement", image: "20审判.jpg", meaning: "重生、觉醒、宽恕、评估" },
    { id: 21, name: "世界", nameEn: "The World", image: "21世界.jpg", meaning: "完成、整合、成就、圆满" }
];

// 牌阵配置
const SPREADS = {
    daily: {
        name: "塔罗日运",
        cardCount: 1,
        positions: ["今日指引"]
    },
    three: {
        name: "无牌阵",
        cardCount: 3,
        positions: ["过去", "现在", "未来"]
    },
    choice: {
        name: "二选一",
        cardCount: 5,
        positions: ["现状", "选择A过程", "选择A结果", "选择B过程", "选择B结果"]
    }
};

// ========================================
// 全局状态
// ========================================
const state = {
    currentSpread: null,
    selectedCards: [],
    cardsToSelect: [],
    isShuffling: false,
    currentSection: 'home'
};

// ========================================
// 粒子系统
// ========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.2,
            twinkle: Math.random() * Math.PI * 2
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // 漩涡效果
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                const angle = Math.atan2(dy, dx);
                const rotationSpeed = 0.0005;
                p.speedX += Math.sin(angle + Math.PI / 2) * rotationSpeed * distance * 0.01;
                p.speedY += Math.cos(angle + Math.PI / 2) * rotationSpeed * distance * 0.01;
            }

            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            p.twinkle += 0.02;

            // 边界处理
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            // 绘制粒子
            const twinkleOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.twinkle));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(201, 168, 76, ${twinkleOpacity})`;
            this.ctx.fill();

            // 发光效果
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            gradient.addColorStop(0, `rgba(201, 168, 76, ${twinkleOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 鼠标拖尾效果
// ========================================
class MouseTrail {
    constructor() {
        this.canvas = document.getElementById('trail-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.trail = [];
        this.maxTrail = 20;
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.addPoint(e));
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.addPoint(touch);
        });
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addPoint(e) {
        this.trail.push({
            x: e.clientX,
            y: e.clientY,
            age: 0,
            size: Math.random() * 3 + 2
        });
        
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.trail.forEach((point, index) => {
            point.age += 0.03;
            const life = 1 - point.age;
            
            if (life > 0) {
                const opacity = life * 0.6;
                const size = point.size * life;
                
                // 绘制星光
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
                this.ctx.fill();

                // 十字光芒
                this.ctx.strokeStyle = `rgba(201, 168, 76, ${opacity * 0.5})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(point.x - size * 2, point.y);
                this.ctx.lineTo(point.x + size * 2, point.y);
                this.ctx.moveTo(point.x, point.y - size * 2);
                this.ctx.lineTo(point.x, point.y + size * 2);
                this.ctx.stroke();
            }
        });

        this.trail = this.trail.filter(p => p.age < 1);
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 页面切换
// ========================================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    state.currentSection = sectionId;
}

// ========================================
// 洗牌动画
// ========================================
function shuffleCards() {
    showSection('shuffle-section');
    state.isShuffling = true;

    setTimeout(() => {
        state.isShuffling = false;
        initCardSelection();
        showSection('select-section');
    }, 3000);
}

// ========================================
// 初始化选牌
// ========================================
function initCardSelection() {
    const grid = document.getElementById('cards-grid');
    const slotsContainer = document.getElementById('selected-slots');
    
    grid.innerHTML = '';
    grid.className = 'cards-fan';
    slotsContainer.innerHTML = '';
    state.selectedCards = [];
    
    // 生成待选牌
    const totalCards = 22;
    state.cardsToSelect = [];
    const indices = Array.from({ length: 22 }, (_, i) => i);
    
    for (let i = 0; i < totalCards; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        state.cardsToSelect.push(indices[randomIndex]);
        indices.splice(randomIndex, 1);
    }
    
    // 创建微弧形排列的卡牌 - 更平直更紧凑
    const centerIndex = Math.floor(totalCards / 2);
    const maxRotation = 10; // 减小弧度：最大旋转角度从60改为10度
    const angleStep = (maxRotation * 2) / (totalCards - 1); // 每张卡牌的角度间隔
    const overlapOffset = window.innerWidth < 768 ? 15 : 25; // 更紧凑：减小卡牌间距
    
    state.cardsToSelect.forEach((cardIndex, i) => {
        const card = document.createElement('div');
        card.className = 'tarot-card';
        card.dataset.index = cardIndex;
        
        // 计算微弧形位置和旋转
        const positionFromCenter = i - centerIndex;
        const rotation = positionFromCenter * angleStep;
        const translateX = positionFromCenter * overlapOffset;
        
        // 计算z-index确保中间卡牌在上层
        const zIndex = totalCards - Math.abs(positionFromCenter);
        
        // 根据屏幕调整卡牌宽度基准
        const cardWidth = window.innerWidth < 768 ? 32 : 45;
        
        card.style.cssText = `
            transform: rotate(${rotation}deg) translateX(${translateX}px);
            z-index: ${zIndex};
            left: calc(50% - ${cardWidth}px);
        `;
        
        card.innerHTML = `
            <div class="tarot-card-inner">
                <div class="tarot-card-back">
                    <img src="public/card-back.jpg" alt="塔罗卡背">
                </div>
                <div class="tarot-card-front">
                    <img src="cards/${TAROT_CARDS[cardIndex].image}" alt="${TAROT_CARDS[cardIndex].name}" 
                         onerror="this.src='public/card-back.jpg'">
                    <div class="tarot-card-name">${TAROT_CARDS[cardIndex].name}</div>
                </div>
            </div>
        `;
        
        // Hover效果 - 预选状态
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('flying')) {
                card.classList.add('hovered');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
        
        // 点击选中并飞出
        card.addEventListener('click', () => selectCard(card, cardIndex));
        grid.appendChild(card);
        
        // 微弧形展开入场动画
        card.style.opacity = '0';
        const startRotation = rotation + (positionFromCenter > 0 ? 10 : -10);
        card.style.transform = `rotate(${startRotation}deg) translateX(${translateX}px)`;
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = `rotate(${rotation}deg) translateX(${translateX}px)`;
        }, i * 40);
    });
    
    // 创建选中槽位
    const cardCount = SPREADS[state.currentSpread].cardCount;
    for (let i = 0; i < cardCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'selected-slot';
        slot.innerHTML = `<span class="selected-slot-number">${i + 1}</span>`;
        slotsContainer.appendChild(slot);
    }
    
    updateRemainingCount();
}

// 更新剩余数量
function updateRemainingCount() {
    const cardCount = SPREADS[state.currentSpread].cardCount;
    const remaining = cardCount - state.selectedCards.length;
    document.getElementById('cards-remaining').textContent = remaining;
    document.getElementById('select-title').innerHTML = 
        remaining > 0 ? `请选择 <span id="cards-remaining">${remaining}</span> 张牌` : '选牌完成';
}

// 选择卡牌
function selectCard(cardElement, cardIndex) {
    const cardCount = SPREADS[state.currentSpread].cardCount;
    
    if (state.selectedCards.length >= cardCount) return;
    if (state.selectedCards.includes(cardIndex)) return;
    
    state.selectedCards.push(cardIndex);
    
    // 先移除hovered状态，然后触发飞出动画
    cardElement.classList.remove('hovered');
    cardElement.classList.add('flying');
    
    // 填充槽位
    const slots = document.querySelectorAll('.selected-slot');
    const currentSlot = slots[state.selectedCards.length - 1];
    currentSlot.classList.add('filled');
    currentSlot.innerHTML = `<div style="font-size: 0.7rem; color: var(--gold-primary);">${state.selectedCards.length}</div>`;
    
    updateRemainingCount();
    
    // 选完所有牌
    if (state.selectedCards.length === cardCount) {
        setTimeout(() => {
            revealCards();
        }, 1000);
    }
}

// ========================================
// 翻牌展示
// ========================================
async function revealCards() {
    showSection('reading-section');
    
    const container = document.getElementById('reading-cards');
    const contentContainer = document.getElementById('reading-content');
    
    container.innerHTML = '';
    contentContainer.innerHTML = '';
    
    const spread = SPREADS[state.currentSpread];
    const selectedCardData = state.selectedCards.map(index => TAROT_CARDS[index]);
    
    // 创建结果卡牌 - 卡牌图片占满，信息在下方
    selectedCardData.forEach((card, i) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'reading-card';
        cardEl.innerHTML = `
            <div class="reading-card-inner">
                <div class="reading-card-front">
                    <img class="reading-card-image" src="cards/${card.image}" alt="${card.name}" 
                         onerror="this.src='public/card-back.jpg'">
                </div>
            </div>
            <div class="reading-card-info">
                <div class="reading-card-position">${spread.positions[i]}</div>
                <div class="reading-card-name">${card.name}</div>
            </div>
        `;
        container.appendChild(cardEl);
    });
    
    // 显示加载状态
    contentContainer.innerHTML = `
        <div class="reading-item" style="text-align: center; padding: 3rem;">
            <div class="loading-ornament" style="width: 60px; height: 60px; margin: 0 auto 1rem;"></div>
            <p style="color: var(--gold-dark);">正在解读牌意...</p>
        </div>
    `;
    
    // 调用API获取解读
    try {
        const reading = await fetchReading(selectedCardData, spread);
        displayReading(reading, selectedCardData, spread);
    } catch (error) {
        console.error('获取解读失败:', error);
        // 使用本地解读作为fallback
        const localReading = generateLocalReading(selectedCardData, spread);
        displayReading(localReading, selectedCardData, spread);
    }
}

// 显示解读
function displayReading(reading, cards, spread) {
    const container = document.getElementById('reading-content');
    container.innerHTML = '';
    
    // 各位置解读
    reading.positions.forEach((pos, i) => {
        const item = document.createElement('div');
        item.className = 'reading-item';
        item.innerHTML = `
            <div class="reading-item-header">
                <span class="reading-item-position">${pos.position}</span>
                <span class="reading-item-card">${pos.card}</span>
            </div>
            <p class="reading-item-text">${pos.interpretation}</p>
        `;
        container.appendChild(item);
    });
    
    // 总结
    const summary = document.createElement('div');
    summary.className = 'reading-summary';
    summary.innerHTML = `
        <h3 class="reading-summary-title">综合启示</h3>
        <p class="reading-summary-text">${reading.summary}</p>
    `;
    container.appendChild(summary);
}

// ========================================
// API 调用
// ========================================
async function fetchReading(cards, spread) {
    // 如果没有配置后端API，使用本地解读
    if (typeof API_CONFIG === 'undefined' || !API_CONFIG.baseUrl) {
        throw new Error('API not configured');
    }
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spread: state.currentSpread,
            cards: cards.map(c => ({ name: c.name, meaning: c.meaning })),
            positions: spread.positions
        })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    return await response.json();
}

// 本地解读生成（Fallback）
function generateLocalReading(cards, spread) {
    const interpretations = cards.map((card, i) => ({
        position: spread.positions[i],
        card: card.name,
        interpretation: `${card.name}出现在${spread.positions[i]}的位置，暗示着${card.meaning}的能量正在影响这个领域。这张牌提醒你要关注内心的声音，保持觉察，变化即将到来。`
    }));
    
    const summary = `这${cards.length}张牌共同揭示了你当前的生命课题。${cards[0].name}作为核心能量，指引你在${spread.positions[0]}的领域中寻求突破。相信直觉，保持开放，宇宙的安排正在为你展开。`;
    
    return { positions: interpretations, summary };
}

// ========================================
// 事件绑定
// ========================================
function initEvents() {
    // 开始按钮
    document.getElementById('start-btn').addEventListener('click', () => {
        showSection('spread-section');
    });
    
    // 返回按钮
    document.getElementById('back-home-btn').addEventListener('click', () => {
        showSection('home-section');
    });
    
    // 牌阵选择
    document.querySelectorAll('.spread-card').forEach(card => {
        card.addEventListener('click', () => {
            state.currentSpread = card.dataset.spread;
            shuffleCards();
        });
    });
    
    // 再次占卜
    document.getElementById('new-reading-btn').addEventListener('click', () => {
        state.selectedCards = [];
        state.currentSpread = null;
        showSection('home-section');
    });
}

// ========================================
// 加载动画
// ========================================
function hideLoading() {
    const loading = document.getElementById('loading-screen');
    loading.classList.add('hidden');
}

// ========================================
// 初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子系统
    new ParticleSystem();
    
    // 初始化鼠标拖尾
    new MouseTrail();
    
    // 绑定事件
    initEvents();
    
    // 隐藏加载动画
    setTimeout(hideLoading, 2000);
});
