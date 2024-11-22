const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let fields = [

];
let startAngle = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// Liste der Felder aktualisieren
function updateFieldsList() {
  const fieldsList = document.getElementById('fieldsList');
  fieldsList.innerHTML = '';
  fields.forEach((field, index) => {
    const listItem = document.createElement('li');

    // Feldtext
    const text = document.createElement('span');
    text.textContent = field.text;
    text.className = field.active ? '' : 'inactive';

    // Entfernen-Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '✖';
    deleteButton.onclick = () => removeField(index);

    // Ein-/Ausblenden-Button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '👁';
    toggleButton.classList.add('toggle-button');
    toggleButton.onclick = () => toggleField(index);

    listItem.appendChild(text);
    listItem.appendChild(toggleButton);
    listItem.appendChild(deleteButton);
    fieldsList.appendChild(listItem);
  });
}

// Neues Feld hinzufügen
function addField() {
  const input = document.getElementById('newField');
  const newField = input.value.trim();
  if (newField) {
    fields.push({ text: newField, active: true });
    input.value = '';
    updateFieldsList();
    drawWheel();
  } else {
    alert('Bitte einen gültigen Eintrag hinzufügen.');
  }
}

// Feld entfernen
function removeField(index) {
  fields.splice(index, 1);
  updateFieldsList();
  drawWheel();
}

// Feld ein-/ausblenden
function toggleField(index) {
  fields[index].active = !fields[index].active;
  updateFieldsList();
  drawWheel();
}

// Glücksrad zeichnen
function drawWheel() {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FF8C33', '#33FFF6'];
  const activeFields = fields.filter(field => field.active);
  if (activeFields.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const outsideRadius = 150;
  const textRadius = 120;
  const insideRadius = 50;
  const arc = Math.PI / (activeFields.length / 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < activeFields.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(200, 200, outsideRadius, angle, angle + arc, false);
    ctx.arc(200, 200, insideRadius, angle + arc, angle, true);
    ctx.fill();
    ctx.save();

    ctx.fillStyle = '#000';
    ctx.translate(200 + Math.cos(angle + arc / 2) * textRadius, 200 + Math.sin(angle + arc / 2) * textRadius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "center";
    ctx.fillText(activeFields[i].text, 0, 0);
    ctx.restore();
  }

  // Pfeil zeichnen
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(200 - 10, 200 - 160);
  ctx.lineTo(200 + 10, 200 - 160);
  ctx.lineTo(200, 200 - 140);
  ctx.closePath();
  ctx.fill();
}

// Glücksrad drehen
function rotateWheel() {
  spinTime += 30;

  if (spinTime >= spinTimeTotal) {
    clearTimeout(spinTimeout);
    const activeFields = fields.filter(field => field.active);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = degrees % 360;
    const index = Math.floor((360 - arcd) / (360 / activeFields.length));
    const winner = activeFields[index].text;

    // Zeigt das Popup mit dem Gewinner an
    showWinnerPopup(winner);

    startConfetti(); // Konfetti starten
    return;
  }

  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

function spinWheel() {
  if (fields.filter(field => field.active).length === 0) {
    alert('Es gibt keine aktiven Felder zum Drehen.');
    return;
  }
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  rotateWheel();
}

updateFieldsList();
drawWheel();

// Popup für den Gewinner anzeigen
function showWinnerPopup(winner) {
  const winnerText = document.getElementById('winnerText');
  winnerText.textContent = `Der Gewinner ist: ${winner}`;

  const popup = document.getElementById('winnerPopup');
  popup.style.display = 'flex'; // Popup sichtbar machen
}

// Popup schließen
function closePopup() {
  const popup = document.getElementById('winnerPopup');
  popup.style.display = 'none'; // Popup ausblenden
}
