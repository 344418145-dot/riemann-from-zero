const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());});
async function visit(page,num){
 const menu=page.getByRole('button',{name:'打开课程目录',exact:true});
 if(await menu.isVisible())await menu.click();
 await page.getByRole('navigation',{name:'课程目录'}).getByRole('button',{name:new RegExp('^'+num+' ')}).click();
}
test('five new interactive lessons plus local progress',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#progressText')).toHaveText('0 / 9');
 await visit(page,'05');await expect(page.getByRole('heading',{name:'从 ln 2 到圆周上的旋转'})).toBeVisible();
 await page.getByRole('button',{name:'90°',exact:true}).click();await expect(page.locator('.extra-values')).toContainText('1.0000000');
 await page.getByRole('group',{name:'选择答案'}).getByRole('button',{name:'旋转角度'}).click();
 await expect(page.locator('#progressText')).toHaveText('1 / 9');
 await visit(page,'06');await page.getByRole('button',{name:'2 项',exact:true}).click();
 await expect(page.locator('.extra-visual .metric strong').first()).toHaveText('1.250000');
 await expect(page.locator('.extra-visual .metric strong').last()).toHaveText('0.750000');
 await page.getByRole('group',{name:'选择答案'}).getByRole('button',{name:'ζ(2)/4'}).click();
 await expect(page.locator('#progressText')).toHaveText('2 / 9');
 await visit(page,'07');await page.getByRole('button',{name:'已知零点附近'}).click();
 await expect(page.locator('.extra-values')).toContainText('14.134725');
 const exact=await page.evaluate(()=>Math.hypot(...window.RiemannExtra.zetaCritical(14.134725141734695)));
 expect(exact).toBeLessThan(1e-10);
 const near=await page.evaluate(()=>Math.hypot(...window.RiemannExtra.zetaCritical(14)));
 expect(near).toBeGreaterThan(.1);expect(near).toBeLessThan(.11);
 await page.getByRole('group',{name:'选择答案'}).getByRole('button',{name:'附近有已知的非平凡零点'}).click();
 await visit(page,'08');await page.getByRole('button',{name:'0.2 ↔ 0.8'}).click();
 await expect(page.locator('.extra-values')).toContainText('0.20 + 0.80 = 1');
 await page.getByRole('group',{name:'选择答案'}).getByRole('button',{name:'0.7'}).click();
 await visit(page,'09');await page.getByRole('button',{name:'10000',exact:true}).click();
 await expect(page.locator('.extra-visual .metric strong').first()).toHaveText('1229');
 expect(await page.evaluate(()=>window.RiemannExtra.primeCounts[1000])).toBe(168);
 await page.getByRole('button',{name:'欧拉乘积'}).click();
 await page.getByRole('slider',{name:'欧拉乘积的质数个数'}).press('End');
 const partial=Number(await page.locator('.extra-visual .metric strong').first().textContent());
 expect(partial).toBeGreaterThan(1.6);expect(partial).toBeLessThan(Math.PI*Math.PI/6);
 await page.getByRole('group',{name:'选择答案'}).getByRole('button',{name:'它们都是质数'}).click();
 await expect(page.locator('#progressText')).toHaveText('5 / 9');
 await page.reload();await expect(page.locator('#progressText')).toHaveText('5 / 9');expect(errors).toEqual([]);
 await testInfo.attach('new-course-preview',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
});
test('new chapters fit the desktop and mobile width',async({page})=>{
 await page.goto('/');
 for(const num of ['05','06','07','08','09']){
   await visit(page,num);
   const d=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
   expect(d.content,'chapter '+num+' overflow').toBeLessThanOrEqual(d.viewport);
 }
});
