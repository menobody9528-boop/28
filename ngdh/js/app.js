// 主应用入口
import { startCountdownTimer } from './utils/countdown.js';
import { renderHomePage as renderHomePageContent, renderDynamicSection, initPageNav } from './pages/page-render.js';
import { initCarousel } from './components/CardCarousel.js';

// 应用主对象
const app = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // 添加事件监听器
    this.addEventListeners();
    // 初始渲染
    this.render();
    // 追加动态内容（Hero 已内联）
    this.appendDynamicContent();
    // 初始化页面导航按钮联动
    initPageNav();
    // 延迟执行高耗能脚本
    setTimeout(() => {
      startCountdownTimer();
      initCarousel();
    }, 100);
  },

  addEventListeners() {
    const brandLogo = document.querySelector('header .gold-text-glow');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        window.location.hash = '/';
      });
    }

    const navLink = document.querySelector('header nav a');
    if (navLink) {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '/';
      });
    }
  },

  handleRoute() {
    return renderHomePageContent();
  },

  render() {
    const main = document.querySelector('main');
    if (main && main.children.length === 0) {
      main.innerHTML = this.handleRoute();
    }
  },

  // Append non-hero content (carousel, nav, iframe) below the inlined hero
  appendDynamicContent() {
    const main = document.querySelector('main');
    if (!main) return;
    const existing = document.getElementById('page-nav');
    if (existing) return; // already appended
    const html = renderDynamicSection();
    // Extract only the parts after the Hero section
    const temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) {
      main.appendChild(temp.firstChild);
    }
  }
};

// 监听hash变化
window.addEventListener('hashchange', () => app.render());

// 初始化应用
document.addEventListener('DOMContentLoaded', () => app.init());

// 导出供全局使用
window.app = app;

export default app;
