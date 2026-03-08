function fileToPreviewItem(file, index, onMoveUp, onMoveDown, onRemove) {
  const li = document.createElement('li');
  li.className = 'preview-item';

  const img = document.createElement('img');
  img.alt = `Selected image ${index + 1}`;
  img.src = URL.createObjectURL(file);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<strong>${file.name}</strong><small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>`;

  const controls = document.createElement('div');
  controls.className = 'controls';

  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.className = 'mini-btn';
  upBtn.textContent = '↑';
  upBtn.addEventListener('click', onMoveUp);

  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.className = 'mini-btn';
  downBtn.textContent = '↓';
  downBtn.addEventListener('click', onMoveDown);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'mini-btn';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', onRemove);

  controls.append(upBtn, downBtn, removeBtn);
  li.append(img, meta, controls);
  return li;
}

export function setupWizard() {
  const wizard = document.querySelector('#readingWizard');
  if (!wizard) return;

  const fileInput = wizard.querySelector('input[name="images"]');
  const dropzone = wizard.querySelector('#dropzone');
  const previewList = wizard.querySelector('#imagePreviewList');
  const fallbackCaptureInput = wizard.querySelector('#captureFallbackInput');

  const startCameraBtn = wizard.querySelector('#startCameraBtn');
  const switchCameraBtn = wizard.querySelector('#switchCameraBtn');
  const takeSnapshotBtn = wizard.querySelector('#takeSnapshotBtn');
  const stopCameraBtn = wizard.querySelector('#stopCameraBtn');
  const cameraPreview = wizard.querySelector('#cameraPreview');
  const cameraCanvas = wizard.querySelector('#cameraCanvas');
  const cameraStatus = wizard.querySelector('#cameraStatus');

  let facingMode = 'environment';
  let stream = null;
  const selectedFiles = [];

  const syncFileInput = () => {
    const dt = new DataTransfer();
    selectedFiles.forEach((f) => dt.items.add(f));
    fileInput.files = dt.files;
  };

  const setStatus = (text) => {
    cameraStatus.textContent = text;
  };

  const renderPreviews = () => {
    previewList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const item = fileToPreviewItem(
        file,
        index,
        () => {
          if (index <= 0) return;
          [selectedFiles[index - 1], selectedFiles[index]] = [selectedFiles[index], selectedFiles[index - 1]];
          syncFileInput();
          renderPreviews();
        },
        () => {
          if (index >= selectedFiles.length - 1) return;
          [selectedFiles[index + 1], selectedFiles[index]] = [selectedFiles[index], selectedFiles[index + 1]];
          syncFileInput();
          renderPreviews();
        },
        () => {
          selectedFiles.splice(index, 1);
          syncFileInput();
          renderPreviews();
        }
      );
      previewList.append(item);
    });
  };

  const addFiles = (files) => {
    const normalized = [...files];
    if (!normalized.length) return;
    if (normalized.some((f) => f.size > 10 * 1024 * 1024)) {
      alert('One or more images exceed 10MB.');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (normalized.some((f) => !allowedTypes.includes(f.type))) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }
    for (const file of normalized) {
      if (selectedFiles.length >= 4) break;
      selectedFiles.push(file);
    }
    syncFileInput();
    renderPreviews();
    dropzone.textContent = `${selectedFiles.length} image(s) selected`;
  };

  fileInput?.addEventListener('change', () => addFiles(fileInput.files));

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('active');
  });
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('active'));
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('active');
    addFiles(e.dataTransfer.files);
  });

  fallbackCaptureInput?.addEventListener('change', () => addFiles(fallbackCaptureInput.files));

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Live camera API is not available. Use quick mobile capture fallback.');
      return;
    }

    try {
      if (stream) stream.getTracks().forEach((track) => track.stop());

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });

      cameraPreview.srcObject = stream;
      await cameraPreview.play();
      switchCameraBtn.disabled = false;
      takeSnapshotBtn.disabled = false;
      stopCameraBtn.disabled = false;
      startCameraBtn.disabled = true;
      setStatus(`Camera active (${facingMode === 'environment' ? 'rear' : 'front'}).`);
    } catch {
      setStatus('Unable to access camera. Please allow camera permissions and retry.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    cameraPreview.srcObject = null;
    switchCameraBtn.disabled = true;
    takeSnapshotBtn.disabled = true;
    stopCameraBtn.disabled = true;
    startCameraBtn.disabled = false;
    setStatus('Camera is off.');
  }

  function captureSnapshot() {
    if (!stream || !cameraPreview.videoWidth || !cameraPreview.videoHeight) return;
    cameraCanvas.width = cameraPreview.videoWidth;
    cameraCanvas.height = cameraPreview.videoHeight;

    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraPreview, 0, 0, cameraCanvas.width, cameraCanvas.height);

    cameraCanvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `snapshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
      addFiles([file]);
      setStatus('Snapshot captured and added.');
    }, 'image/jpeg', 0.92);
  }

  startCameraBtn?.addEventListener('click', startCamera);
  stopCameraBtn?.addEventListener('click', stopCamera);
  takeSnapshotBtn?.addEventListener('click', captureSnapshot);
  switchCameraBtn?.addEventListener('click', async () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCamera();
  });

  wizard.addEventListener('submit', () => {
    stopCamera();
  });
}
