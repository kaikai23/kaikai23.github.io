(() => {
  'use strict';
  const root = document.getElementById('gradient-demo');
  if (!root) return;
  const slider = root.querySelector('#action-slider');
  const prediction = root.querySelector('#prediction-chart');
  const derivative = root.querySelector('#derivative-chart');
  const result = root.querySelector('#gradient-result');
  const stepResult = root.querySelector('#step-result');
  const SVG = 'http://www.w3.org/2000/svg';
  const initial = Math.PI / 200;
  let action = initial;
  const model = a => a + .01 * Math.sin(200 * a);
  const slope = a => 1 + 2 * Math.cos(200 * a);
  const signed = n => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(3);
  const direction = g => Math.abs(g) < 1e-8 ? '保持动作' : g < 0 ? '增大动作' : '减小动作';
  const add = (parent, tag, attrs, text) => {
    const el = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (text !== undefined) el.textContent = text;
    parent.appendChild(el);
    return el;
  };
  function chart(svg, isDerivative) {
    const width = Math.max(240, svg.getBoundingClientRect().width);
    const height = 225, left = 43, right = width - 12, top = 31, bottom = 184;
    const ymin = isDerivative ? -1.3 : -.013, ymax = isDerivative ? 3.3 : .113;
    const x = a => left + a / .1 * (right - left);
    const y = v => bottom - (v - ymin) / (ymax - ymin) * (bottom - top);
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('height', height);
    add(svg, 'title', {}, isDerivative ? '动作导数：真实值与模型值' : '下一状态：真实值与模型预测');
    add(svg, 'text', {x: left, y: 16}, isDerivative ? '动作导数 ds′/da（无量纲）' : '下一状态 s′（无量纲）');
    add(svg, 'rect', {x:left, y:top, width:right-left, height:bottom-top, fill:'none', stroke:'#ddddda'});
    const ticks = isDerivative ? [-1, 0, 1, 2, 3] : [0, .05, .1];
    ticks.forEach(t => {
      add(svg, 'line', {x1:left, x2:right, y1:y(t), y2:y(t), stroke:'#eeeeeb'});
      add(svg, 'text', {x:left-7, y:y(t)+4, 'text-anchor':'end'}, isDerivative ? t : t.toFixed(2));
    });
    [0, .03, .06, .1].forEach(t => add(svg, 'text', {x:x(t), y:bottom+18, 'text-anchor': t === 0 ? 'start' : t === .1 ? 'end' : 'middle'}, t.toFixed(2)));
    add(svg, 'text', {x:(left+right)/2, y:height-4, 'text-anchor':'middle'}, '动作 a（无量纲）');
    const trueFn = isDerivative ? () => 1 : a => a;
    const modelFn = isDerivative ? slope : model;
    [[trueFn, '#27607b', ''], [modelFn, '#a65721', '5 3']].forEach(([fn, color, dash]) => {
      let d = '';
      for (let i=0; i<=300; i++) {
        const a=i/3000;
        d += `${i?'L':'M'}${x(a).toFixed(2)},${y(fn(a)).toFixed(2)} `;
      }
      add(svg,'path',{d,fill:'none',stroke:color,'stroke-width':2,'stroke-dasharray':dash});
    });
    add(svg, 'line', {x1:x(action), x2:x(action), y1:top, y2:bottom, stroke:'#777', 'stroke-dasharray':'2 3'});
    add(svg, 'circle', {cx:x(action),cy:y(trueFn(action)),r:4,fill:'#27607b',stroke:'#fff','stroke-width':1});
    add(svg, 'rect', {x:x(action)-3.5,y:y(modelFn(action))-3.5,width:7,height:7,fill:'#fff',stroke:'#a65721','stroke-width':2});
  }
  function render() {
    root.querySelector('#action-value').textContent = action.toFixed(6);
    slider.value = action;
    const trueGradient = 2*(action-.1), modelGradient = 2*(model(action)-.1)*slope(action);
    result.replaceChildren();
    const line1 = document.createElement('div');
    line1.textContent = `预测误差 ${Math.abs(model(action)-action).toFixed(6)} · 真实斜率 ${signed(1)} · 模型斜率 ${signed(slope(action))}`;
    const line2 = document.createElement('div');
    line2.textContent = `真实损失梯度 ${signed(trueGradient)} → ${direction(trueGradient)}；模型损失梯度 ${signed(modelGradient)} → ${direction(modelGradient)}。`;
    result.append(line1,line2);
    chart(prediction,false); chart(derivative,true);
  }
  root.querySelector('.gradient-controls').hidden = false;
  root.querySelector('.gradient-charts').hidden = false;
  slider.addEventListener('input', () => { action=Number(slider.value); stepResult.textContent=''; render(); });
  root.querySelector('#reset-gradient').addEventListener('click', () => { action=initial; stepResult.textContent=''; render(); });
  root.querySelector('#step-gradient').addEventListener('click', () => {
    const before = (action-.1)**2;
    action = Math.min(.095, Math.max(.005, action - .01*2*(model(action)-.1)*slope(action)));
    const after = (action-.1)**2;
    stepResult.textContent = `真实损失：${before.toFixed(6)} → ${after.toFixed(6)}（${after > before ? '变差' : after < before ? '改善' : '未改变，已到滑块边界'}）。`;
    render();
  });
  new ResizeObserver(() => {chart(prediction,false);chart(derivative,true);}).observe(root);
  render();
})();
