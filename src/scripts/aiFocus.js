(() => {
  window.AIFocus = {
    init({ openGuide }) {
      const overlay = document.getElementById('focus-overlay');
      const messages = document.getElementById('ai-messages');
      const input = document.getElementById('ai-input');
      function open() { overlay.classList.add('open'); input.focus(); }
      function close() { overlay.classList.remove('open'); document.getElementById('open-ai').focus(); }
      function addMessage(text, who = 'assistant') {
        const el = document.createElement('div'); el.className = `ai-message ${who}`; el.textContent = text;
        messages.append(el); messages.scrollTop = messages.scrollHeight;
      }
      function answerFor(question) {
        const closing = window.CLOSING_ANSWERS.find(entry => entry.match.test(question));
        if (closing) return { target:{category:'CLOSING SHIFT',product:closing.product}, answer:closing.answer };
        if (/時間割|スケジュール|シフト|何時|何時から|何時まで|営業|[0-9０-９]{1,2}(?::|時)/.test(question)) return { target:{category:'SCHEDULE',product:window.MENU_CATEGORIES.find(c=>c.en==='SCHEDULE').products[0]}, answer:`${window.SCHEDULE_DATA.title}を表示します。通常時間帯の詳細は当日のシフト表を確認してください。` };
        if (/トレー|トレイ|提供|配膳/.test(question)) return { target:{category:'TRAY GUIDE',product:window.MENU_CATEGORIES.find(c=>c.en==='TRAY GUIDE').products[0]}, answer:'提供方法・トレー配置ガイドを開きます。商品ごとの指定がある場合は店内の提供見本を優先してください。' };
        if (/賞味|期限|開封|消費期限|日持ち/.test(question)) return { target:{category:'SHELF LIFE',product:window.MENU_CATEGORIES.find(c=>c.en==='SHELF LIFE').products[0]}, answer:'賞味期限管理一覧を開きます。期限値は商品表示と店舗基準に従い、一覧の確認欄へ記録してください。' };
        if (/目盛|カップ/.test(question)) return { target:{category:'DRINKS',product:'カフェラテ'}, answer:window.MENU_RECIPES.productCaution };
        const query=question.replace(/[\s　]/g,'');
        for (const category of window.MENU_CATEGORIES) {
          const product=category.products.find(item=>query.includes(item.replace(/[\s　]/g,'')));
          if(product){const caution=category.en==='DRINKS'?` ${window.MENU_RECIPES.productCaution}`:'';return {target:{category:category.en,product},answer:`${category.title}の「${product}」を開きます。${caution}`};}
        }
        return { target:{category:'SCHEDULE',product:window.MENU_CATEGORIES.find(c=>c.en==='SCHEDULE').products[0]}, answer:'メニュー名、締め作業、時間、トレー、賞味期限について質問できます。該当するデータ画面を開きます。' };
      }
      function ask(question) {
        const q = question.trim(); if (!q) return;
        addMessage(q, 'user'); const result = answerFor(q);
        window.setTimeout(() => {
          addMessage(result.answer);
          const action = document.createElement('button'); action.className = 'ai-shortcut'; action.textContent = '該当ガイドを開く';
          action.addEventListener('click', () => { close(); openGuide(result.target); });
          const row = document.createElement('div'); row.className = 'ai-shortcuts'; row.append(action); messages.append(row); messages.scrollTop = messages.scrollHeight;
        }, 220);
      }
      document.getElementById('open-ai').addEventListener('click', open);
      document.getElementById('close-ai').addEventListener('click', close);
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
      document.querySelectorAll('.ai-shortcut[data-guide]').forEach(button => button.addEventListener('click', () => ask(button.dataset.guide)));
      document.getElementById('ai-form').addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; });
      return { open, close };
    }
  };
})();
