/* From Zero to Riemann — static, offline-capable teaching prototype.
 * Math content note: The Dirichlet series for zeta is only used here for s > 1.
 */
(() => {
  'use strict';
  const STORAGE_KEY = 'riemann-course-mvp-progress-v1';
  const lessons = [
    {id:'machine', num:'01', chapter:'第一章 · 函数与无穷求和', title:'函数是一台计算机器', tag:'从最基础开始', intro:'输入一个数字，按照同一条规则计算输出。先不碰复杂公式，亲手操作就好。'},
    {id:'zeta', num:'02', chapter:'第一章 · 函数与无穷求和', title:'ζ(2) 为什么越来越接近 1.645？', tag:'认识泽塔函数', intro:'试着增加求和项数，观察一个看似无穷的加法，如何逐渐接近确定的数字。'},
    {id:'rotate', num:'03', chapter:'第二章 · 复数与旋转', title:'为什么乘以 i 会旋转 90°？', tag:'认识虚数 i', intro:'从数字 1 开始，每按一次「乘以 i」，看看箭头发生什么变化。'},
    {id:'plane', num:'04', chapter:'第二章 · 复数与旋转', title:'复数为什么像二维坐标？', tag:'认识复平面', intro:'自己修改实部和虚部，看一个复数如何在平面上找到它的位置。'}
  ].concat(window.RiemannExtra?.lessons || []);
  const upcoming = [];
  const main = document.getElementById('main');
  const nav = document.getElementById('lessonNav');
  const topLesson = document.getElementById('topLesson');
  const sidebar = document.getElementById('sidebar');
  let done = loadProgress();
  let current = 'home';
  let state = {input:4, termCount:10, turnCount:0, real:3, imag:2};
  function loadProgress(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return new Set(Array.isArray(v)?v.filter(x=>lessons.some(l=>l.id===x)):[]);}catch{return new Set();}}
  function saveProgress(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...done]));}catch{/* file URI / private browser may disallow storage */}}
  function renderNav(){
    let groups=[...new Set(lessons.map(l=>l.chapter))].map(title=>[title,lessons.filter(l=>l.chapter===title)]);
    nav.innerHTML=`<div class="nav-group"><button class="nav-item ${current==='home'?'active':''}" data-nav="home"><span class="nav-index">⌂</span><span class="nav-title">课程总览</span></button></div>`+
      groups.map(([title,items])=>`<div class="nav-group"><div class="nav-group-title">${title}</div>${items.map(l=>`<button class="nav-item ${current===l.id?'active':''}" data-nav="${l.id}" ${current===l.id?'aria-current="page"':''}><span class="nav-index">${l.num}</span><span class="nav-title">${l.title}</span>${done.has(l.id)?'<span class="nav-complete" aria-label="已完成">✓</span>':''}</button>`).join('')}</div>`).join('')+
      `<div class="nav-group"><div class="nav-group-title">后续课程 · 规划中</div>${upcoming.map(([num,title])=>`<div class="nav-item locked"><span class="nav-index">${num}</span><span class="nav-title">${title}</span><span class="nav-lock">🔒</span></div>`).join('')}</div>`;
  }
  function renderProgress(){document.getElementById('progressText').textContent=`${done.size} / ${lessons.length}`;document.getElementById('progressFill').style.width=`${done.size/lessons.length*100}%`;}
  function goTo(id){
    current=id;
    sidebar.classList.remove('open');document.getElementById('menuButton').setAttribute('aria-expanded','false');
    topLesson.textContent=id==='home'?'课程总览':(lessons.find(l=>l.id===id)?.title||'课程');
    renderNav();renderProgress();
    if(id==='home')renderHome();else renderLesson(id);
    window.scrollTo(0,0);
  }
  function renderHome(){
    main.innerHTML=`<section class="home-hero"><div class="eyebrow">从零开始 · 不背结论</div><h1>亲手操作，<br/>直到真正理解数学。</h1><p>这不是让你记住「黎曼猜想的实部是 1/2」的速成教程。我们从最简单的函数出发，通过一步一问、操作实验和验证，慢慢走到那个伟大的问题。</p><button class="primary-btn" data-nav="${lessons.find(l=>!done.has(l.id))?.id||'machine'}">${done.size?'继续学习 →':'开始第一节 →'}</button></section>
    <h2 class="roadmap-title">已开放的课程实验 <span style="font-weight:400;color:#8a97ad;font-size:13px">· ${done.size}/${lessons.length} 完成</span></h2>
    <div class="roadmap-grid">${lessons.map(l=>`<div class="roadmap-item"><span class="roadmap-number">${l.num}</span><div style="flex:1"><h3>${l.title}</h3><p>${l.intro}</p><button class="mini-pill" data-nav="${l.id}" style="margin-top:12px">${done.has(l.id)?'再体验一次':'进入实验'} →</button></div><span class="claim-pill">${done.has(l.id)?'已完成':'可体验'}</span></div>`).join('')}</div>
    <p class="footer-link" style="margin-top:24px">教学原则：先例子，再观察，再推导；严格区分比喻、数学定理与尚未证明的猜想。</p>`;
  }
  function studyPart(id){
    if(window.RiemannExtra?.has(id)) return window.RiemannExtra.study(id);
    if(id==='machine')return `<div class="card-kicker">01 / 数学积木</div><h2 class="study-title">函数，其实是一条规则</h2><p>设想一台小机器，它只做一件事：<strong>把输入乘以 2，再加上 1。</strong></p><div class="formula-box">f(x) = 2x + 1</div><div class="step"><span class="step-num">1</span><div>输入 <strong>2</strong>：2 × 2 + 1 = <strong>5</strong></div></div><div class="step"><span class="step-num">2</span><div>输入 <strong>3</strong>：3 × 2 + 1 = <strong>7</strong></div></div><div class="step"><span class="step-num">3</span><div>规则始终不变，<strong>x</strong> 只代表正在输入的数。</div></div><div class="note">想起 ζ(s) 了吗？ζ 是机器的名字，s 是输入的数字。我们先用最简单的 f(x) 练手。</div>`;
    if(id==='zeta')return `<div class="card-kicker">02 / 无穷求和</div><h2 class="study-title">这次换一台机器：ζ</h2><p>当输入是 <strong>2</strong> 时，泽塔函数要求我们把下面这些分数不断加起来。</p><div class="formula-box" style="font-size:21px">ζ(2) = 1 + ¼ + ⅑ + ¹⁄₁₆ + …</div><div class="step"><span class="step-num">1</span><div>只加 <strong>1</strong> 项，总和是 1。</div></div><div class="step"><span class="step-num">2</span><div>加 <strong>2</strong> 项，总和是 1 + 1/4 = 1.25。</div></div><div class="step"><span class="step-num">3</span><div>不断增加项数，结果越来越靠近 <strong>1.644934…</strong>。</div></div><div class="note">这叫收敛。提醒：原始无穷加法并不能处理任意输入；这里的 ζ(2) 是适用的。</div>`;
    if(id==='rotate')return `<div class="card-kicker">03 / 数学新方向</div><h2 class="study-title">试试一个特殊的数字 i</h2><p>数学家定义 <strong>i × i = −1</strong>。在复平面上，我们可以把乘以 i 看作逆时针旋转 90°。</p><div class="formula-box">i × i = −1</div><div class="step"><span class="step-num">1</span><div>从 <strong>1</strong> 出发，箭头指向右边。</div></div><div class="step"><span class="step-num">2</span><div>乘一次 i，变成 <strong>i</strong>：指向上方。</div></div><div class="step"><span class="step-num">3</span><div>再乘一次 i，变成 <strong>−1</strong>：指向左边。</div></div><div class="note">关键点：i 不是一个纯粹的方向箭头，它是可以按乘法规则运算的复数。</div>`;
    return `<div class="card-kicker">04 / 复数地图</div><h2 class="study-title">给数字增加第二个方向</h2><p>普通的实数只有左右一条数轴。复数 <strong>a + bi</strong> 多了一个上下方向。</p><div class="formula-box">z = a + bi</div><div class="step"><span class="step-num">1</span><div><strong>a</strong> 代表横坐标（实部），向右为正。</div></div><div class="step"><span class="step-num">2</span><div><strong>b</strong> 代表纵坐标（虚部的系数），向上为正。</div></div><div class="step"><span class="step-num">3</span><div>例如 <strong>3 + 2i</strong>，就是向右走 3 格、向上走 2 格。</div></div><div class="note">以后遇到 0.5 + 14.13i，就可以把它看成同样的二维坐标，而不是神秘代码。</div>`;
  }
  const quizzes=Object.assign({
    machine:{q:'按 f(x) = 2x + 1，输入 4 会输出多少？',opts:[8,9,10],answer:'9',explain:'4 × 2 + 1 = 9。你已经理解函数的输入和输出。'},
    zeta:{q:'ζ(2) 只加前两项，结果是多少？',opts:['1.25','1.50','1.645'],answer:'1.25',explain:'第一项 1，加第二项 1/4，得到 1.25；它还不是无穷和。'},
    rotate:{q:'从 1 出发，连续乘以 i 两次会得到什么？',opts:['i','−1','−i'],answer:'−1',explain:'1 → i → −1，旋转了两个 90°，总共 180°。'},
    plane:{q:'复数 3 + 2i 对应哪个坐标？',opts:['(2, 3)','(3, 2)','(3, −2)'],answer:'(3, 2)',explain:'实部 3 是横坐标，虚部系数 2 是纵坐标。'}
  },window.RiemannExtra?.quizzes||{});
  function renderLesson(id){
    const l=lessons.find(x=>x.id===id), q=quizzes[id], idx=lessons.findIndex(x=>x.id===id);
    main.innerHTML=`<div class="eyebrow">${l.tag} · 第 ${idx+1} / ${lessons.length} 节</div><h1 class="page-title">${l.title}</h1><p class="page-desc">${l.intro}</p><div class="workbench"><section class="study-card" aria-label="课程讲解">${studyPart(id)}</section><section class="lab-card" aria-label="可交互实验"><div class="lab-header"><div><div class="card-kicker">INTERACTIVE LAB</div><h2 class="lab-title">亲手试一试</h2></div><span class="live-pill">实时反馈</span></div><p class="lab-intro">${labIntro(id)}</p><div class="lab-body" id="labBody"></div><p class="lab-caption">${labCaption(id)}</p></section></div>
    <section class="quiz-card" aria-label="理解检查"><div><div class="card-kicker">CHECK YOUR UNDERSTANDING</div><h2 class="quiz-title">用一个小问题检验理解</h2><div class="quiz-desc">${q.q}</div></div><div><div class="quiz-options" role="group" aria-label="选择答案">${q.opts.map(a=>`<button class="quiz-option" type="button" data-quiz="${String(a)}">${a}</button>`).join('')}</div><div class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite">${done.has(id)?'✓ 这节课已完成；也可以再做一次。':'选一个答案，答对后将自动记录学习进度。'}</div></div></section>
    <div class="bottom-nav"><span class="footer-link">每一小步都可反复练习</span><div class="bottom-actions"><button class="ghost-btn" data-nav="${idx===0?'home':lessons[idx-1].id}">← ${idx===0?'课程总览':'上一节'}</button><button class="primary-btn" data-nav="${idx===lessons.length-1?'home':lessons[idx+1].id}">${idx===lessons.length-1?'课程总览':'下一节 →'}</button></div></div>`;
    renderLab();
  }
  function labIntro(id){return ({machine:'拖动输入数字，观察同一规则如何产生不同结果。',zeta:'改变累计项数 n，看部分和怎样靠近极限。',rotate:'点击按钮，让箭头真正旋转起来。',plane:'自己修改 a 和 b：把抽象的数字变成一个可见坐标。'})[id] || window.RiemannExtra?.labIntro(id);}
  function labCaption(id){return ({machine:'本实验使用 f(x) = 2x + 1。ζ(s) 的运算会更复杂，但“输入 → 规则 → 输出”完全相同。',zeta:'图中的极限值是数学上已知的 ζ(2)=π²/6。滑块最多只加到 200 项，不能用有限项代替真正的无穷和。',rotate:'旋转 90° 是乘以 i 的精确几何效果，不只是动画效果。',plane:'复数坐标轴上的两个方向互相垂直；复数还具有独特的乘法运算。'})[id] || window.RiemannExtra?.labCaption(id);}
  function zetaPartial(k,n){let v=0;for(let j=1;j<=n;j++)v+=Math.pow(j,-k);return v;}
  function zetaTarget(k){return ({2:1.6449340668482264,3:1.2020569031595943,4:1.0823232337111382,5:1.03692775514337})[k];}
  function fmtNum(n){return Number(n).toFixed(6);}
  function planeSVG(mode,a,b,drawUnitCircle){
    const cx=175,cy=139,scale=25;
    const ex=cx+scale*a,ey=cy-scale*b;
    const grid=[];for(let i=-5;i<=5;i++){let p=cx+i*scale,q=cy+i*scale;grid.push(`<path d="M${p} 9 V269 M40 ${q} H310" class="plane-grid"/>`);}
    let angle=Math.atan2(b,a);let radius=Math.hypot(a,b);let arrowX=ex-11*Math.cos(angle-.45),arrowY=ey+11*Math.sin(angle-.45),arrowX2=ex-11*Math.cos(angle+.45),arrowY2=ey+11*Math.sin(angle+.45);
    return `<svg class="plane-svg" viewBox="0 0 350 293" role="img" aria-label="复平面坐标图，点 ${a}${b<0?' − ':' + '}${Math.abs(b)}i"><g>${grid.join('')}</g><path d="M35 ${cy}H323 M${cx} 8 V278" class="plane-axis"/>${drawUnitCircle?`<circle cx="${cx}" cy="${cy}" r="${scale}" class="plane-circle"/>`:''}<path d="M${cx} ${cy} L${ex} ${ey}" class="plane-vector"/><path d="M${arrowX} ${arrowY}L${ex} ${ey}L${arrowX2} ${arrowY2}" class="plane-vector" fill="none"/><line x1="${ex}" y1="${ey}" x2="${ex}" y2="${cy}" stroke="#7fa4f4" stroke-dasharray="4 4"/><line x1="${ex}" y1="${ey}" x2="${cx}" y2="${ey}" stroke="#7fa4f4" stroke-dasharray="4 4"/><circle cx="${ex}" cy="${ey}" r="6" class="plane-point"/><text class="axis-label" x="326" y="132">Re</text><text class="axis-label" x="185" y="17">Im</text><text class="axis-label" x="163" y="153">0</text><text class="axis-label" x="196" y="151">1</text><text class="axis-label" x="163" y="113">i</text><text x="${Math.max(15,Math.min(289,ex+9))}" y="${Math.max(17,ey-11)}" font-size="13" font-weight="700" fill="#3d65c5">${mode==='rotate'?["1","i","−1","−i"][((state.turnCount%4)+4)%4]:`${a}${b<0?' − ':' + '}${Math.abs(b)}i`}</text></svg>`;
  }
  function renderLab(){
    const lab=document.getElementById('labBody');if(!lab)return;
    if(window.RiemannExtra?.has(current)){window.RiemannExtra.renderLab(current,lab);return;}
    if(current==='machine'){
      const x=state.input, y=x*2+1;
      lab.innerHTML=`<div class="control-label"><span>输入数字 x</span><strong id="inputValue">${x}</strong></div><input aria-label="函数输入值" class="range" type="range" id="machineInput" min="0" max="12" step="1" value="${x}"/><div class="value-pills">${[0,2,4,8,12].map(v=>`<button class="mini-pill ${v===x?'selected':''}" data-input="${v}">${v}</button>`).join('')}</div><div class="machine-flow"><div class="machine-box"><span>输入</span><strong>${x}</strong></div><div class="flow-arrow">→</div><div class="machine-core"><span>函数机器</span><strong>× 2 + 1</strong></div><div class="flow-arrow">→</div><div class="machine-box"><span>输出</span><strong>${y}</strong></div></div><div class="math-result">计算过程：<strong>${x} × 2 + 1 = ${y}</strong></div>`;
      lab.querySelector('#machineInput').oninput=e=>{
        state.input=Number(e.target.value);
        const v=state.input;
        lab.querySelector('.control-label strong').textContent=String(v);
        const ends=lab.querySelectorAll('.machine-box strong');ends[0].textContent=String(v);ends[1].textContent=String(v*2+1);
        lab.querySelector('.math-result strong').textContent=`${v} × 2 + 1 = ${v*2+1}`;
        lab.querySelectorAll('[data-input]').forEach(btn=>btn.classList.toggle('selected',Number(btn.dataset.input)===v));
      };
      lab.querySelectorAll('[data-input]').forEach(b=>b.onclick=()=>{state.input=Number(b.dataset.input);renderLab();});
    }else if(current==='zeta'){
      const n=state.termCount, s=2, v=zetaPartial(s,n), limit=zetaTarget(s);
      const points=[];for(let x=1;x<=n;x+=Math.max(1,Math.ceil(n/95))){let yy=zetaPartial(s,x);points.push(`${36+280*(x-1)/Math.max(1,n-1)},${171-136*(yy-1)/(zetaTarget(2)-1)}`);}if(n>1){const yy=zetaPartial(s,n);points.push(`${316},${171-136*(yy-1)/(zetaTarget(2)-1)}`);}
      lab.innerHTML=`<div class="control-label"><span>累加前 n 项</span><strong>${n} 项</strong></div><input aria-label="ζ(2) 累加项数" class="range" type="range" id="termInput" min="1" max="200" step="1" value="${n}"/><div class="value-pills">${[1,2,5,10,50,200].map(v=>`<button class="mini-pill ${v===n?'selected':''}" data-count="${v}">${v} 项</button>`).join('')}</div><div class="metric-grid"><div class="metric"><span>当前部分和</span><strong>${fmtNum(v)}</strong></div><div class="metric"><span>真实极限 ζ(2)</span><strong>${fmtNum(limit)}</strong></div></div><div class="bar-label">与极限的距离 · 还差 ${Math.abs(limit-v).toFixed(6)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,v/limit*100))}%"></div></div><div class="legend"><span>从零开始累加</span><span>极限 = 1.644934…</span></div><div class="plot-frame"><svg class="plane-svg" viewBox="0 0 350 196" aria-label="求和项数增加时部分和逐渐接近极限的折线图"><path d="M36 20 V171 H327" stroke="#a4b4d5" fill="none" stroke-width="1.5"/><path d="M36 35 H316" stroke="#daa455" stroke-dasharray="5 5" stroke-width="2"/><text x="39" y="28" fill="#a58d5a" font-size="11">极限 1.644934…</text><polyline points="${points.join(' ')}" fill="none" stroke="#547de7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="39" y="189" fill="#8293b5" font-size="11">第 1 项</text><text x="273" y="189" fill="#8293b5" font-size="11">第 ${n} 项</text></svg></div>`;
      lab.querySelector('#termInput').oninput=e=>{
        state.termCount=Number(e.target.value);
        const count=state.termCount, sum=zetaPartial(2,count), target=zetaTarget(2);
        lab.querySelector('.control-label strong').textContent=`${count} 项`;
        const numbers=lab.querySelectorAll('.metric strong');numbers[0].textContent=fmtNum(sum);numbers[1].textContent=fmtNum(target);
        lab.querySelector('.bar-label').textContent=`与极限的距离 · 还差 ${Math.abs(target-sum).toFixed(6)}`;
        lab.querySelector('.bar-fill').style.width=`${Math.max(0,Math.min(100,sum/target*100))}%`;
        lab.querySelectorAll('[data-count]').forEach(btn=>btn.classList.toggle('selected',Number(btn.dataset.count)===count));
        const plot=[];for(let x=1;x<=count;x+=Math.max(1,Math.ceil(count/95))){plot.push(`${36+280*(x-1)/Math.max(1,count-1)},${171-136*(zetaPartial(2,x)-1)/(zetaTarget(2)-1)}`);}
        if(count>1)plot.push(`316,${171-136*(sum-1)/(zetaTarget(2)-1)}`);
        lab.querySelector('polyline').setAttribute('points',plot.join(' '));
        lab.querySelector('.plot-frame svg text:last-of-type').textContent=`第 ${count} 项`;
      };
      lab.querySelectorAll('[data-count]').forEach(b=>b.onclick=()=>{state.termCount=Number(b.dataset.count);renderLab();});
    }else if(current==='rotate'){
      const k=((state.turnCount%4)+4)%4, vals=[[1,0,'1'],[0,1,'i'],[-1,0,'−1'],[0,-1,'−i']];
      const [a,b,label]=vals[k];
      lab.innerHTML=`<div class="plot-frame">${planeSVG('rotate',a,b,true)}</div><div class="metric-grid"><div class="metric"><span>当前复数</span><strong>${label}</strong></div><div class="metric"><span>旋转角度（累计）</span><strong>${state.turnCount*90}°</strong></div></div><div class="turn-notes">${['1 · 向右','i · 向上','−1 · 向左','−i · 向下'].map((v,i)=>`<span class="turn-note ${i===k?'focus':''}">${v}</span>`).join('')}</div><div class="lab-actions"><button class="primary-btn" id="multiplyI">× i · 再旋转 90° ↶</button><button class="ghost-btn" id="resetI">回到 1</button></div>`;
      lab.querySelector('#multiplyI').onclick=()=>{state.turnCount++;renderLab();};
      lab.querySelector('#resetI').onclick=()=>{state.turnCount=0;renderLab();};
    }else{
      const a=state.real,b=state.imag,formatted=`${a}${b<0?' − ':' + '}${Math.abs(b)}i`;
      lab.innerHTML=`<div class="plot-frame">${planeSVG('plane',a,b,false)}</div><div class="control-label"><span>实部 a · 左右</span><strong>${a}</strong></div><input class="range" id="realInput" type="range" aria-label="实部 a" min="-4" max="4" step="1" value="${a}"/><div class="control-label"><span>虚部系数 b · 上下</span><strong>${b}</strong></div><input class="range" id="imagInput" type="range" aria-label="虚部系数 b" min="-4" max="4" step="1" value="${b}"/><div class="math-result">复数 <strong>${formatted}</strong> → 坐标 <strong>(${a}, ${b})</strong></div>`;
      const refreshPlane=()=>{
        lab.querySelector('.plot-frame').innerHTML=planeSVG('plane',state.real,state.imag,false);
        const labels=lab.querySelectorAll('.control-label strong');labels[0].textContent=String(state.real);labels[1].textContent=String(state.imag);
        const sign=state.imag<0?' − ':' + ';
        lab.querySelector('.math-result').innerHTML=`复数 <strong>${state.real}${sign}${Math.abs(state.imag)}i</strong> → 坐标 <strong>(${state.real}, ${state.imag})</strong>`;
      };
      lab.querySelector('#realInput').oninput=e=>{state.real=Number(e.target.value);refreshPlane();};
      lab.querySelector('#imagInput').oninput=e=>{state.imag=Number(e.target.value);refreshPlane();};
    }
  }
  document.addEventListener('click',event=>{
    const to=event.target.closest('[data-nav]');if(to){goTo(to.dataset.nav);return;}
    const b=event.target.closest('[data-quiz]');if(!b)return;
    const chosen=b.dataset.quiz, q=quizzes[current];if(!q)return;
    const ok=chosen===q.answer;
    document.querySelectorAll('.quiz-option').forEach(opt=>{opt.classList.remove('correct','incorrect');if(ok&&opt.dataset.quiz===q.answer)opt.classList.add('correct');});
    if(!ok)b.classList.add('incorrect');
    document.getElementById('quizFeedback').textContent=ok?`✓ 正确！${q.explain}`:'还差一点。可以回到上面的实验亲手试一下，再选一次。';
    if(ok){done.add(current);saveProgress();renderNav();renderProgress();}
  });
  document.getElementById('resetProgress').addEventListener('click',()=>{if(confirm('确定清空全部课程的学习记录吗？')){done.clear();saveProgress();goTo('home');}});
  document.getElementById('menuButton').addEventListener('click',()=>{const isOpen=sidebar.classList.toggle('open');document.getElementById('menuButton').setAttribute('aria-expanded',String(isOpen));});
  goTo('home');
})();
