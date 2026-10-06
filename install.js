(() => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.warn);
  if (matchMedia('(display-mode: standalone)').matches) return;
  let prompt;
  const bar=document.createElement('div');bar.className='install-bar';
  bar.innerHTML='<span>把待办小镇装到手机桌面，随时回到自己的小屋。</span><button class="outline">安装到手机</button>';
  document.querySelector('main').append(bar);
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e});
  bar.querySelector('button').onclick=async()=>{
    if(prompt){await prompt.prompt();const result=await prompt.userChoice;if(result.outcome==='accepted')bar.remove();prompt=null;return}
    modal('<h2>安装待办小镇</h2><p>用安卓手机的 Chrome 打开当前链接。<br>点击右上角 ⋮ →「安装应用」或「添加到主屏幕」。<br>安装完成后，就能从桌面打开小镇。</p><p>待办和家具保存在当前设备。换设备或清除浏览器数据不会自动同步。</p><button class="primary" id="installClose">知道了</button>');
    document.querySelector('#installClose').onclick=close;
  };
  window.addEventListener('appinstalled',()=>bar.remove());
})();
