import { doc, getDoc, collection, setDoc, serverTimestamp, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function initOpportunity(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  const { db, auth } = window.__crewup;
  const odoc = doc(db, "opportunities", id);
  const snap = await getDoc(odoc);
  if(!snap.exists()){ document.body.innerHTML='<p>Opportunity not found</p>'; return; }
  const data = snap.data();
  document.getElementById('title').textContent = data.title;
  document.getElementById('desc').textContent = data.description;
  // Join request logic
  document.getElementById('joinBtn').addEventListener('click', async ()=>{
    const user = auth.currentUser;
    if(!user){ alert('Please login to request to join'); window.location.href='login.html'; return; }
    const jrRef = doc(db, `opportunities/${id}/joinRequests`, user.uid);
    await setDoc(jrRef, {
      uid: user.uid,
      displayName: user.displayName || null,
      message: document.getElementById('joinMessage').value || '',
      createdAt: serverTimestamp()
    });
    alert('Request sent');
  });

  // If current user is owner, show join-requests live
  onSnapshot(doc(db, "opportunities", id), s => {
    const o = s.data();
    const ownerId = o.ownerId;
    const me = auth.currentUser;
    if(me && me.uid === ownerId){
      // show join requests list
      const jrColl = collection(db, `opportunities/${id}/joinRequests`);
      onSnapshot(jrColl, snapjr => {
        const list = document.getElementById('requests');
        list.innerHTML = '';
        snapjr.forEach(d => {
          const r = d.data();
          const li = document.createElement('div');
          li.className='card';
          li.innerHTML = `<strong>${r.displayName || r.uid}</strong><p>${r.message || ''}</p>`;
          const accept = document.createElement('button'); accept.textContent='Accept';
          const decline = document.createElement('button'); decline.textContent='Decline';
          accept.onclick = async ()=> {
            // Add user to teamMemberIds on opportunity
            // basic approach: update array using set with merge
            const oppRef = doc(db,"opportunities",id);
            // simpler: fetch, push, set (for demo). In production use arrayUnion
            import("https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js").then(module=>{
              const { updateDoc, arrayUnion } = module;
              updateDoc(oppRef, { teamMemberIds: arrayUnion(r.uid) });
            });
            await deleteDoc(d.ref);
          };
          decline.onclick = async ()=> await deleteDoc(d.ref);
          li.appendChild(accept); li.appendChild(decline);
          list.appendChild(li);
        });
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', initOpportunity);
