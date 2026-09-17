// GymForce – main.js
// Minimal vanilla JS for UX enhancements

document.addEventListener("DOMContentLoaded", () => {
  // Auto-dismiss alerts after 5 seconds
  document.querySelectorAll(".alert.alert-dismissible").forEach(alert => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      bsAlert.close();
    }, 5000);
  });

  // Confirm dangerous actions
  document.querySelectorAll("[data-confirm]").forEach(el => {
    el.addEventListener("click", e => {
      if (!confirm(el.dataset.confirm)) {
        e.preventDefault();
      }
    });
  });
});
