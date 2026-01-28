// ============================================
// UX Metrics - Design Prototype Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  // Add hover effects to nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(4px)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });

  // Add click handlers to study items
  const studyItems = document.querySelectorAll('.study-item');
  studyItems.forEach(item => {
    item.addEventListener('click', () => {
      console.log('Study clicked:', item.querySelector('.study-name').textContent);
    });
  });

  // Add click handlers to action items
  const actionItems = document.querySelectorAll('.action-item');
  actionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Action clicked:', item.querySelector('.action-title').textContent);
    });
  });

  // Animate stat values on page load
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const finalValue = parseInt(stat.textContent);
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 30);
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        currentValue = finalValue;
        clearInterval(timer);
      }
      stat.textContent = currentValue;
    }, 30);
  });

  // Add intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll('.content-card, .stat-card').forEach(card => {
    observer.observe(card);
  });
});
