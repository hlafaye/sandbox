
const previewModal = document.getElementById('previewModal');

previewModal.addEventListener('show.bs.modal', event => {
const button = event.relatedTarget;
const imgSrc = button.getAttribute('data-img');
const title = button.getAttribute('data-title');

document.getElementById('previewImage').src = imgSrc;
document.getElementById('previewTitle').textContent = title;
});
