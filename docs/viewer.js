(function() {
  // Animação de entrada suave
  document.body.classList.add('fade-enter');
  requestAnimationFrame(function(){
    document.body.classList.add('fade-enter-active');
    document.body.classList.remove('fade-enter');
  });

  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const defaultFile = 'network-monitoring.md';
  const file = getQueryParam('file') || defaultFile;
  const title = getQueryParam('title') || 'Documentação';

  document.getElementById('doc-title').textContent = decodeURIComponent(title);
  // Prepara a lista lateral por projeto

  // Removido botão de voltar da topbar; navegação fica pelo botão "Voltar ao Portfólio"

  // ESC para voltar
  document.addEventListener('keydown', function(ev){
    if (ev.key === 'Escape') {
      // Se sidebar aberta no mobile, fecha primeiro
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        return;
      }
      // Sem ação adicional; ESC apenas fecha a sidebar quando aberta
    }
  });

  function exitAndGo(navigateFn){
    document.body.classList.add('fade-exit');
    requestAnimationFrame(function(){
      document.body.classList.add('fade-exit-active');
      setTimeout(navigateFn, 220);
    });
  }

  // Lista específica por projeto; pode ser estendida com mais arquivos por projeto
  const docsList = [
    { file: file, title: decodeURIComponent(title) }
  ];

  const listEl = document.getElementById('docs-list');
  docsList.forEach(function(doc) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = 'viewer.html?file=' + encodeURIComponent(doc.file) + '&title=' + encodeURIComponent(doc.title);
    a.textContent = doc.title;
    if (doc.file === file) a.className = 'active';
    li.appendChild(a);
    listEl.appendChild(li);
  });

  function renderMarkdown(md) {
    const lines = md.split('\n');
    let html = '';
    let inCode = false;
    let inList = false;
    let inOrderedList = false;
    let codeLanguage = '';
    
    function formatInline(text) {
      return text
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/~~([^~]+)~~/g, '<del>$1</del>');
    }
    
    function closeLists() {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (inOrderedList) {
        html += '</ol>';
        inOrderedList = false;
      }
    }
    
    lines.forEach(function(line, index) {
      const trimmed = line.trim();
      
      // Code blocks
      if (trimmed.startsWith('```')) {
        if (inCode) {
          html += '</code></pre>';
          inCode = false;
          codeLanguage = '';
        } else {
          codeLanguage = trimmed.slice(3).trim();
          html += '<pre><code' + (codeLanguage ? ' class="language-' + codeLanguage + '"' : '') + '>';
          inCode = true;
        }
        return;
      }
      
      if (inCode) {
        html += line.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
        return;
      }
      
      // Headers
      if (trimmed.startsWith('# ')) {
        closeLists();
        const t = trimmed.slice(2).trim();
        html += '<h1 id="' + slugify(t) + '">' + formatInline(t) + '</h1>';
        return;
      }
      
      if (trimmed.startsWith('## ')) {
        closeLists();
        const t = trimmed.slice(3).trim();
        html += '<h2 id="' + slugify(t) + '">' + formatInline(t) + '</h2>';
        return;
      }
      
      if (trimmed.startsWith('### ')) {
        closeLists();
        const t = trimmed.slice(4).trim();
        html += '<h3 id="' + slugify(t) + '">' + formatInline(t) + '</h3>';
        return;
      }
      
      if (trimmed.startsWith('#### ')) {
        closeLists();
        const t = trimmed.slice(5).trim();
        html += '<h4 id="' + slugify(t) + '">' + formatInline(t) + '</h4>';
        return;
      }
      
      // Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          closeLists();
          html += '<ul>';
          inList = true;
        }
        html += '<li>' + formatInline(trimmed.slice(2)) + '</li>';
        return;
      }
      
      if (/^\d+\.\s/.test(trimmed)) {
        if (!inOrderedList) {
          closeLists();
          html += '<ol>';
          inOrderedList = true;
        }
        const content = trimmed.replace(/^\d+\.\s/, '');
        html += '<li>' + formatInline(content) + '</li>';
        return;
      }
      
      // Blockquotes
      if (trimmed.startsWith('> ')) {
        closeLists();
        const content = trimmed.slice(2);
        html += '<blockquote>' + formatInline(content) + '</blockquote>';
        return;
      }
      
      // Horizontal rules
      if (trimmed === '---' || trimmed === '***') {
        closeLists();
        html += '<hr>';
        return;
      }
      
      // Empty lines
      if (trimmed === '') {
        closeLists();
        return;
      }
      
      // Regular paragraphs
      closeLists();
      html += '<p>' + formatInline(line) + '</p>';
    });
    
    closeLists();
    return html;
  }

  function slugify(text){
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return 'section-' + text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  function loadFile(path) {
    fetch(path).then(function(res) { return res.text(); }).then(function(text) {
      const html = renderMarkdown(text);
      const viewer = document.getElementById('viewer');
      viewer.innerHTML = html;
      buildToc(viewer);
      setupSearch(); // Initialize search after content is loaded
    }).catch(function(err) {
      document.getElementById('viewer').innerHTML = '<p>Erro ao carregar documento.</p>';
      console.error(err);
    });
  }

  function buildToc(root){
    const toc = document.getElementById('toc-list');
    toc.innerHTML = '';
    const headings = root.querySelectorAll('h2, h3, h4');
    headings.forEach(function(h){
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'd-block ' + (h.tagName === 'H3' ? 'level-3' : h.tagName === 'H4' ? 'level-4' : '');
      a.addEventListener('click', function(e){
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80; // offset para topbar
        window.scrollTo({ top: y, behavior: 'smooth' });
        // close sidebar on mobile for better UX
        if (window.innerWidth < 992) {
          sidebar.classList.remove('open');
          sidebarOverlay.classList.remove('show');
        }
      });
      const li = document.createElement('li');
      li.appendChild(a);
      toc.appendChild(li);
    });

    // Scrollspy: destaca seção ativa
    const linkMap = Array.from(toc.querySelectorAll('a')).map(a => ({
      id: a.getAttribute('href').slice(1),
      el: a
    }));
    function onScroll(){
      const scrollPos = window.pageYOffset + 100; // margem para topo
      let activeId = null;
      for (const {id} of linkMap) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPos) activeId = id;
      }
      linkMap.forEach(({id, el}) => {
        if (id === activeId) el.classList.add('active'); else el.classList.remove('active');
      });
    }
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Search functionality
  function setupSearch() {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;
    
    searchBox.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const tocLinks = document.querySelectorAll('#toc-list a');
      
      tocLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const parent = link.parentElement;
        
        if (query === '' || text.includes(query)) {
          parent.style.display = 'block';
          if (query !== '') {
            // Highlight search term
            const regex = new RegExp(`(${query})`, 'gi');
            link.innerHTML = link.textContent.replace(regex, '<mark style="background: #6ea8fe; color: #000; padding: 1px 2px; border-radius: 2px;">$1</mark>');
          } else {
            link.innerHTML = link.textContent;
          }
        } else {
          parent.style.display = 'none';
        }
      });
    });
  }

  loadFile('content/' + file);

  // -----------------
  // Sidebar controls
  // -----------------
  var sidebar = document.getElementById('sidebar');
  var toggleSidebarBtn = document.getElementById('toggleSidebar');
  var collapseSidebarBtn = document.getElementById('collapseSidebar');
  var closeSidebarBtn = document.getElementById('closeSidebar');
  var sidebarOverlay = document.getElementById('sidebar-overlay');

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function(){
      if (window.innerWidth >= 992) {
        // No desktop, se estiver recolhida, expande; caso contrário, recolhe
        const collapsed = sidebar.classList.toggle('collapsed');
        // Se acabou de recolher, não precisa setar aria-expanded; mas manter feedback simples
        this.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      } else {
        var isOpen = sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show', isOpen);
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  }

  if (collapseSidebarBtn) {
    collapseSidebarBtn.addEventListener('click', function(){
      // Desktop: alterna classe 'collapsed'; Mobile: alterna 'open'
      if (window.innerWidth >= 992) {
        sidebar.classList.toggle('collapsed');
      } else {
        const isOpen = sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show', isOpen);
      }
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function(){
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function(){
      sidebar.classList.remove('open');
      this.classList.remove('show');
    });
  }

  // Fecha a sidebar mobile ao clicar em um item
  document.getElementById('docs-list').addEventListener('click', function(e){
    if (e.target && e.target.tagName === 'A' && window.innerWidth < 992) {
      sidebar.classList.remove('open');
    }
  });
})();
