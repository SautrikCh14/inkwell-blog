function confirmDelete() {
  return confirm("Delete this post? This cannot be undone.");
}


document.querySelectorAll('.form-textarea').forEach(textarea => {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});
