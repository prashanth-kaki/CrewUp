import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

async function loadProfile(uid){
  const { db, auth, storage } = window.__crewup;
  const targetUid = uid || auth.currentUser?.uid;
  if(!targetUid){ window.location.href='login.html'; return; }
  const docRef = doc(db,'users', targetUid);
  const snap = await getDoc(docRef);
  if(!snap.exists()) return;
  const data = snap.data();
  document.getElementById('displayName').textContent = data.displayName;
  document.getElementById('bio').textContent = data.bio || '';
  // if viewing own, show edit button
  if(auth.currentUser && auth.currentUser.uid===targetUid){
    document.getElementById('editBtn').style.display='inline-block';
    document.getElementById('editBtn').onclick = ()=> enableEditMode(data);
  }
}

function enableEditMode(current){
  document.getElementById('bioInput').value = current.bio||'';
  // show form...
  document.getElementById('saveProfile').onclick = async ()=>{
    const bio = document.getElementById('bioInput').value;
    const skills = document.getElementById('skillsInput').value.split(',').map(s=>s.trim()).filter(Boolean);
    const { db, auth, storage } = window.__crewup;
    const uid = auth.currentUser.uid;
    const udoc = doc(db,'users',uid);
    await updateDoc(udoc, { bio, skills });
    // photo upload
    const file = document.getElementById('photoInput').files[0];
    if(file){
      const path = `profile-images/${uid}`;
      const ref = sRef(storage, path);
      const task = uploadBytesResumable(ref, file);
      task.on('state_changed', null, err => alert(err.message), async ()=>{
         const url = await getDownloadURL(task.snapshot.ref);
         await updateDoc(udoc, { photoURL: url });
         await updateProfile(auth.currentUser, { photoURL: url });
      });
    }
    alert('Profile saved');
    location.reload();
  }
}

export { loadProfile };
