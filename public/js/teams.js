import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

function initTeam(teamId){
  const { db, storage, auth } = window.__crewup;
  const messagesRef = collection(db, `teams/${teamId}/messages`);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  onSnapshot(q, snap => {
    const el = document.getElementById('messages');
    el.innerHTML = '';
    snap.forEach(d=>{
      const m = d.data();
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<small>${m.displayName||m.uid} • ${new Date(m.createdAt?.toDate?.()||Date.now()).toLocaleString()}</small><p>${m.text}</p>`;
      el.appendChild(div);
    });
  });

  document.getElementById('sendBtn').addEventListener('click', async ()=>{
    const text = document.getElementById('messageInput').value.trim();
    const user = auth.currentUser;
    if(!user || !text) return;
    await addDoc(messagesRef, {
      uid: user.uid,
      displayName: user.displayName || null,
      text,
      createdAt: serverTimestamp()
    });
    document.getElementById('messageInput').value = '';
  });

  // file upload
  document.getElementById('fileInput').addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const fname = file.name;
    const path = `project-files/${teamId}/${fname}`;
    const storageRef = sRef(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
      snapshot => { /* could show progress */ },
      err => alert('Upload error: '+err.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        // write metadata
        const filesColl = collection(db, `teams/${teamId}/files`);
        await addDoc(filesColl, {
          name: fname,
          url,
          uploaderId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        });
        alert('File uploaded');
      }
    );
  });

  // show files list live
  const filesColl = collection(db, `teams/${teamId}/files`);
  onSnapshot(filesColl, snap => {
    const el = document.getElementById('files');
    el.innerHTML = '';
    snap.forEach(d => {
      const f = d.data();
      const a = document.createElement('a');
      a.href = f.url; a.target='_blank';
      a.textContent = f.name;
      el.appendChild(a);
      el.appendChild(document.createElement('br'));
    });
  });
}

export { initTeam };
