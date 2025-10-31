// opportunities.js
import { collection, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function loadOpportunities(renderFn){
  const { db } = window.__crewup;
  const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"));
  // use real-time listener
  onSnapshot(q, snapshot => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderFn(items);
  });
}

function renderGrid(container, items){
  container.innerHTML = "";
  items.forEach(op => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(op.title)}</h3>
      <p>${escapeHtml(truncate(op.description, 140))}</p>
      <p><strong>Skills:</strong> ${(op.requiredSkills||[]).join(", ")}</p>
      <a href="opportunity.html?id=${op.id}">View</a>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function truncate(s,n){ return s && s.length>n ? s.slice(0,n-1)+'…' : s; }

export { loadOpportunities, renderGrid };
