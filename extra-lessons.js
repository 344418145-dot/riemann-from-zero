(function installLessonsV02() {
  'use strict';
  const ZERO = 14.134725141734695;
  const lessons = [
    {id:'euler',num:'05',chapter:'第三章 · 指数与欧拉公式',title:'从 ln 2 到圆周上的旋转',tag:'欧拉公式',intro:'从普通乘方、自然对数出发，自己改变角度，观察 e 的虚数次方。'},
    {id:'eta',num:'06',chapter:'第四章 · 交错级数与延拓',title:'Eta 公式从哪里来？',tag:'不跳步的推导',intro:'从 ζ(2) 的偶数项出发，验证加减交替的 Eta 公式到底如何出现。'},
    {id:'zero',num:'07',chapter:'第五章 · 寻找零点',title:'第一个非平凡零点怎么找到？',tag:'数值零点实验',intro:'沿着实部 0.5 这条直线移动，亲眼观察 ζ(0.5+ti) 怎样接近 0。'},
    {id:'symmetry',num:'08',chapter:'第六章 · 黎曼猜想',title:'为什么偏偏是 0.5？',tag:'对称性与猜想',intro:'用镜像实验区分“已证明的对称性”和“尚未证明的全部在中线”。'},
    {id:'prime',num:'09',chapter:'第七章 · 质数分布',title:'零点为什么与质数有关？',tag:'从欧拉到高斯',intro:'计算质数数量与对数预测，并用欧拉乘积搭起 ζ 与质数之间的桥梁。'}
  ];
  const quizzes = {
    euler:{q:'在 e^(iθ)=cosθ+i sinθ 中，θ 主要控制什么？',opts:['旋转角度','圆的半径','质数数量'],answer:'旋转角度',explain:'纯虚指数让结果留在单位圆上，θ 是旋转的弧度。'},
    eta:{q:'ζ(2) 的偶数项之和等于多少？',opts:['ζ(2)/4','ζ(2)/2','2ζ(2)'],answer:'ζ(2)/4',explain:'分母 2²、4²、6²……可提取 1/4，括号内正是 ζ(2)。'},
    zero:{q:'数值计算得到 |ζ(0.5+14.134725i)| 很小，说明什么？',opts:['所有零点都在0.5','附近有已知的非平凡零点','无穷和一定等于0'],answer:'附近有已知的非平凡零点',explain:'它是第一个已知非平凡零点的近似位置；数值接近0不是证明全部零点的办法。'},
    symmetry:{q:'如果假设有一个零点实部为 0.3，镜像零点的实部为多少？',opts:['0.3','0.5','0.7'],answer:'0.7',explain:'镜像实部是 1−0.3=0.7。但“成对对称”不等于“全部在中心”。'},
    prime:{q:'欧拉乘积中为什么会出现 2、3、5、7……？',opts:['它们都是偶数','它们都是质数','它们都是零点'],answer:'它们都是质数',explain:'欧拉乘积把 ζ(s) 与所有质数连接起来，在实部大于1时成立。'}
  };
  const studies = {
    euler:`<div class="card-kicker">05 / 从乘方走向旋转</div><h2 class="study-title">先解释公式为什么出现</h2><p>还记得 <strong>ln 2</strong> 吗？它回答的是“e 的多少次方等于 2”。因此 <strong>2 = e<sup>ln 2</sup></strong>。</p><div class="step"><span class="step-num">1</span><div>把 2 换成 e<sup>ln 2</sup>：<strong>2<sup>i</sup> = e<sup>i ln 2</sup></strong>。</div></div><div class="step"><span class="step-num">2</span><div>连续进行越来越微小的复数乘法，可以得到纯旋转。由复指数的极限定义，<strong>e<sup>iθ</sup></strong> 是单位圆上旋转 θ 弧度的位置。</div></div><div class="step"><span class="step-num">3</span><div>单位圆横坐标是 <strong>cos θ</strong>、纵坐标是 <strong>sin θ</strong>，所以 <strong>e<sup>iθ</sup> = cos θ + i sin θ</strong>。</div></div><div class="note">这是一条已证明的欧拉公式。θ 必须使用弧度；下方滑块使用角度制，程序会自动转换。</div>`,
    eta:`<div class="card-kicker">06 / 从旧公式推导新公式</div><h2 class="study-title">旧的 ζ(2) 完全没有白学</h2><div class="formula-box">ζ(2) = 1 + 1/4 + 1/9 + 1/16 + …</div><div class="step"><span class="step-num">1</span><div>只抽出偶数分母的项：1/4 + 1/16 + 1/36 + … = <strong>ζ(2)/4</strong>。</div></div><div class="step"><span class="step-num">2</span><div>从原式减去<strong>两倍偶数项</strong>，正号就变成负号：η(2) = 1 − 1/4 + 1/9 − …</div></div><div class="step"><span class="step-num">3</span><div>所以 η(2) = ζ(2) − 2·ζ(2)/4 = ζ(2)/2。一般形式为 <strong>ζ(s) = η(s) / (1−2<sup>1−s</sup>)</strong>。</div></div><div class="note">本实验计算 s=2 的有限部分和。有限项不必满足 ζ(2)=2η(2)；这是无限求和极限下的严格关系。交错级数还可以用于实部大于0的更多输入（s=1 须单独排除）。</div>`,
    zero:`<div class="card-kicker">07 / 第一次寻找非平凡零点</div><h2 class="study-title">我们是在寻找“输入后输出0”的坐标</h2><p>现在输入是复数 <strong>s = 0.5 + ti</strong>。t 是你可以调整的高度。</p><div class="step"><span class="step-num">1</span><div>我们知道第一个非平凡零点靠近 <strong>t = 14.134725…</strong>，不是单独输入 0.5 就能得到 0。</div></div><div class="step"><span class="step-num">2</span><div>用已经学习过的 Eta 公式计算 ζ：先算<strong>交错级数</strong>，再除以 <strong>1−2<sup>1−s</sup></strong>。</div></div><div class="step"><span class="step-num">3</span><div>由于直接加前几项很慢，实验采用经过<strong>欧拉加速</strong>的 Eta 求和。观察实部和虚部同时趋近0。</div></div><div class="note">这里采用约75层收敛加速的数值算法，并在 13.5≤t≤14.8 的范围内演示。屏幕显示“≈0”并不等于严格证明零点；已知零点位置来自独立的数学研究。</div>`,
    symmetry:`<div class="card-kicker">08 / 为什么中心是 1/2？</div><h2 class="study-title">对称是定理，全部在中间是猜想</h2><div class="step"><span class="step-num">1</span><div>泽塔函数的<strong>函数方程</strong>把 ζ(s) 和 ζ(1−s) 联系起来；配合复数共轭，非平凡零点会关于实部 1/2 的直线成对出现。</div></div><div class="step"><span class="step-num">2</span><div>例如：<strong>假设</strong>某零点的实部为 0.3，便会对应一个实部 0.7 的零点。两者相加等于1。</div></div><div class="step"><span class="step-num">3</span><div>黎曼猜想再前进一步：<strong>会不会所有非平凡零点，本来就全部落在中线实部 1/2 上？</strong></div></div><div class="note">图中的离线圆点完全是说明对称性的假设点，不代表真的发现了实部为0.3或0.7的零点。函数方程不等于 ζ(s)=ζ(1−s)。</div>`,
    prime:`<div class="card-kicker">09 / 从质数走向黎曼猜想</div><h2 class="study-title">为什么研究 ζ 会帮助研究质数？</h2><div class="step"><span class="step-num">1</span><div>高斯发现：在较大数字 n 附近，质数出现的平均密度大约是 <strong>1/ln n</strong>。这里描述的是平均规律，不是每隔固定个数就必然有一个。</div></div><div class="step"><span class="step-num">2</span><div>欧拉证明：<strong>ζ(2) = ∏<sub>p是质数</sub> (1−1/p²)<sup>−1</sup></strong>。它把泽塔函数与每一个质数连在一起。</div></div><div class="step"><span class="step-num">3</span><div>黎曼研究非平凡零点，进一步揭示质数计数对近似公式的偏差。黎曼猜想若成立，会带来对误差大小的强约束。</div></div><div class="note">下方可以在“质数数量”和“欧拉乘积”两个实验之间切换。对数积分 li(x) 比 x/ln(x) 通常更准确，但两者都只是估计，不是精确计数。</div>`
  };
  const states={degree:45,etaTerms:20,t:14.13,sigma:0.3,primeN:1000,primeView:'density',productCount:4};
  const labIntros={
    euler:'拖动角度：单位圆上的点始终满足“横坐标是 cos，纵坐标是 sin”。也可以看看 2 的 i 次方。',
    eta:'改变求和项数，比较 ζ(2) 与交错的 η(2) 是怎样接近各自极限的。',
    zero:'让 t 逐渐靠近 14.134725…，观察 ζ(0.5+ti) 的实部、虚部和距离原点的长度。',
    symmetry:'移动左侧假设点，右侧的镜像点会自动移动；它们不代表真实发现的零点。',
    prime:'两种实验分别展示质数数量的整体规律，以及欧拉乘积如何连接 ζ(2) 与质数。'
  };
  const labCaptions={
    euler:'欧拉公式中 θ 的单位是弧度。滑块用度数显示，程序会乘以 π/180 转换。',
    eta:'ζ(2) 与 2η(2) 的精确相等发生在无限求和极限；本页只计算有限部分和。',
    zero:'本实验的 ζ(s) 使用 Eta 级数的欧拉变换数值计算，不是把原始 ζ 的发散级数生硬相加；数值误差不能当作数学证明。',
    symmetry:'已证明：非平凡零点以 1/2 为中心具有对称性。未证明：所有非平凡零点都在 1/2 上。',
    prime:'数值计数只到 10,000；欧拉乘积仅对实部大于 1 的 ζ(s) 直接使用。'
  };
  const pi = Math.PI;
  const fmt = n => (Math.abs(n)<0.00000005 ? '0.0000000' : n.toFixed(7));
  const svgFrame = children => `<div class="plot-frame extra-plot"><svg viewBox="0 0 350 240" role="img" aria-label="可交互数学图">${children}</svg></div>`;
  const line=(x1,y1,x2,y2,stroke='#9baacc',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  function zetaCritical(t) {
    const N=75,sigma=0.5;
    let a=Array.from({length:N+1},(_,k)=>{const log=Math.log(k+1),mag=Math.exp(-sigma*log),ang=t*log;return [mag*Math.cos(ang),-mag*Math.sin(ang)];});
    let re=0,im=0;
    for(let n=0;n<=N;n++){
      const k=Math.pow(2,-n-1);
      re+=k*a[0][0];im+=k*a[0][1];
      const next=[];
      for(let j=0;j<a.length-1;j++) next.push([a[j][0]-a[j+1][0],a[j][1]-a[j+1][1]]);
      a=next;
    }
    const factor=Math.pow(2,1-sigma),angle=t*Math.LN2;
    const dr=1-factor*Math.cos(angle),di=factor*Math.sin(angle);
    const d=dr*dr+di*di;
    return [(re*dr+im*di)/d,(im*dr-re*di)/d];
  }
  const primeCap=10000, primeCounts=Array(primeCap+1).fill(0), primes=[];
  const isPrime=Array(primeCap+1).fill(true);
  isPrime[0]=false;isPrime[1]=false;
  for(let p=2;p*p<=primeCap;p++)if(isPrime[p])for(let j=p*p;j<=primeCap;j+=p)isPrime[j]=false;
  for(let i=1;i<=primeCap;i++){primeCounts[i]=primeCounts[i-1]+(isPrime[i]?1:0);if(isPrime[i])primes.push(i);}
  function li(x){
    const n=1200,h=(x-2)/n,func=t=>1/Math.log(t);
    let sum=func(2)+func(x);
    for(let k=1;k<n;k++)sum+=(k%2?4:2)*func(2+k*h);
    return 1.04516378011749 + h*sum/3;
  }
  function showEuler(root){
    const theta=states.degree*pi/180,x=Math.cos(theta),y=Math.sin(theta),cx=172,cy=126,r=88,ex=cx+r*x,ey=cy-r*y;
    const graphic=svgFrame(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#b9c9ed" stroke-width="2"/>${line(40,cy,305,cy)}${line(cx,20,cx,230)}${line(cx,cy,ex,ey,'#537dec')}${line(ex,ey,ex,cy,'#2b9c83','4 4')}<circle cx="${ex}" cy="${ey}" r="6" fill="#527de6"/><text x="283" y="116" fill="#687d9c" font-size="12">Re</text><text x="182" y="18" fill="#687d9c" font-size="12">Im</text><text x="${Math.min(260,Math.max(12,ex+8))}" y="${Math.max(18,ey-10)}" fill="#4064bb" font-size="12">(${x.toFixed(3)}, ${y.toFixed(3)})</text>`);
    root.querySelector('.extra-visual').innerHTML=graphic;
    root.querySelector('.extra-values').innerHTML=`<div class="metric-grid"><div class="metric"><span>横坐标 cos θ</span><strong>${fmt(x)}</strong></div><div class="metric"><span>纵坐标 sin θ</span><strong>${fmt(y)}</strong></div></div><div class="math-result">旋转 <strong>${states.degree.toFixed(3)}°</strong> = <strong>${(states.degree*pi/180).toFixed(6)} 弧度</strong><br>e<sup>iθ</sup> ≈ ${x.toFixed(4)} ${y<0?'−':'+'} ${Math.abs(y).toFixed(4)}i</div>`;
    root.querySelector('.extra-val').textContent=`${states.degree.toFixed(3)}°`;
  }
  function showEta(root){
    let z=0,e=0;
    for(let i=1;i<=states.etaTerms;i++){const v=1/(i*i);z+=v;e+=(i%2?1:-1)*v;}
    const target=pi*pi/6;
    root.querySelector('.extra-val').textContent=`${states.etaTerms} 项`;
    root.querySelector('.extra-visual').innerHTML=`<div class="metric-grid"><div class="metric"><span>ζ(2) 的前 n 项</span><strong>${z.toFixed(6)}</strong></div><div class="metric"><span>η(2) 的前 n 项</span><strong>${e.toFixed(6)}</strong></div></div><div class="extra-bars"><div>ζ 的部分和</div><div class="extra-track"><span style="width:${Math.min(100,100*z/target)}%"></span></div><div>2 × η 的部分和</div><div class="extra-track alt"><span style="width:${Math.min(100,100*(2*e)/target)}%"></span></div></div>`;
    root.querySelector('.extra-values').innerHTML=`<div class="math-result">当 n=${states.etaTerms}：<strong>2ηₙ(2) ≈ ${(2*e).toFixed(6)}</strong>。<br>真正的无限和：<strong>ζ(2) = 2η(2) ≈ ${target.toFixed(6)}</strong>。</div>`;
  }
  function showZero(root){
    const t=states.t,val=zetaCritical(t),mag=Math.hypot(...val),pts=[];
    for(let k=0;k<=60;k++){
      const ti=13.5+k*1.3/60;
      const m=Math.hypot(...zetaCritical(ti));
      const py=202- Math.min(160,m/0.6*150);
      pts.push(`${28+k*290/60},${py.toFixed(2)}`);
    }
    const ux=28+(t-13.5)*290/1.3,uy=202-Math.min(160,mag/0.6*150);
    root.querySelector('.extra-visual').innerHTML=svgFrame(`${line(28,202,318,202)}${line(28,24,28,202)}<polyline points="${pts.join(' ')}" fill="none" stroke="#5b80eb" stroke-width="2.5"/>${line(ux,25,ux,202,'#db9d4e','4 4')}<circle cx="${ux}" cy="${uy}" r="5" fill="#db9d4e"/><text x="24" y="222" font-size="11" fill="#7584a5">13.5</text><text x="276" y="222" font-size="11" fill="#7584a5">14.8</text><text x="36" y="22" font-size="12" fill="#7584a5">|ζ(0.5+ti)|</text>`);
    root.querySelector('.extra-val').textContent=t.toFixed(9);
    root.querySelector('.extra-values').innerHTML=`<div class="metric-grid"><div class="metric"><span>ζ 的实部（近似）</span><strong>${fmt(val[0])}</strong></div><div class="metric"><span>ζ 的虚部（近似）</span><strong>${fmt(val[1])}i</strong></div></div><div class="math-result">当前 <strong>s = 0.5 + ${t.toFixed(9)}i</strong><br>到 0 的距离 |ζ(s)| ≈ <strong>${mag.toExponential(5)}</strong>${Math.abs(t-ZERO)<1e-9?'<br>这里使用的是已知零点的小数近似。':''}</div>`;
  }
  function showSymmetry(root){
    const x=states.sigma,y=1-x,coord=a=>48+254*a;
    root.querySelector('.extra-val').textContent=x.toFixed(2);
    root.querySelector('.extra-visual').innerHTML=svgFrame(`${line(48,190,302,190)}${line(coord(0.5),25,coord(0.5),199,'#517cdb','5 5')}${line(coord(x),105,coord(y),105,'#cc9550','4 4')}<circle cx="${coord(x)}" cy="105" r="6" fill="#d69a50"/><circle cx="${coord(y)}" cy="105" r="6" fill="#d69a50"/><text x="${coord(x)}" y="92" text-anchor="middle" font-size="13" fill="#a67640">${x.toFixed(2)}</text><text x="${coord(y)}" y="92" text-anchor="middle" font-size="13" fill="#a67640">${y.toFixed(2)}</text><text x="48" y="208" font-size="12" fill="#7584a5">0</text><text x="175" y="208" text-anchor="middle" font-size="13" fill="#4b71c8">0.5</text><text x="302" y="208" text-anchor="end" font-size="12" fill="#7584a5">1</text><text x="175" y="22" text-anchor="middle" font-size="12" fill="#4b71c8">对称中心</text>`);
    root.querySelector('.extra-values').innerHTML=`<div class="math-result"><strong>${x.toFixed(2)} + ${y.toFixed(2)} = 1</strong>；中点 = <strong>0.5</strong>。<br>这是<strong>假设位置</strong>，不是两个已找到的零点。对称性是定理，“全在中线”仍是猜想。</div>`;
  }
  function showPrime(root){
    if(states.primeView==='density'){
      const n=states.primeN,real=primeCounts[n],simple=n/Math.log(n),approx=li(n),max=Math.max(real,approx,simple)*1.07;
      root.querySelector('.extra-visual').innerHTML=`<div class="metric-grid"><div class="metric"><span>实际质数 π(${n})</span><strong>${real}</strong></div><div class="metric"><span>高斯对数积分预测 li(${n})</span><strong>${approx.toFixed(2)}</strong></div></div><div class="extra-bars"><div>实际 ${real}</div><div class="extra-track"><span style="width:${100*real/max}%"></span></div><div>对数积分 ${approx.toFixed(1)}</div><div class="extra-track alt"><span style="width:${100*approx/max}%"></span></div></div>`;
      root.querySelector('.extra-values').innerHTML=`<div class="math-result">更简单的估计：<strong>n/ln n ≈ ${simple.toFixed(1)}</strong>。<br>对数积分与真实数量相差约 <strong>${Math.abs(approx-real).toFixed(1)}</strong> 个。这是预测误差，不是泽塔零点的个数。</div>`;
    }else{
      let v=1;
      const factors=[];
      for(let i=0;i<states.productCount;i++){const p=primes[i];v*=1/(1-1/(p*p));factors.push(`${p}`);}
      root.querySelector('.extra-visual').innerHTML=`<div class="metric-grid"><div class="metric"><span>前 ${states.productCount} 个质数乘积</span><strong>${v.toFixed(7)}</strong></div><div class="metric"><span>ζ(2) 的值</span><strong>${(pi*pi/6).toFixed(7)}</strong></div></div><div class="extra-bars"><div>有限欧拉乘积</div><div class="extra-track"><span style="width:${100*v/(pi*pi/6)}%"></span></div></div>`;
      root.querySelector('.extra-values').innerHTML=`<div class="math-result">当前包含质数：<strong>${factors.join('、')}</strong>。<br>计算的是 ∏<sub>p</sub> 1/(1−1/p²)，乘入更多质数会逼近 ζ(2)。有限乘积不等于无限乘积。</div>`;
    }
  }
  function renderLab(id, root){
    if(id==='euler'){
      root.innerHTML=`<div class="control-label"><span>旋转角度 θ</span><strong class="extra-val"></strong></div><input class="range" type="range" aria-label="欧拉公式旋转角度" min="0" max="360" step="1" value="${Math.round(states.degree)}"/><div class="value-pills"><button class="mini-pill" data-angle="0">0°</button><button class="mini-pill" data-angle="90">90°</button><button class="mini-pill" data-angle="180">180°</button><button class="mini-pill" data-angle="360">360°</button><button class="mini-pill" data-angle="pow2">2ⁱ 的角度</button></div><div class="extra-visual"></div><div class="extra-values"></div>`;
      const slider=root.querySelector('input');slider.oninput=e=>{states.degree=Number(e.target.value);showEuler(root);};
      root.querySelectorAll('[data-angle]').forEach(b=>b.onclick=()=>{states.degree=b.dataset.angle==='pow2'?Math.LN2*180/pi:Number(b.dataset.angle);slider.value=Math.round(states.degree);showEuler(root);});showEuler(root);
    }else if(id==='eta'){
      root.innerHTML=`<div class="control-label"><span>累计项数 n</span><strong class="extra-val"></strong></div><input class="range" type="range" aria-label="Eta 函数项数" min="2" max="120" step="2" value="${states.etaTerms}"/><div class="value-pills">${[2,10,40,120].map(n=>`<button class="mini-pill" data-eta="${n}">${n} 项</button>`).join('')}</div><div class="extra-visual"></div><div class="extra-values"></div>`;
      const slider=root.querySelector('input');slider.oninput=e=>{states.etaTerms=Number(e.target.value);showEta(root);};
      root.querySelectorAll('[data-eta]').forEach(b=>b.onclick=()=>{states.etaTerms=Number(b.dataset.eta);slider.value=states.etaTerms;showEta(root);});showEta(root);
    }else if(id==='zero'){
      root.innerHTML=`<div class="control-label"><span>复数的虚部系数 t</span><strong class="extra-val"></strong></div><input class="range" type="range" aria-label="寻找非平凡零点的高度" min="13.5" max="14.8" step="0.001" value="${states.t}"/><div class="value-pills"><button class="mini-pill" data-zero="14">14</button><button class="mini-pill" data-zero="14.13">14.13</button><button class="mini-pill" data-zero="14.134725141734695">已知零点附近</button></div><div class="extra-visual"></div><div class="extra-values"></div>`;
      const slider=root.querySelector('input');slider.oninput=e=>{states.t=Number(e.target.value);showZero(root);};root.querySelectorAll('[data-zero]').forEach(b=>b.onclick=()=>{states.t=Number(b.dataset.zero);slider.value=states.t;showZero(root);});showZero(root);
    }else if(id==='symmetry'){
      root.innerHTML=`<div class="control-label"><span>假设零点的实部 σ</span><strong class="extra-val"></strong></div><input class="range" type="range" aria-label="假设零点的实部" min="0.1" max="0.5" step="0.05" value="${states.sigma}"/><div class="value-pills"><button class="mini-pill" data-sigma="0.2">0.2 ↔ 0.8</button><button class="mini-pill" data-sigma="0.3">0.3 ↔ 0.7</button><button class="mini-pill" data-sigma="0.5">0.5 ↔ 0.5</button></div><div class="extra-visual"></div><div class="extra-values"></div>`;
      const slider=root.querySelector('input');slider.oninput=e=>{states.sigma=Number(e.target.value);showSymmetry(root);};root.querySelectorAll('[data-sigma]').forEach(b=>b.onclick=()=>{states.sigma=Number(b.dataset.sigma);slider.value=states.sigma;showSymmetry(root);});showSymmetry(root);
    }else if(id==='prime'){
      root.innerHTML=`<div class="value-pills"><button class="mini-pill ${states.primeView==='density'?'selected':''}" data-prime-view="density">质数数量</button><button class="mini-pill ${states.primeView==='product'?'selected':''}" data-prime-view="product">欧拉乘积</button></div><div id="primeControl"></div><div class="extra-visual"></div><div class="extra-values"></div>`;
      const control=root.querySelector('#primeControl');
      const update=()=>{
        if(states.primeView==='density'){
          control.innerHTML=`<div class="control-label"><span>统计到整数 n</span><strong class="extra-val">${states.primeN}</strong></div><input class="range" aria-label="质数统计上限" type="range" min="100" max="10000" step="100" value="${states.primeN}"/><div class="value-pills">${[100,1000,5000,10000].map(n=>`<button class="mini-pill" data-prime-n="${n}">${n}</button>`).join('')}</div>`;
          control.querySelector('input').oninput=e=>{states.primeN=Number(e.target.value);control.querySelector('.extra-val').textContent=states.primeN;showPrime(root);};
          control.querySelectorAll('[data-prime-n]').forEach(b=>b.onclick=()=>{states.primeN=Number(b.dataset.primeN);update();});
        }else{
          control.innerHTML=`<div class="control-label"><span>参与乘积的质数数量</span><strong class="extra-val">${states.productCount}</strong></div><input class="range" type="range" aria-label="欧拉乘积的质数个数" min="1" max="11" step="1" value="${states.productCount}"/>`;
          control.querySelector('input').oninput=e=>{states.productCount=Number(e.target.value);control.querySelector('.extra-val').textContent=states.productCount;showPrime(root);};
        }
        showPrime(root);
      };
      root.querySelectorAll('[data-prime-view]').forEach(b=>b.onclick=()=>{states.primeView=b.dataset.primeView;root.querySelectorAll('[data-prime-view]').forEach(x=>x.classList.toggle('selected',x===b));update();});update();
    }
  }
  window.RiemannExtra={lessons,quizzes,has:id=>lessons.some(x=>x.id===id),study:id=>studies[id],labIntro:id=>labIntros[id],labCaption:id=>labCaptions[id],renderLab,zetaCritical,primeCounts};
})();
