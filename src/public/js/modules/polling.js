export function setupProcessingPoll() {
  const el = document.querySelector('.processing[data-reading-id]');
  if (!el) return;

  const id = el.dataset.readingId;
  const text = document.querySelector('#statusText');

  const timer = setInterval(async () => {
    const res = await fetch(`/readings/${id}/poll`);
    const data = await res.json();
    text.textContent = data.status;
    if (data.status === 'COMPLETED') {
      clearInterval(timer);
      window.location.href = `/readings/${id}/result`;
    }
  }, 2000);
}
