// Fake Data
let activities = [
  {
    id: 1,
    title: "Proje Toplantısı",
    type: "meeting",
    start: "2025-04-05T09:00",
    end: "2025-04-05T10:30",
    desc: "Yeni proje planlaması",
    participants: "Ali, Ayşe",
    agenda: "MVP, timeline",
    comments: [
      { user: "Ali", text: "Gündem iyi", time: "10:15" },
      { user: "Sen", text: "Teşekkürler" }
    ]
  },
  {
    id: 2,
    title: "Doktor Randevusu",
    type: "appointment",
    start: "2025-04-06T14:00",
    desc: "Genel kontrol",
    contact: "Dr. Mehmet",
    location: "Acıbadem Hastanesi",
    reminder: "1 saat önce",
    comments: []
  },
  {
    id: 3,
    title: "JavaScript Öğren",
    type: "task",
    start: "2025-04-07T18:00",
    priority: "high",
    completed: false,
    comments: []
  }
];

// Tür Renkleri
const typeColors = {
  task: '#3B82F6',
  appointment: '#10B981',
  meeting: '#F59E0B',
  event: '#EF4444',
  note: '#8B5CF6'
};

// DOM Elements
const calendarEl = document.getElementById('calendar');
const viewCalendar = document.getElementById('view-calendar');
const viewList = document.getElementById('view-list');
const btnCalendar = document.getElementById('btn-calendar');
const btnList = document.getElementById('btn-list');
const btnNew = document.getElementById('btn-new');
const modal = document.getElementById('modal');
const detailModal = document.getElementById('detail-modal');
const steps = document.querySelectorAll('.step');
const btnType = document.querySelectorAll('.btn-type');
let selectedType = null;

// FullCalendar
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: activities.map(a => ({
    id: a.id,
    title: a.title,
    start: a.start,
    end: a.end,
    backgroundColor: typeColors[a.type],
    borderColor: typeColors[a.type]
  })),
  eventClick: function(info) {
    showDetailModal(info.event.id);
  }
});
calendar.render();

// Görünümler
btnCalendar.addEventListener('click', () => {
  viewCalendar.classList.remove('hidden');
  viewList.classList.add('hidden');
});
btnList.addEventListener('click', () => {
  viewList.classList.remove('hidden');
  viewCalendar.classList.add('hidden');
  renderActivityList();
});

// Modal Aç/Kapa
btnNew.addEventListener('click', () => {
  modal.classList.remove('hidden');
  goToStep(1);
});

function closeModal() {
  modal.classList.add('hidden');
}
window.onclick = function(e) {
  if (e.target === modal) closeModal();
}

// Adım Geçişleri
function goToStep(n) {
  steps.forEach(s => s.classList.add('hidden'));
  document.getElementById(`step-${n}`).classList.remove('hidden');
}

document.querySelector('#next-to-2').addEventListener('click', () => goToStep(2));
document.getElementById('next-to-3').addEventListener('click', () => {
  goToStep(3);
  loadDynamicFields();
});
document.getElementById('next-to-4').addEventListener('click', () => {
  goToStep(4);
  generateSummary();
});

document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = [...steps].findIndex(s => !s.classList.contains('hidden')) + 1;
    goToStep(current - 1);
  });
});

// Tür Seçimi
btnType.forEach(btn => {
  btn.addEventListener('click', () => {
    btnType.forEach(b => b.classList.remove('border-indigo-500'));
    btn.classList.add('border-indigo-500');
    selectedType = btn.dataset.type;
    document.querySelector('#next-to-2').removeAttribute('disabled');
  });
});

// Dinamik Alanlar
function loadDynamicFields() {
  const container = document.getElementById('dynamic-fields');
  container.innerHTML = '';

  const fields = {
    task: `<label><input type="radio" name="priority" value="high"> Yüksek Öncelik</label>
           <label><input type="radio" name="priority" value="medium"> Orta</label>
           <label><input type="radio" name="priority" value="low"> Düşük</label>
           <input type="number" placeholder="Tahmini süre (dakika)" class="w-full p-2 border rounded mt-2">`,
    appointment: `<input type="text" placeholder="Kişi" class="w-full p-2 border rounded mb-2">
                  <input type="text" placeholder="Konum" class="w-full p-2 border rounded mb-2">
                  <input type="datetime-local" placeholder="Hatırlatma" class="w-full p-2 border rounded">`,
    meeting: `<input type="text" placeholder="Katılımcılar (virgülle ayırın)" class="w-full p-2 border rounded mb-2">
              <textarea placeholder="Gündem" class="w-full p-2 border rounded"></textarea>`,
    event: `<input type="number" placeholder="Katılımcı sayısı" class="w-full p-2 border rounded mb-2">
            <input type="text" placeholder="Konum" class="w-full p-2 border rounded">
            <input type="number" step="0.01" placeholder="Bütçe (₺)" class="w-full p-2 border rounded mt-2">`,
    note: `<select class="w-full p-2 border rounded mb-2"><option>Özel</option><option>Genel</option></select>
           <input type="text" placeholder="Etiketler (örn: iş, fikir)" class="w-full p-2 border rounded">`
  };

  container.innerHTML = fields[selectedType] || '';
}

// Özet Oluştur
function generateSummary() {
  const summary = document.getElementById('summary');
  const title = document.getElementById('title').value || "Başlıksız";
  const start = document.getElementById('start').value;
  const typeDisplay = {
    task: "Görev",
    appointment: "Randevu",
    meeting: "Toplantı",
    event: "Etkinlik",
    note: "Not"
  };

  summary.innerHTML = `
    <p><strong>Başlık:</strong> ${title}</p>
    <p><strong>Tür:</strong> ${typeDisplay[selectedType]}</p>
    <p><strong>Başlangıç:</strong> ${formatDate(start)}</p>
    <p><strong>Açıklama:</strong> ${document.getElementById('desc').value || '–'}</p>
  `;
}

// Tarih Formatlayıcı
function formatDate(datetime) {
  return new Date(datetime).toLocaleString('tr-TR');
}

// Liste Görünümü
function renderActivityList() {
  const container = document.getElementById('activity-list');
  container.innerHTML = '';
  activities.forEach(act => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded-lg shadow border-l-4 border-l-' + 
      (act.type === 'task' ? 'blue' : act.type === 'appointment' ? 'green' : 
       act.type === 'meeting' ? 'yellow' : act.type === 'event' ? 'red' : 'purple') + '-500';
    div.innerHTML = `
      <div class="flex justify-between">
        <h4 class="font-semibold">${act.title}</h4>
        <span class="text-xs text-gray-500">${act.type}</span>
      </div>
      <p class="text-sm text-gray-600 mt-1">${formatDate(act.start)}</p>
      <p class="text-sm mt-2">${act.desc || '–'}</p>
      <button onclick="showDetailModal(${act.id})" class="text-indigo-600 text-xs mt-2">Detaylar</button>
    `;
    container.appendChild(div);
  });
}

// Detay Modal
function showDetailModal(id) {
  const act = activities.find(a => a.id === id);
  if (!act) return;

  document.getElementById('detail-title').textContent = act.title;
  document.getElementById('detail-desc').textContent = act.desc || 'Açıklama yok';

  const extra = document.getElementById('detail-extra');
  extra.innerHTML = '';
  if (act.participants) extra.innerHTML += `<div><strong>Katılımcılar:</strong> ${act.participants}</div>`;
  if (act.contact) extra.innerHTML += `<div><strong>Kişi:</strong> ${act.contact}</div>`;
  if (act.location) extra.innerHTML += `<div><strong>Konum:</strong> ${act.location}</div>`;
  if (act.priority) extra.innerHTML += `<div><strong>Öncelik:</strong> ${act.priority}</div>`;

  const commentsDiv = document.getElementById('comments');
  commentsDiv.innerHTML = '';
  (act.comments || []).forEach(c => {
    const p = document.createElement('p');
    p.className = 'text-sm';
    p.innerHTML = `<strong>${c.user}:</strong> ${c.text}`;
    commentsDiv.appendChild(p);
  });

  document.getElementById('new-comment').value = '';
  document.getElementById('add-comment').onclick = () => {
    const text = document.getElementById('new-comment').value.trim();
    if (text) {
      act.comments.push({ user: 'Sen', text, time: new Date().toLocaleTimeString('tr') });
      showDetailModal(id); // Yeniden yükle
    }
  };

  detailModal.classList.remove('hidden');
}
document.getElementById('detail-modal').onclick = (e) => {
  if (e.target === detailModal) detailModal.classList.add('hidden');
};

// Kaydet
document.getElementById('save-activity').addEventListener('click', () => {
  const newAct = {
    id: activities.length + 1,
    title: document.getElementById('title').value,
    type: selectedType,
    start: document.getElementById('start').value,
    end: document.getElementById('end').value,
    desc: document.getElementById('desc').value,
    comments: []
  };
  activities.push(newAct);
  calendar.addEvent({
    id: newAct.id,
    title: newAct.title,
    start: newAct.start,
    end: newAct.end,
    backgroundColor: typeColors[newAct.type],
    borderColor: typeColors[newAct.type]
  });
  alert("Aktivite kaydedildi!");
  closeModal();
  renderActivityList();
});