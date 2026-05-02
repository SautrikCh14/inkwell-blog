function confirmDelete() {
  return confirm("Delete this post? This cannot be undone.");
}

// Auto-grow textarea
document.querySelectorAll('.form-textarea').forEach(textarea => {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});
