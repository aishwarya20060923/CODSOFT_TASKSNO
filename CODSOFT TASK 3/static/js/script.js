/**
 * CareerHub - Client-side interactive script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 2. Auto-dismiss Flash Alerts
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    // Dismiss button handler
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 250);
      });
    }

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      if (document.body.contains(alert)) {
        alert.style.transition = 'all 0.3s ease-out';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
      }
    }, 5000);
  });

  // 3. File Input Helper (shows selected file name)
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      const fileName = e.target.files[0]?.name;
      const label = input.parentElement.querySelector('.file-chosen-text');
      if (label && fileName) {
        label.textContent = `Selected: ${fileName}`;
        label.style.display = 'block';
      }
    });
  });

  // 4. Confirmation dialog for job deletion
  const deleteForms = document.querySelectorAll('.confirm-delete-form');
  deleteForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const confirmed = window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
});
