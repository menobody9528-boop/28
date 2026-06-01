(function () {
  var currentUrl = new URL(window.location.href);
  var scriptElement = document.currentScript;
  if (!scriptElement) {
    var scripts = document.getElementsByTagName("script");
    for (var index = scripts.length - 1; index >= 0; index -= 1) {
      if ((scripts[index].src || "").indexOf("browser-guard.js") !== -1) {
        scriptElement = scripts[index];
        break;
      }
    }
  }

  var scriptUrl = scriptElement && scriptElement.src
    ? new URL(scriptElement.src, currentUrl.href)
    : new URL("./js/browser-guard.js", currentUrl.href);
  var siteBase = new URL("../", scriptUrl);
  var guardPageUrl = new URL("index.html", siteBase);
  var path = currentUrl.pathname || "/";
  var isGuardPage = path === guardPageUrl.pathname || path === "/" || path === "/index.html";
  var targetUrl = currentUrl.searchParams.get("target");
  var ua = (navigator.userAgent || "").toLowerCase();

  // 设备检测
  var isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  var isWeChat =
    ua.indexOf("micromessenger") !== -1 ||
    ua.indexOf("wechat") !== -1;
  var isQQInApp =
    ua.indexOf("qq/") !== -1 ||
    ua.indexOf("mqqbrowser") !== -1 ||
    ua.indexOf("v1_and_sq_") !== -1 ||
    ua.indexOf("v1_iph_sq_") !== -1;
  var isRestrictedWebView = isWeChat || isQQInApp;

  // 如果是404页面，不执行后续逻辑
  if (path === "/404.html") {
    return;
  }

  // 电脑端访问，直接跳转到404页面
  if (!isMobile) {
    var notFoundUrl = new URL("/404.html", currentUrl.origin);
    window.location.replace(notFoundUrl.toString());
    return;
  }

  // 移动端访问逻辑：
  // 1. 如果当前是 index.html (open-in-browser) 页面
  if (isGuardPage) {
    // 如果是微信/QQ内置浏览器，停留在当前页面（不跳转）
    if (isRestrictedWebView) {
      return;
    }
    // 如果是移动设备自带浏览器或其他浏览器，跳转到 home.html
    var homeUrl = targetUrl || new URL("home.html", currentUrl.origin).toString();
    window.location.replace(homeUrl);
    return;
  }

  // 2. 如果访问的是 home.html 页面
  if (path === "/home.html") {
    // 如果是微信/QQ内置浏览器，跳转到 index.html (open-in-browser)
    if (isRestrictedWebView) {
      var guardUrl = new URL(guardPageUrl.toString());
      guardUrl.searchParams.set("target", currentUrl.href);
      window.location.replace(guardUrl.toString());
      return;
    }
    // 移动设备自带浏览器或其他浏览器，正常访问
    return;
  }
})();
