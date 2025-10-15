
(function($) {
  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

})(jQuery); // End of use strict

function animateProgressBar(barId, textId, targetPercentage, color = 'royalblue') {
  const progressBar = document.getElementById(barId);
  const progressText = document.getElementById(textId);
  if (!progressBar || !progressText) return;

  // Evita re-animar se já foi animado
  if (progressBar.getAttribute('data-animated') === 'true') return;
  progressBar.setAttribute('data-animated', 'true');

  let progress = 0;

  function updateProgress() {
    if (progress <= targetPercentage) {
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.round(progress)}%`;
      if (progress <= 35) {
        const percentage = progress / 35; // Gradiente suave no início
        const r = Math.floor(255 - (255 - 255) * percentage);
        const g = Math.floor(0 + (165 - 0) * percentage);
        const b = Math.floor(0); // Ajustado para um azul mais escuro
        progressBar.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      } else if (progress <= 100) {
        progressBar.style.backgroundColor = color;
      }

      progress++;
      setTimeout(updateProgress, 20);
    }
  }
  updateProgress();
}

document.addEventListener('DOMContentLoaded', function() {
  const welcomeScreen = document.getElementById("welcome-screen");
  if (welcomeScreen) {
    setTimeout(function () {
      // Fade out the welcome screen
      welcomeScreen.style.opacity = '0';
      
      // After fade out, remove it and show main content
      welcomeScreen.addEventListener('transitionend', function() {
        welcomeScreen.remove();
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.style.opacity = '1';
        }

        // Initialize animations after main content is visible
        // SKILLS Counter
        $('.counter').counterUp({
          delay: 10,
          time: 2000
        });

        // Animate ALL progress bars when they scroll into view
        $('.progress-bar').each(function() {
          var $this = $(this);
          var bar = $this[0];
          var text = $this.find('span')[0];
          
          // Waypoint needs a DOM element, not a jQuery object
          var waypointElement = $this.closest('.award, .cert-card')[0];

          if (bar && text && waypointElement) {
            new Waypoint({
              element: waypointElement,
              handler: function() {
                animateProgressBar(bar.id, text.id, $(bar).attr('aria-valuenow'), $(bar).data('color'));
                this.destroy(); // Anima apenas uma vez
              },
              offset: '90%'
            });
          }
        });

      }, { once: true });

    }, 1500); // 1.5 seconds delay before starting fade out
  }
  
  // Garante que a página inteira (incluindo imagens) carregou antes de rolar.
  // Se houver seção salva (vinda do viewer), rola para ela; senão, foca em About.
  $(window).on('load', function() {
    const savedSection = localStorage.getItem('lastPortfolioSection');
    if (savedSection) {
      const $target = $("#" + savedSection);
      const targetTop = $target.length ? ($target.offset().top - 70) : 0;
      setTimeout(function() {
        $('html, body').animate({ scrollTop: targetTop }, 800, 'easeInOutExpo');
        localStorage.removeItem('lastPortfolioSection');
      }, 200);
    } else {
      setTimeout(function() {
        $('html, body').animate({ scrollTop: $("#about").offset().top }, 800, "easeInOutExpo");
      }, 200);
    }
  });

  // Initialize AOS (Animate on Scroll) after the welcome screen logic
  AOS.init({
    duration: 800, // Duração da animação em ms
    once: true // Animação acontece apenas uma vez
  });

  // Re-initializing jQuery dependent animations here
  $(document).ready(function() {
    // Project Filter and "See More" functionality
    const projectsList = $('#projects-list');
    const seeMoreBtn = $('#see-more-projects-btn');
    const seeLessBtn = $('#see-less-projects-btn');
    const seeMoreWrapper = $('#see-more-wrapper');
    const seeLessWrapper = $('#see-less-wrapper');

    // "See More" button click handler
    seeMoreBtn.on('click', function() {
      projectsList.addClass('show-all');
      // Reveal hidden projects with an animation
      projectsList.find('.project-card:hidden').fadeIn(400);
      seeMoreWrapper.fadeOut(300, function() {
        seeLessWrapper.fadeIn(300);
      });
    });

    // "See Less" button click handler
    seeLessBtn.on('click', function() {
      projectsList.removeClass('show-all');
      seeLessWrapper.fadeOut(300, function() {
        seeMoreWrapper.fadeIn(300);
      });
      // Scroll back to the top of the projects section
      $('html, body').animate({
        scrollTop: $("#projects").offset().top - 70 // 70px offset for the navbar
      }, 800, "easeInOutExpo");
    });

    // Filter for Projects
    $('.projects-filter .filter-btn').on('click', function() {
      var filter = $(this).data('filter');
      
      // Update active button
      $('.projects-filter .filter-btn').removeClass('active');
      $(this).addClass('active');

      // If a filter is used, show all projects and hide the "See More" button
      if (!projectsList.hasClass('show-all')) {
        projectsList.addClass('show-all');
        seeMoreWrapper.hide();
      }
      
      // Filter projects
      if (filter === 'all') {
        projectsList.find('.project-card').fadeIn(300);
      } else {
        projectsList.find('.project-card').each(function() {
          var categories = $(this).data('category').split(' ');
          if (categories.includes(filter)) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(300);
          }
        });
      }
    });

    // Filter for Certifications
    $('.cert-filter-btn').on('click', function() {
      const filter = $(this).data('filter');
      const gridView = $('#cert-grid-container');

      // Update active button
      $('.cert-filter-btn').removeClass('active');
      $(this).addClass('active');

      // Filtra os cards na grade
      if (filter === 'all') {
        gridView.find('.cert-card').fadeIn(300);
      } else {
        gridView.find('.cert-card').each(function() {
          const card = $(this);
          const categories = card.data('category').split(' ');
          if (categories.includes(filter)) {
            card.fadeIn(300);
          } else {
            card.fadeOut(300);
          }
        });
      }
    });

    // Move todos os modais para o body para evitar problemas de stacking context
    $('.modal').appendTo('body');

    // Inicializa os carrosséis
    $('.carousel').carousel({ interval: false, keyboard: true, wrap: true });

    // Segurança extra: garante que nenhuma backdrop antiga fique na tela
    $(document).on('hidden.bs.modal', function(){
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $('body').css('padding-right', '');
    });

    // Lógica genérica para navegação entre modais de projeto e documentação
    $(document).on('click', '[data-action="open-docs"]', function(e) {
      e.preventDefault();
      const $btn = $(this);
      const docsUrl = $btn.data('doc-url');

      // Se houver uma URL de documentação dedicada, navegar para a página
      if (docsUrl) {
        // Salvar a seção atual antes de navegar para documentação
        const currentSection = getCurrentSection();
        console.log('Salvando seção antes de ir para docs:', currentSection);
        localStorage.setItem('lastPortfolioSection', currentSection);
        
        // Aguardar um pouco para garantir que o localStorage foi salvo
        setTimeout(() => {
          window.location.href = docsUrl;
        }, 100);
        return;
      }
      const projectModalId = $btn.data('project-modal');
      const docsModalId = $btn.data('docs-modal');
      const $projectModal = $(projectModalId);
      const $docsModal = $(docsModalId);

      if ($docsModal.length === 0) {
        alert('Documentation for this project is not yet available.');
        return;
      }

      // Hide the current modal and show the new one.
      // The timeout prevents race conditions between modal hide/show events.
      $projectModal.modal('hide');
      setTimeout(function() {
          $docsModal.modal('show');
      }, 500); // 500ms delay to allow the first modal to close gracefully
    });

    $(document).on('click', '[data-action="back-to-project"]', function(e) {
      e.preventDefault();
      const $btn = $(this);
      const projectModalId = $btn.data('project-modal');
      const docsModalId = $btn.data('docs-modal');

      $(docsModalId).one('hidden.bs.modal', function() {
        $(projectModalId).modal('show');
      }).modal('hide');
    });

    // SKILLS Counter (redundant, but keeping for safety if original is removed)
    $(function () {
      $('.counter').counterUp({
        delay: 10,
        time: 2000
      });
    });

    // Lógica para o botão "Voltar ao Topo"
    var backToTopBtn = $('.back-to-top');
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) { // Mostra o botão após rolar 200px
        backToTopBtn.fadeIn();
      } else {
        backToTopBtn.fadeOut();
      }
    });
    // A ação de clique já é tratada pelo 'js-scroll-trigger' que adicionamos no HTML

    // =========================
    // Navbar click UX polish
    // =========================
    const NAV_ANIM_CLASS = 'nav-clicked';

    // Clique nos itens do menu
    $(document).on('click', '#sideNav .nav-link.js-scroll-trigger', function(e) {
      const $link = $(this);
      const hash = $link.attr('href');
      if (!hash || !hash.startsWith('#')) return;

      // feedback visual imediato
      $('#sideNav .nav-link').removeClass(NAV_ANIM_CLASS);
      $link.addClass(NAV_ANIM_CLASS);

      // scroll suave até a seção, então anima a seção
      const $target = $(hash);
      if ($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top - 70 }, 600, 'easeInOutExpo');
        
        // Salvar a seção atual após a animação
        setTimeout(() => {
          const sectionName = hash.substring(1); // remove o #
          localStorage.setItem('lastPortfolioSection', sectionName);
        }, 650); // um pouco depois da animação
        
        e.preventDefault();
      }
    });

    // Listener para detectar mudanças de seção durante o scroll
    let scrollTimeout;
    $(window).on('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentSection = getCurrentSection();
        localStorage.setItem('lastPortfolioSection', currentSection);
      }, 150); // debounce para evitar muitas chamadas
    });

    // Remove qualquer lógica de animação automática em hashchange

  });

});

// Função para detectar a seção atual baseada na posição do scroll
function getCurrentSection() {
  const sections = ['about', 'experience', 'education', 'skills', 'projects', 'certifications', 'contact'];
  const scrollPosition = $(window).scrollTop();
  
  console.log('Detectando seção - scroll position:', scrollPosition);
  
  // Encontrar a seção mais próxima do topo da viewport
  let closestSection = 'about';
  let minDistance = Infinity;
  
  sections.forEach(section => {
    const $section = $(`#${section}`);
    if ($section.length) {
      const sectionTop = $section.offset().top;
      const distance = Math.abs(scrollPosition - sectionTop);
      
      console.log(`Seção ${section}: top=${sectionTop}, distance=${distance}`);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    } else {
      console.log(`Seção ${section} NÃO ENCONTRADA no DOM`);
    }
  });
  
  console.log('Seção final detectada:', closestSection);
  return closestSection;
}

// Função para navegar de volta à seção específica
function navigateToLastSection() {
  const lastSection = localStorage.getItem('lastPortfolioSection');
  console.log('Seção salva no localStorage:', lastSection);
  
  // Mostrar feedback visual
  showNavigationFeedback(lastSection);
  
  if (lastSection && lastSection !== 'about') {
    const target = document.getElementById(lastSection);
    console.log('Target encontrado:', target ? 'SIM' : 'NÃO', 'ID:', lastSection);
    
    if (target) {
      const targetTop = target.offsetTop - 70;
      console.log('Navegando para:', lastSection, 'posição:', targetTop);
      
      // Usar scroll nativo do JavaScript como fallback
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
      
      // Também tentar com jQuery se disponível
      if (typeof $ !== 'undefined') {
        $('html, body').animate({ 
          scrollTop: targetTop 
        }, 800, 'easeInOutExpo');
      }
    } else {
      console.log('Seção não encontrada, indo para o topo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    console.log('Nenhuma seção salva ou é about, indo para o topo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Limpar a informação salva após usar
  localStorage.removeItem('lastPortfolioSection');
}

// Função para mostrar feedback visual da navegação
function showNavigationFeedback(section) {}

// Função de teste para debug
function testNavigation() {
  console.log('=== TESTE DE NAVEGAÇÃO ===');
  console.log('localStorage atual:', localStorage.getItem('lastPortfolioSection'));
  console.log('Todas as seções disponíveis:');
  const sections = ['about', 'experience', 'education', 'skills', 'projects', 'certifications', 'contact'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      console.log(`${section}: encontrada, top=${element.offsetTop}`);
    } else {
      console.log(`${section}: NÃO encontrada`);
    }
  });
  
  // Simular salvamento de seção 'projects'
  localStorage.setItem('lastPortfolioSection', 'projects');
  console.log('Salvou seção "projects" no localStorage');
  
  // Testar navegação
  setTimeout(() => {
    console.log('Iniciando teste de navegação...');
    navigateToLastSection();
  }, 1000);
}

// Função para forçar navegação para Projects
function forceGoToProjects() {
  console.log('=== FORÇANDO NAVEGAÇÃO PARA PROJECTS ===');
  
  // Navegar diretamente para a seção projects
  window.location.href = '../index.html#projects';
}

function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(function() {
    const feedback = element.querySelector('.copy-feedback');
    if (feedback) {
      const originalText = feedback.textContent;
      feedback.textContent = 'Copied!';
      feedback.style.opacity = '1';
      
      setTimeout(() => {
        feedback.textContent = originalText;
        feedback.style.opacity = '0.7'; // Return to hover state
      }, 1500);
    }
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
}
