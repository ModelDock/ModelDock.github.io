/**
 * ModelDock Documentation - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Management ---
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('modeldock-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('modeldock-theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'light') {
      themeToggle.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeToggle.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      themeToggle.setAttribute('title', 'Switch to Light Mode');
    }
  }

  // --- 2. Mobile Sidebar Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('open');
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
      });
    }
  }

  // --- 3. Code Block Copy Buttons ---
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const codeWrapper = button.closest('.code-block-wrapper');
      if (!codeWrapper) return;
      const codeElem = codeWrapper.querySelector('pre code') || codeWrapper.querySelector('pre');
      if (!codeElem) return;

      const codeText = codeElem.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        const originalHTML = button.innerHTML;
        button.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Copied!`;
        button.style.borderColor = 'var(--accent-emerald)';
        button.style.color = 'var(--accent-emerald)';

        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.borderColor = '';
          button.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // --- 4. Interactive Code Block Tabs ---
  document.querySelectorAll('.code-tabs').forEach(tabsContainer => {
    const tabs = tabsContainer.querySelectorAll('.code-tab');
    const wrapper = tabsContainer.closest('.code-block-wrapper');
    if (!wrapper) return;
    const contents = wrapper.querySelectorAll('.code-tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetLang = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(content => {
          if (content.getAttribute('data-lang') === targetLang) {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        });
      });
    });
  });

  // --- 5. Scroll-Spy for Table of Contents ---
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = Array.from(document.querySelectorAll('.doc-content h2, .doc-content h3'))
    .filter(h => h.id);

  if (tocLinks.length > 0 && headings.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    headings.forEach(heading => observer.observe(heading));
  }
});
