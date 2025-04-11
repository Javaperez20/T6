document.addEventListener("DOMContentLoaded", function() {

  // Elementos para manejo de Excel y guardado en localStorage
  const btnSaveExcel = document.getElementById("btn-saveExcel"); 
  const btnDeleteExcel = document.getElementById("btn-deleteExcel");
  
  // Elementos del formulario básico
  const reloj = document.querySelector(".clock");
  const inputId = document.querySelector(".input-id");
  const inputRut = document.querySelector(".input-rut");
  const inputName = document.querySelector(".input-name");
  const inputPhone1 = document.querySelector(".input-phone1");
  const inputPhone2 = document.querySelector(".input-phone2");
  const inputOnt = document.querySelector(".input-ont");
  const inputOlt = document.querySelector(".input-olt");
  const inputNodo = document.querySelector(".input-nodo");
  const inputAddress = document.querySelector(".input-address");
  const inputNotas = document.querySelector('.input-notas');
  
  // Elementos para Internet
  const checkboxInternetRojo = document.querySelector(".checkbox-internet-rojo");
  const selectInternetRojo = document.querySelector(".select-internet-rojo");
  const checkboxInternetVerde = document.querySelector(".checkbox-internet-verde");
  const selectInternetVerde = document.querySelector(".select-internet-verde");
  const checkboxInternetBase = document.querySelector(".checkbox-internet-base");
  const selectInternetBase = document.querySelector(".select-internet-base");
  
  // Elementos para Tv
  const checkboxTvRojo = document.querySelector(".checkbox-tv-rojo");
  const selectTvRojo = document.querySelector(".select-tv-rojo");
  const checkboxTvVerde = document.querySelector(".checkbox-tv-verde");
  const selectTvVerde = document.querySelector(".select-tv-verde");
  const checkboxTvBase = document.querySelector(".checkbox-tv-base");
  const selectTvBase = document.querySelector(".select-tv-base");
  // Nuevos elementos para Tv: Tv Go y Tv Go +
  const checkboxTvGo = document.querySelector(".checkbox-tv-go");
  const selectTvGo = document.querySelector(".select-tv-go");
  const checkboxTvGoPlus = document.querySelector(".checkbox-tv-go-plus");
  const selectTvGoPlus = document.querySelector(".select-tv-go-plus");
  
  // Elementos para Teléfono (solo Rojo y Verde)
  const checkboxPhoneRojo = document.querySelector(".checkbox-phone-rojo");
  const selectPhoneRojo = document.querySelector(".select-phone-rojo");
  const checkboxPhoneVerde = document.querySelector(".checkbox-phone-verde");
  const selectPhoneVerde = document.querySelector(".select-phone-verde");
  
  // Área de salida y botones
  const textareaObs = document.querySelector(".textarea-obs");
  const btnCopy = document.querySelector(".btn-copy");
  const btnClear = document.querySelector(".btn-clear");
  
  // Elemento para mostrar los códigos relacionados
  const codigoDisplay = document.querySelector(".codigo-display");
  
  // Variable para almacenar datos del Excel
  let excelData = null;
  
  // Actualizar reloj
  function updateClock() {
    const now = new Date();
    reloj.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
  
  // Cargar automáticamente el Excel desde "datos.xlsx"
  fetch('datos.xlsx')
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("Datos del Excel cargados automáticamente:", excelData);
      const extractedData = {};
      excelData.forEach(row => {
        if (row.length >= 2) {
          extractedData[row[0]] = row[1];
        }
      });
      localStorage.setItem("datosExcel", JSON.stringify(extractedData));
      console.log("Datos guardados en localStorage automáticamente");
    })
    .catch(error => console.error("Error cargando Excel:", error));
  
  // Función para generar y descargar el Excel de OBS
  btnSaveExcel.addEventListener("click", generarExcel);
  
  // Borrar datos del Excel y llamadas guardadas
  btnDeleteExcel.addEventListener("click", function() {
    localStorage.removeItem("datosExcel");
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith("llamada")) {
        localStorage.removeItem(key);
      }
    }
    alert("¡Datos borrados del Local Storage!");
  });
  
  // Funciones para actualizar la salida combinada y mostrar códigos
  function toggleSelect(select, checkbox) {
    select.style.display = checkbox.checked ? "block" : "none";
    if (!checkbox.checked) select.value = "";
    updateCombined();
  }
  
  function uncheckOthers(currentCheckbox) {
    const checkboxes = [
      checkboxInternetRojo, checkboxInternetVerde, checkboxInternetBase,
      checkboxTvRojo, checkboxTvVerde, checkboxTvBase, checkboxTvGo, checkboxTvGoPlus,
      checkboxPhoneRojo, checkboxPhoneVerde
    ];
    checkboxes.forEach(chk => {
      if(chk !== currentCheckbox) {
        chk.checked = false;
        if(chk === checkboxInternetRojo) {
          selectInternetRojo.style.display = "none";
          selectInternetRojo.value = "";
        }
        if(chk === checkboxInternetVerde) {
          selectInternetVerde.style.display = "none";
          selectInternetVerde.value = "";
        }
        if(chk === checkboxInternetBase) {
          selectInternetBase.style.display = "none";
          selectInternetBase.value = "";
        }
        if(chk === checkboxTvRojo) {
          selectTvRojo.style.display = "none";
          selectTvRojo.value = "";
        }
        if(chk === checkboxTvVerde) {
          selectTvVerde.style.display = "none";
          selectTvVerde.value = "";
        }
        if(chk === checkboxTvBase) {
          selectTvBase.style.display = "none";
          selectTvBase.value = "";
        }
        if(chk === checkboxTvGo) {
          selectTvGo.style.display = "none";
          selectTvGo.value = "";
        }
        if(chk === checkboxTvGoPlus) {
          selectTvGoPlus.style.display = "none";
          selectTvGoPlus.value = "";
        }
        if(chk === checkboxPhoneRojo) {
          selectPhoneRojo.style.display = "none";
          selectPhoneRojo.value = "";
        }
        if(chk === checkboxPhoneVerde) {
          selectPhoneVerde.style.display = "none";
          selectPhoneVerde.value = "";
        }
      }
    });
  }
  
  // Función updateCombined actualizada:
  function updateCombined() {
  let combinedLines = [];

  // Procesar servicios seleccionados y observaciones asociadas
  let extraDetails = "";
  const storedDataStr = localStorage.getItem("datosExcel");
  let storedData = storedDataStr ? JSON.parse(storedDataStr) : {};

  const checkSelectPairs = [
    { checkbox: checkboxInternetRojo, select: selectInternetRojo, keyPrefix: "internetRojo" },
    { checkbox: checkboxInternetVerde, select: selectInternetVerde, keyPrefix: "internetVerde" },
    { checkbox: checkboxInternetBase, select: selectInternetBase, keyPrefix: "internetBase" },
    { checkbox: checkboxTvRojo, select: selectTvRojo, keyPrefix: "tvRojo" },
    { checkbox: checkboxTvVerde, select: selectTvVerde, keyPrefix: "tvVerde" },
    { checkbox: checkboxTvBase, select: selectTvBase, keyPrefix: "tvBase" },
    { checkbox: checkboxTvGo, select: selectTvGo, keyPrefix: "tvGo" },
    { checkbox: checkboxTvGoPlus, select: selectTvGoPlus, keyPrefix: "tvGoPlus" },
    { checkbox: checkboxPhoneRojo, select: selectPhoneRojo, keyPrefix: "telefonoRojo" },
    { checkbox: checkboxPhoneVerde, select: selectPhoneVerde, keyPrefix: "telefonoVerde" }
  ];

  for (const item of checkSelectPairs) {
    const { checkbox, select, keyPrefix } = item;
    if (checkbox.checked && select.value && select.selectedIndex > 0) {
      const key = keyPrefix + select.selectedIndex;
      const valor = storedData[key] || "";
      extraDetails += `Cliente indica ${valor}\n`;
    }
  }

  extraDetails = extraDetails.trim();

  // Agregar campos básicos
  const dateStr = reloj.value.trim();
  if (dateStr) combinedLines.push(`DATE: ${dateStr}`);

  const idStr = inputId.value.trim();
  if (idStr) combinedLines.push(`ID: ${idStr}`);

  const rutStr = inputRut.value.trim();
  if (rutStr) combinedLines.push(`RUT: ${rutStr}`);

  const nameStr = inputName.value.trim();
  if (nameStr) combinedLines.push(`NOMBRE: ${nameStr}`);

  const phone1 = inputPhone1.value.trim();
  const phone2 = inputPhone2.value.trim();
  if (phone1 || phone2) {
    let phones = phone1 && phone2 ? `${phone1} / ${phone2}` : phone1 || phone2;
    combinedLines.push(`FONO: ${phones}`);
  }

  const ontStr = inputOnt.value.trim();
  if (ontStr) combinedLines.push(`ONT: ${ontStr}`);

  const oltStr = inputOlt.value.trim();
  if (oltStr) combinedLines.push(`OLT: ${oltStr}`);

  const nodoStr = inputNodo.value.trim();
  if (nodoStr) combinedLines.push(`TARJETA Y PUERTO: ${nodoStr}`);

  const addressStr = inputAddress.value.trim();
  if (addressStr) combinedLines.push(`DIRECCIÓN Y NODO: ${addressStr}`);

  // Agregar sección OBS solo si hay detalles o notas
  const notasObs = inputNotas.value.trim();
  if (extraDetails || notasObs) {
    combinedLines.push("OBS:");
    if (extraDetails) combinedLines.push(extraDetails);
    if (notasObs) combinedLines.push(notasObs);
  }

  // Mostrar resultado
  textareaObs.value = combinedLines.join("\n");
  autoResize(textareaObs);
  updateCodigoDisplay();
}

  
  function updateCodigoDisplay() {
    let codigoInfo = "";
    const storedDataStr = localStorage.getItem("datosExcel");
    let storedData = storedDataStr ? JSON.parse(storedDataStr) : {};
    const servicesList = [
      { checkbox: checkboxInternetRojo, select: selectInternetRojo, offset: 0 },
      { checkbox: checkboxInternetVerde, select: selectInternetVerde, offset: 7 },
      { checkbox: checkboxInternetBase, select: selectInternetBase, offset: 14 },
      { checkbox: checkboxTvRojo, select: selectTvRojo, offset: 21 },
      { checkbox: checkboxTvVerde, select: selectTvVerde, offset: 28 },
      { checkbox: checkboxTvBase, select: selectTvBase, offset: 35 },
      { checkbox: checkboxTvGo, select: selectTvGo, offset: 42 },
      { checkbox: checkboxTvGoPlus, select: selectTvGoPlus, offset: 49 },
      { checkbox: checkboxPhoneRojo, select: selectPhoneRojo, offset: 56 },
      { checkbox: checkboxPhoneVerde, select: selectPhoneVerde, offset: 63 }
    ];
    servicesList.forEach(service => {
      if (service.checkbox.checked && service.select.value && service.select.selectedIndex > 0) {
        const effectiveIndex = service.offset + service.select.selectedIndex;
        const codeKey = "codigo" + effectiveIndex;
        const codeValue = storedData[codeKey] || "";
        codigoInfo += `Tipificación:\n\n${codeValue}\n`;
      }
    });
    codigoDisplay.innerText = codigoInfo;
  }
  
  function copiar() {
    navigator.clipboard.writeText(textareaObs.value)
      .then(() => {
        alert("¡Copiado al portapapeles!");
        guardarOBS();
      })
      .catch(err => console.error("Error al copiar: ", err));
  }
  
  function guardarOBS() {
    let num = 1;
    while (localStorage.getItem("llamada" + num) !== null) {
      num++;
    }
    localStorage.setItem("llamada" + num, textareaObs.value);
    console.log(`OBS guardada en "llamada${num}"`);
  }
  
  function generarExcel() {
    let data = [];
    let i = 1;
    while (true) {
      const key = "llamada" + i;
      const value = localStorage.getItem(key);
      if (value === null) break;
      data.push([key, value]);
      i++;
    }
    if (data.length === 0) {
      alert("No hay datos de OBS guardados para generar el Excel.");
      return;
    }
    const ws = XLSX.utils.aoa_to_sheet([["Llamada", "OBS"], ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Llamadas");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "llamadas.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
  function limpiarCampos() {
    inputId.value = "";
    inputRut.value = "";
    inputName.value = "";
    inputPhone1.value = "";
    inputPhone2.value = "";
    inputOnt.value = "";
    inputOlt.value = "";
    inputNodo.value = "";
    inputAddress.value = "";
    inputNotas.value = "";
    const checkboxes = [
      checkboxInternetRojo, checkboxInternetVerde, checkboxInternetBase,
      checkboxTvRojo, checkboxTvVerde, checkboxTvBase, checkboxTvGo, checkboxTvGoPlus,
      checkboxPhoneRojo, checkboxPhoneVerde
    ];
    const selects = [
      selectInternetRojo, selectInternetVerde, selectInternetBase,
      selectTvRojo, selectTvVerde, selectTvBase, selectTvGo, selectTvGoPlus,
      selectPhoneRojo, selectPhoneVerde
    ];
    checkboxes.forEach(checkbox => checkbox.checked = false);
    selects.forEach(select => { 
      select.style.display = "none"; 
      select.value = "";
    });
    textareaObs.value = "";
    updateCodigoDisplay();
  }
  
  inputId.addEventListener("input", updateCombined);
  inputRut.addEventListener("input", updateCombined);
  inputName.addEventListener("input", updateCombined);
  inputPhone1.addEventListener("input", updateCombined);
  inputPhone2.addEventListener("input", updateCombined);
  inputOnt.addEventListener("input", updateCombined);
  inputOlt.addEventListener("input", updateCombined);
  inputNodo.addEventListener("input", updateCombined);
  inputAddress.addEventListener("input", updateCombined);
  inputNotas.addEventListener("input", function() {
    autoResize(inputNotas);
    updateCombined();
  });
  
  checkboxInternetRojo.addEventListener("change", () => { 
    if(checkboxInternetRojo.checked) {
      uncheckOthers(checkboxInternetRojo);
    }
    toggleSelect(selectInternetRojo, checkboxInternetRojo);
  });
  checkboxInternetVerde.addEventListener("change", () => { 
    if(checkboxInternetVerde.checked) {
      uncheckOthers(checkboxInternetVerde);
    }
    toggleSelect(selectInternetVerde, checkboxInternetVerde);
  });
  checkboxInternetBase.addEventListener("change", () => { 
    if(checkboxInternetBase.checked) {
      uncheckOthers(checkboxInternetBase);
    }
    toggleSelect(selectInternetBase, checkboxInternetBase);
  });
  selectInternetRojo.addEventListener("change", updateCombined);
  selectInternetVerde.addEventListener("change", updateCombined);
  selectInternetBase.addEventListener("change", updateCombined);
  
  checkboxTvRojo.addEventListener("change", () => { 
    if(checkboxTvRojo.checked) {
      uncheckOthers(checkboxTvRojo);
    }
    toggleSelect(selectTvRojo, checkboxTvRojo);
  });
  checkboxTvVerde.addEventListener("change", () => { 
    if(checkboxTvVerde.checked) {
      uncheckOthers(checkboxTvVerde);
    }
    toggleSelect(selectTvVerde, checkboxTvVerde);
  });
  checkboxTvBase.addEventListener("change", () => { 
    if(checkboxTvBase.checked) {
      uncheckOthers(checkboxTvBase);
    }
    toggleSelect(selectTvBase, checkboxTvBase);
  });
  checkboxTvGo.addEventListener("change", () => { 
    if(checkboxTvGo.checked) {
      uncheckOthers(checkboxTvGo);
    }
    toggleSelect(selectTvGo, checkboxTvGo);
  });
  checkboxTvGoPlus.addEventListener("change", () => { 
    if(checkboxTvGoPlus.checked) {
      uncheckOthers(checkboxTvGoPlus);
    }
    toggleSelect(selectTvGoPlus, checkboxTvGoPlus);
  });
  selectTvRojo.addEventListener("change", updateCombined);
  selectTvVerde.addEventListener("change", updateCombined);
  selectTvBase.addEventListener("change", updateCombined);
  selectTvGo.addEventListener("change", updateCombined);
  selectTvGoPlus.addEventListener("change", updateCombined);
  
  checkboxPhoneRojo.addEventListener("change", () => { 
    if(checkboxPhoneRojo.checked) {
      uncheckOthers(checkboxPhoneRojo);
    }
    toggleSelect(selectPhoneRojo, checkboxPhoneRojo);
  });
  checkboxPhoneVerde.addEventListener("change", () => { 
    if(checkboxPhoneVerde.checked) {
      uncheckOthers(checkboxPhoneVerde);
    }
    toggleSelect(selectPhoneVerde, checkboxPhoneVerde);
  });
  selectPhoneRojo.addEventListener("change", updateCombined);
  selectPhoneVerde.addEventListener("change", updateCombined);
  
  btnCopy.addEventListener("click", copiar);
  btnClear.addEventListener("click", limpiarCampos);
  
  autoResize(textareaObs);

  /* --- Código del Temporizador --- */
  const totalTime = 120000; // 2 minutos en milisegundos
  let remainingTime = totalTime;
  let timerState = "paused";
  let lastTimestamp = null;
  let startTimestamp = null;
  let timeout30 = null;
  let timeout15 = null;
  let alert30Triggered = false;
  let alert15Triggered = false;

  function playCustomSound() {
    const audio = new Audio("alerta.mp3");
    audio.volume = 0.02;
    audio.play();
  }

  function updateFavicon(color) {
    let favicon = document.getElementById("dynamic-favicon");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.id = "dynamic-favicon";
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    const faviconCanvas = document.createElement("canvas");
    faviconCanvas.width = 32;
    faviconCanvas.height = 32;
    const faviconCtx = faviconCanvas.getContext("2d");
    faviconCtx.fillStyle = color;
    faviconCtx.fillRect(0, 0, faviconCanvas.width, faviconCanvas.height);
    favicon.href = faviconCanvas.toDataURL("image/png");
  }

  function scheduleTimeouts() {
    const now = Date.now();
    const endTime = startTimestamp + totalTime;
    if (!alert30Triggered && remainingTime > 30000) {
      const delay30 = endTime - 30000 - now;
      timeout30 = setTimeout(() => {
        playCustomSound();
        alert30Triggered = true;
      }, delay30);
    }
    if (!alert15Triggered && remainingTime > 15000) {
      const delay15 = endTime - 15000 - now;
      timeout15 = setTimeout(() => {
        playCustomSound();
        alert15Triggered = true;
      }, delay15);
    }
  }

  function handleTimerClick() {
    if (timerState === "paused") {
      timerState = "running";
      startTimestamp = Date.now();
      lastTimestamp = performance.now();
      alert30Triggered = false;
      alert15Triggered = false;
      if (document.hidden) {
        scheduleTimeouts();
      }
    } else if (timerState === "running") {
      timerState = "paused";
      remainingTime = totalTime;
      if (timeout30) { clearTimeout(timeout30); timeout30 = null; }
      if (timeout15) { clearTimeout(timeout15); timeout15 = null; }
    }
  }

  function drawCountdown(timeRemaining) {
    const elapsed = totalTime - timeRemaining;
    const progress = elapsed / totalTime;
    const startColor = { r: 119, g: 221, b: 119 };
    const endColor = { r: 255, g: 105, b: 97 };
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
    const bgColor = `rgb(${r}, ${g}, ${b})`;

    updateFavicon(bgColor);

    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      document.body.style.backgroundColor = bgColor;

      const seconds = Math.ceil(timeRemaining / 1000);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const timeText = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      ctx.font = "40px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(timeText, canvas.width / 2, canvas.height / 2);
    }
  }

  function updateTimer() {
    if (timerState === "running") {
      const elapsed = Date.now() - startTimestamp;
      remainingTime = totalTime - elapsed;
      if (remainingTime < 0) remainingTime = 0;
      if (!document.hidden) {
        if (!alert30Triggered && remainingTime <= 30000) {
          playCustomSound();
          alert30Triggered = true;
        }
        if (!alert15Triggered && remainingTime <= 15000) {
          playCustomSound();
          alert15Triggered = true;
        }
      }
    }
    drawCountdown(remainingTime);
    requestAnimationFrame(updateTimer);
  }

  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      if (timerState === "running") {
        scheduleTimeouts();
      }
    } else {
      if (timeout30) { clearTimeout(timeout30); timeout30 = null; }
      if (timeout15) { clearTimeout(timeout15); timeout15 = null; }
      lastTimestamp = performance.now();
    }
  });

  const canvas = document.getElementById("countdownCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const pipButton = document.getElementById("pipButton");
  const pipVideo = document.getElementById("pipVideo");

  if (canvas) {
    canvas.addEventListener("click", handleTimerClick);
  }
  if (pipVideo) {
    pipVideo.addEventListener("click", handleTimerClick);
  }
  document.addEventListener("keydown", function(e) {
    if (e.key === "<") {
      handleTimerClick();
    }
  });
  if (pipButton && pipVideo && canvas) {
    const stream = canvas.captureStream(30);
    pipVideo.srcObject = stream;
    pipVideo.play();
    pipButton.addEventListener("click", async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          pipButton.textContent = "Desacoplar";
        } else {
          const pipWindow = await pipVideo.requestPictureInPicture();
          pipButton.textContent = "Acoplar";
          if (pipWindow && pipWindow.resizeTo) {
            pipWindow.resizeTo(100, 50);
          }
        }
      } catch (error) {
        console.error("Error al cambiar el modo PiP:", error);
      }
    });
  }

  requestAnimationFrame(updateTimer);

  /* --- Funcionalidad del Wizard (Persiste) --- */
  function customAlert(message) {
    let alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerText = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 2000);
  }

  let currentStep = 1;
  function showCurrentStep() {
    var steps = document.querySelectorAll('.wizard-step');
    steps.forEach(function(step) {
      step.style.display = 'none';
    });
    document.getElementById('step' + currentStep).style.display = 'block';
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    if (currentStep === 1) {
      prevBtn.style.visibility = "hidden";
    } else {
      prevBtn.style.visibility = "visible";
    }
    if (currentStep === 4) {
      nextBtn.innerHTML = "Enviar";
    } else {
      nextBtn.innerHTML = "&gt;";
    }
  }

  function nextStep() {
    if (currentStep === 1) {
      var cedulaVal = document.getElementById('cedulaInput').value.trim();
      if (!cedulaVal) {
        customAlert('Por favor, ingresa la Cédula');
        return;
      }
      currentStep = 2;
    } else if (currentStep === 2) {
      var servicioSeleccionado = document.querySelector('input[name="servicioFalla"]:checked');
      if (!servicioSeleccionado) {
        customAlert('Por favor, selecciona un servicio con falla');
        return;
      }
      currentStep = 3;
    } else if (currentStep === 3) {
      var contratoVal = document.getElementById('contratoInput').value.trim();
      if (!contratoVal) {
        customAlert('Por favor, ingresa el Código de contrato');
        return;
      }
      currentStep = 4;
    } else if (currentStep === 4) {
      submitWizard();
      return;
    }
    showCurrentStep();
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      showCurrentStep();
    }
  }

  function cancelWizard() {
    document.getElementById('wizardModal').style.display = 'none';
    document.getElementById('cedulaInput').value = '';
    document.getElementById('contratoInput').value = '';
    document.querySelectorAll('input[name="servicioFalla"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="monitoreo"]').forEach(radio => radio.checked = false);
    currentStep = 1;
  }

  function openWizard() {
    currentStep = 1;
    document.getElementById('wizardModal').style.display = 'block';
    showCurrentStep();
  }

  function submitWizard() {
    var monitoreoSeleccionado = document.querySelector('input[name="monitoreo"]:checked');
    if (!monitoreoSeleccionado) {
      customAlert('Por favor, selecciona si hay o no pérdida de monitoreo');
      return;
    }
    var cedulaVal = document.getElementById('cedulaInput').value.trim();
    var servicioVal = document.querySelector('input[name="servicioFalla"]:checked').value;
    var contratoVal = document.getElementById('contratoInput').value.trim();
    var monitoreoVal = monitoreoSeleccionado.value;
    document.getElementById('cedulaHidden').value = cedulaVal;
    document.getElementById('servicioHidden').value = servicioVal;
    document.getElementById('contratoHidden').value = contratoVal;
    document.getElementById('monitoreoHidden').value = monitoreoVal;
    document.getElementById('rut').value = document.querySelector('.input-rut').value.trim();
    document.getElementById('idLlamada').value = document.querySelector('.input-id').value.trim();
    document.getElementById('ont').value = document.querySelector('.input-ont').value.trim();
    document.getElementById('olt').value = document.querySelector('.input-olt').value.trim();
    document.getElementById('observacion').value = document.querySelector('.textarea-obs').value.trim();
    document.getElementById('wizardModal').style.display = 'none';
    document.getElementById('customForm').submit();
    document.getElementById('cedulaInput').value = '';
    document.getElementById('contratoInput').value = '';
    document.querySelectorAll('input[name="servicioFalla"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="monitoreo"]').forEach(radio => radio.checked = false);
  }

  document.getElementById('btn-persiste').addEventListener('click', openWizard);

  /* --- Funcionalidad del Wizard (Sondeo) --- */
  let currentSondeoStep = 1;
  const totalSondeoSteps = 8;
  
  function showCurrentSondeoStep() {
    for(let i=1; i<=totalSondeoSteps; i++){
      const step = document.getElementById("sondeoStep" + i);
      if(step) {
        step.style.display = (i === currentSondeoStep) ? "block" : "none";
      }
    }
    const prevBtn = document.querySelector("#sondeoWizardModal .prev-btn");
    const nextBtn = document.querySelector("#sondeoWizardModal .next-btn");
    if(prevBtn) prevBtn.style.visibility = (currentSondeoStep === 1) ? "hidden" : "visible";
    if(nextBtn) nextBtn.innerText = (currentSondeoStep === totalSondeoSteps) ? "Enviar" : ">";
  }
  
  function nextSondeoModal() {
    if(currentSondeoStep < totalSondeoSteps){
      currentSondeoStep++;
      showCurrentSondeoStep();
    } else {
      sendSondeoData();
    }
  }
  
  function prevSondeoModal() {
    if(currentSondeoStep > 1) {
      currentSondeoStep--;
      showCurrentSondeoStep();
    }
  }
  
  // Función modificada para limpiar todos los campos del modal Sondeo al cancelar/enviar
  function cancelSondeo() {
    const sondeoModal = document.getElementById("sondeoWizardModal");
    if(sondeoModal) sondeoModal.style.display = "none";
    
    // Limpiar campos del modal Sondeo
    const inputCC = document.getElementById("cc");
    if (inputCC) inputCC.value = "";
    
    document.querySelectorAll("input[name='sondeoServicioFalla']").forEach(radio => radio.checked = false);
    
    document.querySelectorAll("input[name='sondeoInconvenientes']").forEach(radio => radio.checked = false);
    const sondeoOtrosInput = document.getElementById("sondeoOtrosInconveniente");
    if (sondeoOtrosInput) sondeoOtrosInput.value = "";
    
    document.querySelectorAll("input[name='sondeoClienteReincidente']").forEach(radio => radio.checked = false);
    
    const fallaDateInput = document.getElementById("fallaDate");
    if (fallaDateInput) fallaDateInput.value = "";
    const fallaTimeInput = document.getElementById("fallaTime");
    if (fallaTimeInput) fallaTimeInput.value = "";
    
    document.querySelectorAll("input[name='sondeoSuministroElectrico']").forEach(radio => radio.checked = false);
    document.querySelectorAll("input[name='sondeoGeneradorElectrico']").forEach(radio => radio.checked = false);
    document.querySelectorAll("input[name='sondeoLucesEstado']").forEach(radio => radio.checked = false);
    
    currentSondeoStep = 1;
    showCurrentSondeoStep();
  }
  
  function sendSondeoData() {
    const rut = document.querySelector(".input-rut").value;
    const telefono = document.querySelector(".input-phone1").value;
    const direccion = document.querySelector(".input-address").value;
    const ont = document.querySelector(".input-ont").value;
    const olt = document.querySelector(".input-olt").value;
    const tarjetaPuerto = document.querySelector(".input-nodo").value;
    const obs = document.querySelector(".textarea-obs").value;
    
    let tarjeta = "";
    let puerto = "";
    if (tarjetaPuerto.includes("/")) {
      let parts = tarjetaPuerto.split("/");
      tarjeta = parts[0].trim();
      puerto = parts[1].trim();
    } else {
      tarjeta = tarjetaPuerto.trim();
    }
    
    let nodo = "";
    const nodoRegex = /NODO:\s*(\S+)/i;
    const match = direccion.match(nodoRegex);
    if (match) {
      nodo = match[1];
    }
    
    const cc = document.getElementById("cc").value;
    
    const servicioFallaElem = document.querySelector('input[name="sondeoServicioFalla"]:checked');
    const servicioFalla = servicioFallaElem ? servicioFallaElem.value : "";
    
    const inconvenientesElem = document.querySelector('input[name="sondeoInconvenientes"]:checked');
    let inconvenientesStr = "";
    if (inconvenientesElem) {
      if (inconvenientesElem.value === "Otros:") {
        const otroTexto = document.getElementById("sondeoOtrosInconveniente").value;
        inconvenientesStr = "Otros: " + otroTexto;
      } else {
        inconvenientesStr = inconvenientesElem.value;
      }
    }
    
    const reincidenteElem = document.querySelector('input[name="sondeoClienteReincidente"]:checked');
    const reincidenteStr = reincidenteElem ? reincidenteElem.value : "";
    
    const fallaDate = document.getElementById("fallaDate").value;
    const fallaTime = document.getElementById("fallaTime").value;
    let fallaYear = "", fallaMonth = "", fallaDay = "", fallaHour = "", fallaMinute = "";
    if (fallaDate) {
      const dateParts = fallaDate.split("-");
      fallaYear = dateParts[0];
      fallaMonth = dateParts[1];
      fallaDay = dateParts[2];
    }
    if (fallaTime) {
      const timeParts = fallaTime.split(":");
      let h = parseInt(timeParts[0], 10);
      fallaMinute = timeParts[1];
      if (h > 12) { h = h - 12; }
      if (h === 0) { h = 12; }
      fallaHour = h.toString();
    }
    
    const suministroElem = document.querySelector('input[name="sondeoSuministroElectrico"]:checked');
    const suministroStr = suministroElem ? suministroElem.value : "";
    
    const generadorElem = document.querySelector('input[name="sondeoGeneradorElectrico"]:checked');
    const generadorStr = generadorElem ? generadorElem.value : "";
    
    const lucesElem = document.querySelector('input[name="sondeoLucesEstado"]:checked');
    const lucesStr = lucesElem ? lucesElem.value : "";
    
    // Se extrae el contenido de obs que se encuentra después de "OBS:"
    let obsPost = "";
    const marker = "OBS:";
    const pos = obs.indexOf(marker);
    if (pos >= 0) {
      obsPost = obs.substring(pos + marker.length).trim();
    }
    
    const baseURL = "https://docs.google.com/forms/d/e/1FAIpQLSeOA7OULm89gvnyG0q8Fvkr_bCdzXNsnRotRu6_tSmh-lPdLw/viewform?";
    
    const params = new URLSearchParams({
      "entry.423430974": cc,
      "entry.189057090": rut,
      "entry.399236047": servicioFalla,
      "entry.302927497": telefono,
      "entry.1510722740": direccion,
      "entry.825850316": ont,
      "entry.163062648": olt,
      "entry.1433390129": tarjeta,
      "entry.825069013": puerto,
      "entry.1038443960": nodo,
      "entry.1833454695": inconvenientesStr,
      "entry.542616353": reincidenteStr,
      "entry.978502501_year": fallaYear,
      "entry.978502501_month": fallaMonth,
      "entry.978502501_day": fallaDay,
      "entry.978502501_hour": fallaHour,
      "entry.978502501_minute": fallaMinute,
      "entry.1760026309": suministroStr,
      "entry.1092691919": generadorStr,
      "entry.64765887": lucesStr,
      // Solo se envía la parte de obs posterior a "OBS:"
      "entry.505366834": obsPost
    });
    
    const prefillURL = baseURL + params.toString();
    window.open(prefillURL, "ventanaSondeo", "width=800,height=600");
    
    cancelSondeo();
  }
  
  // Abrir modal Sondeo al presionar el botón
  document.getElementById("btn-sondeo").addEventListener("click", function() {
    currentSondeoStep = 1;
    showCurrentSondeoStep();
    document.getElementById("sondeoWizardModal").style.display = "block";
  });
  
  // Exponer funciones globalmente para atributos inline
  window.openWizard = openWizard;
  window.nextStep = nextStep;
  window.prevStep = prevStep;
  window.cancelWizard = cancelWizard;
  window.customAlert = customAlert;
  window.nextSondeoModal = nextSondeoModal;
  window.prevSondeoModal = prevSondeoModal;
  window.cancelSondeo = cancelSondeo;
  window.sendSondeoData = sendSondeoData;
});
