// 页面渲染模块
import { navData, HOME_TAGS } from '../data/nav-data.js';
import { getRandomOnline } from '../components/NavigationCard.js';

const DEFAULT_ITEM_URL = 'https://www.ng081.com';
const MAX_CAROUSEL_ITEMS = 5;
const DEFAULT_CAROUSEL_LABELS = { online: '在线人数', bonus: '反水优惠' };

const fallbackCarouselImage = `
  <div class="flex items-center justify-center card-expand-img text-primary/50">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  </div>
`;

function renderCarouselCard(item, index, labels) {
  const imageMarkup = item.iconImage
    ? `<img src="${item.iconImage}" class="card-expand-img" alt="${item.title}" loading="lazy"/>`
    : fallbackCarouselImage;

  return `
    <div class="card-expand" data-index="${index}" data-url="${item.url || DEFAULT_ITEM_URL}">
      ${imageMarkup}
      <div class="card-expand-title">
        <span>${item.title}</span>
        <div class="card-expand-info">
          <span><span class="label">${labels.online}</span><span class="value">${getRandomOnline()}</span></span>
          <span><span class="label">${labels.bonus}</span><span class="value">${item.bonus || '0.5%'}</span></span>
        </div>
      </div>
    </div>
  `;
}

function renderCarousel(items, labels = DEFAULT_CAROUSEL_LABELS) {
  return `
    <div class="card-expand-container">
      <div class="card-3d-5">
        ${items.slice(0, MAX_CAROUSEL_ITEMS).map((item, index) => renderCarouselCard(item, index, labels)).join('')}
      </div>
    </div>
  `;
}

function renderHomeTag({ text, textColor, borderColor }) {
  return `<span class="glass-tag px-4 py-1.5 text-xs md:text-sm font-code rounded-full ${textColor} border ${borderColor}">${text}</span>`;
}

export function renderHomePage() {
  return `
    <!-- Hero Header -->
    <div class="mb-4 md:mb-stack-lg border-l-4 border-primary pl-4">
      <h1 class="font-h1 text-2xl md:text-h1 uppercase leading-none glitch" data-glitch="注册就送88-888">注册就送88-888</h1>

      <div class="flex flex-wrap gap-2 mt-2">
        ${HOME_TAGS.map(renderHomeTag).join('')}
      </div>

      <p class="font-code text-[10px] md:text-secondary opacity-80 mt-1 md:mt-2 flex items-center gap-1">
        <span class="text-[12px] md:text-[16px]">新玩家</span>
        福利截至: <span id="countdown-display"></span>
      </p>
    </div>

    <!-- Horizontal Sliding Cards -->
    ${renderCarousel(navData.items)}

    <!-- Auth Image -->
    <div class="w-full flex justify-center mt-0 mb-3">
      <img src="./images/yzfwaqwd.webp" class="w-full max-w-2xl rounded-xl" alt="认证" fetchpriority="high"/>
    </div>

    <!-- Page Navigation -->
    <section class="mt-2 flex flex-col gap-4">
      <div class="glass-radio-group" id="page-nav">
        <input type="radio" name="page-nav" id="nav-promotion" checked />
        <label for="nav-promotion">活动优惠</label>

        <input type="radio" name="page-nav" id="nav-predict" />
        <label for="nav-predict">预测试玩</label>

        <input type="radio" name="page-nav" id="nav-download" />
        <label for="nav-download">官方下载</label>

        <input type="radio" name="page-nav" id="nav-vip" />
        <label for="nav-vip">VIP接待</label>

        <input type="radio" name="page-nav" id="nav-warning" />
        <label for="nav-warning">避坑公示</label>

        <div class="glass-glider"></div>
      </div>

      <iframe id="page-content-frame" class="page-content-iframe" src="./pages/promotion.html" loading="lazy"></iframe>
    </section>
  `;
}

// 初始化页面导航按钮与 iframe 联动（innerHTML 插入后需手动调用）
// 渲染动态部分（不含 Hero，因为已内联到 home.html）
export function renderDynamicSection() {
  return `
    <!-- Horizontal Sliding Cards -->
    ${renderCarousel(navData.items)}

    <!-- Auth Image -->
    <div class="w-full flex justify-center mt-0 mb-3">
      <img src="./images/yzfwaqwd.webp" class="w-full max-w-2xl rounded-xl" alt="认证" fetchpriority="high"/>
    </div>

    <!-- Page Navigation -->
    <section class="mt-2 flex flex-col gap-4">
      <div class="glass-radio-group" id="page-nav">
        <input type="radio" name="page-nav" id="nav-promotion" checked />
        <label for="nav-promotion">活动优惠</label>

        <input type="radio" name="page-nav" id="nav-predict" />
        <label for="nav-predict">预测试玩</label>

        <input type="radio" name="page-nav" id="nav-download" />
        <label for="nav-download">官方下载</label>

        <input type="radio" name="page-nav" id="nav-vip" />
        <label for="nav-vip">VIP接待</label>

        <input type="radio" name="page-nav" id="nav-warning" />
        <label for="nav-warning">避坑公示</label>

        <div class="glass-glider"></div>
      </div>

      <iframe id="page-content-frame" class="page-content-iframe" src="./pages/promotion.html" loading="lazy"></iframe>
    </section>
  `;
}

export function initPageNav() {
  const pages = {
    'nav-promotion': './pages/promotion.html',
    'nav-predict': './pages/first-deposit.html',
    'nav-download': './pages/download.html',
    'nav-vip': './pages/vip.html',
    'nav-warning': './pages/warning.html'
  };
  const frame = document.getElementById('page-content-frame');
  if (!frame) return;

  frame.addEventListener('load', function () {
    try { this.style.height = this.contentDocument.body.scrollHeight + 'px'; } catch (e) {}
  });

  document.querySelectorAll('#page-nav input').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (this.checked && pages[this.id]) frame.src = pages[this.id];
    });
  });
}
