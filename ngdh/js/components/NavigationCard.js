// 导航卡片相关工具
// 生成在线人数
export function getRandomOnline() {
  const min = 5678;
  const max = 1000000;
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
