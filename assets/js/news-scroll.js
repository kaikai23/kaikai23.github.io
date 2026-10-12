const newsScroll = document.querySelector('.news-scroll');

if (newsScroll) {
  const list = newsScroll.querySelector('.news-list');
  const updateHeight = () => {
    const visibleItems = Array.from(list.children).slice(0, 3);
    if (!visibleItems.length) return;

    // Wrapped headlines and web fonts can change the height of three entries.
    const height = visibleItems.reduce((sum, item) => sum + item.getBoundingClientRect().height, 0);
    newsScroll.style.setProperty('--news-height', `${Math.ceil(height)}px`);
  };

  updateHeight();
  new ResizeObserver(updateHeight).observe(list);
  document.fonts.ready.then(updateHeight);
}
