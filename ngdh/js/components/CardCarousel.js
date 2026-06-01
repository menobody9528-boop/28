// 卡片轮播组件 - 简洁版
const MOBILE_MEDIA_QUERY = '(max-width: 640px)';
const CAROUSEL_STYLE_ID = 'carousel-styles';
const CAROUSEL_STYLE_TEXT = `
  .card-expand {
    transition: transform 0.3s ease, opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    border-color: var(--card-border-color, rgba(183, 109, 255, 0.5)) !important;
    box-shadow: var(--card-shadow, none) !important;
  }
  .card-expand:hover, .card-expand:active, .card-expand.hovered {
    transform: scale(1.15) !important;
    z-index: 10 !important;
    border-color: rgba(183, 109, 255, 1) !important;
    box-shadow: 0 0 25px rgba(183, 109, 255, 0.6) !important;
  }
  .card-expand > * { margin-top: 0 !important; }
  .card-expand .card-expand-img {
    width: 100% !important;
    height: calc(100% - var(--card-title-h) - 2px) !important;
    top: 0 !important;
    object-fit: cover !important;
    object-position: center 35% !important;
    margin: 0 !important;
    display: block !important;
  }
  @media (max-width: 640px) {
    .card-expand,
    .card-expand:hover,
    .card-expand:active,
    .card-expand.hovered {
      transform: var(--card-transform, translateY(0) scale(1)) !important;
      opacity: var(--card-opacity, 1) !important;
      z-index: var(--card-z, 1) !important;
      border-color: var(--card-border-color, rgba(183, 109, 255, 0.5)) !important;
      box-shadow: var(--card-shadow, none) !important;
    }
    .card-expand .card-expand-img {
      width: 100% !important;
      height: calc(100% - var(--card-title-h) - 1px) !important;
      top: 0 !important;
      left: 0 !important;
      object-fit: contain !important;
      object-position: center top !important;
    }
  }
  .card-expand-title { margin-top: auto !important; font-size: 16px !important; font-weight: 600 !important; }
  .card-expand-info { font-size: 12px !important; }
  .is-dragging .card-expand,
  .is-dragging .card-expand:hover,
  .is-dragging .card-expand:active,
  .is-dragging .card-expand.hovered {
    transition: none !important;
  }
`;

let activeCarouselCleanup = null;

export function initCarousel() {
  if (typeof activeCarouselCleanup === 'function') {
    activeCarouselCleanup();
    activeCarouselCleanup = null;
  }

  const container = document.querySelector('.card-expand-container');
  if (!container) return;

  if (typeof container.__carouselCleanup === 'function') {
    container.__carouselCleanup();
  }

  const track = container.querySelector('.card-3d-5');
  if (!track) return;

  const cards = track.querySelectorAll('.card-expand');
  if (cards.length === 0) return;

  // 克隆卡片实现无限滚动
  cards.forEach(card => track.appendChild(card.cloneNode(true)));
  cards.forEach(card => track.appendChild(card.cloneNode(true)));

  const allCards = track.querySelectorAll('.card-expand');
  const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  let cardWidth = 0;
  let scrollWidth = 0;

  const updateTrackMetrics = () => {
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
    cardWidth = allCards[0].offsetWidth + gap;
    scrollWidth = cardWidth * cards.length;
    track.style.width = `${cardWidth * allCards.length}px`;
  };

  updateTrackMetrics();

  // 用JS实现自动滚动 + 双向拖动
  let position = 0;
  let speed = mobileMediaQuery.matches ? 1.1 : 1.5;
  let isDragging = false;
  let lastX = 0;
  let animationId = null;
  let destroyed = false;

  const normalizePosition = () => {
    while (position <= -scrollWidth) position += scrollWidth;
    while (position > 0) position -= scrollWidth;
  };

  const updateCardVisuals = () => {
    if (!mobileMediaQuery.matches) {
      allCards.forEach(card => {
        card.style.removeProperty('--card-transform');
        card.style.removeProperty('--card-opacity');
        card.style.removeProperty('--card-z');
        card.style.removeProperty('--card-border-color');
        card.style.removeProperty('--card-shadow');
      });
      return;
    }

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    allCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.min(Math.abs(centerX - (cardRect.left + cardRect.width / 2)), rect.width);
      const ratio = 1 - distance / rect.width;
      const glowStrength = Math.max(0, (ratio - 0.55) / 0.45);
      card.style.setProperty('--card-transform', `translateY(${Math.round(ratio * -12)}px) scale(${(0.8 + ratio * 0.28).toFixed(3)})`);
      card.style.setProperty('--card-opacity', (0.55 + ratio * 0.45).toFixed(3));
      card.style.setProperty('--card-z', `${Math.round(1 + ratio * 9)}`);
      card.style.setProperty('--card-border-color', `rgba(183, 109, 255, ${(0.5 + glowStrength * 0.5).toFixed(3)})`);
      card.style.setProperty('--card-shadow', glowStrength > 0
        ? `0 0 ${Math.round(10 + glowStrength * 18)}px rgba(183, 109, 255, ${(glowStrength * 0.6).toFixed(3)})`
        : 'none');
    });
  };

  const render = () => {
    if (destroyed) return;
    const prevPosition = position;
    normalizePosition();
    const wasNormalized = position !== prevPosition;
    track.style.transform = `translateX(${position}px)`;
    if (wasNormalized) {
      allCards.forEach(card => card.style.setProperty('transition', 'none', 'important'));
    }
    updateCardVisuals();
    if (wasNormalized) {
      void track.offsetHeight;
      requestAnimationFrame(() => {
        allCards.forEach(card => card.style.removeProperty('transition'));
      });
    }
  };
  const handleResize = () => {
    speed = mobileMediaQuery.matches ? 1.1 : 1.5;
    updateTrackMetrics();
    render();
  };

  window.addEventListener('resize', handleResize);

  const move = () => {
    if (destroyed) return;
    if (!isDragging) {
      position -= speed;
      render();
    }
    animationId = requestAnimationFrame(move);
  };
  render();
  move();

  // 鼠标拖拽
  const handleMouseDown = e => {
    isDragging = true;
    lastX = e.clientX;
    container.style.cursor = 'grabbing';
    container.classList.add('is-dragging');
  };
  container.addEventListener('mousedown', handleMouseDown);

  const handleMouseMove = e => {
    if (!isDragging) return;
    const delta = e.clientX - lastX;
    position += delta;
    lastX = e.clientX;
    render();
  };
  container.addEventListener('mousemove', handleMouseMove);

  const stopDragging = () => {
    isDragging = false;
    container.style.cursor = 'grab';
    container.classList.remove('is-dragging');
  };
  container.addEventListener('mouseup', stopDragging);

  container.addEventListener('mouseleave', stopDragging);

  // 触摸拖拽
  const handleTouchStart = e => {
    isDragging = true;
    lastX = e.touches[0].clientX;
    container.classList.add('is-dragging');
  };
  container.addEventListener('touchstart', handleTouchStart, { passive: true });

  const handleTouchMove = e => {
    if (!isDragging || !e.touches.length) return;
    const delta = e.touches[0].clientX - lastX;
    position += delta;
    lastX = e.touches[0].clientX;
    render();
  };
  container.addEventListener('touchmove', handleTouchMove, { passive: true });

  container.addEventListener('touchend', stopDragging);
  container.addEventListener('touchcancel', stopDragging);

  container.style.cursor = 'grab';

  // 悬停放大效果 - 纯CSS :hover + :active 覆盖一切
  let style = document.getElementById(CAROUSEL_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = CAROUSEL_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== CAROUSEL_STYLE_TEXT) {
    style.textContent = CAROUSEL_STYLE_TEXT;
  }
  
  // 鼠标悬停事件
  const hoverCleanups = [];
  allCards.forEach(card => {
    const handleMouseEnter = () => card.classList.add('hovered');
    const handleMouseLeave = () => card.classList.remove('hovered');
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    hoverCleanups.push(() => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    });
  });

  const openUrl = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const handleClick = (e) => {
    let target = e.target;
    while (target && target !== container) {
      if (target.matches('.card-expand')) {
        const url = target.dataset.url;
        if (url) openUrl(url);
        return;
      }
      target = target.parentElement;
    }
  };
  container.addEventListener('click', handleClick);

  container.__carouselCleanup = () => {
    destroyed = true;
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    container.removeEventListener('mousedown', handleMouseDown);
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseup', stopDragging);
    container.removeEventListener('mouseleave', stopDragging);
    container.removeEventListener('touchstart', handleTouchStart, { passive: true });
    container.removeEventListener('touchmove', handleTouchMove, { passive: true });
    container.removeEventListener('touchend', stopDragging);
    container.removeEventListener('touchcancel', stopDragging);
    container.removeEventListener('click', handleClick);
    hoverCleanups.forEach(cleanup => cleanup());
    delete container.__carouselCleanup;
  };

  activeCarouselCleanup = container.__carouselCleanup;
}
