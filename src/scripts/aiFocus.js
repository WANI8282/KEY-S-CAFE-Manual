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
        return window.CLOSING_ANSWERS.find(entry => entry.match.test(question)) || {
          product: '20:30〜 機器電源OFF',
          answer: '締め作業ガイドを確認してください。カルーセルの「締め作業」からレジ・清掃・電源OFF・ソフトマシン洗浄を選べます。'
        };
      }
      function ask(question) {
        const q = question.trim(); if (!q) return;
        addMessage(q, 'user'); const result = answerFor(q);
        window.setTimeout(() => {
          addMessage(result.answer);
          const action = document.createElement('button'); action.className = 'ai-shortcut'; action.textContent = '該当ガイドを開く';
          action.addEventListener('click', () => { close(); openGuide(result.product); });
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
