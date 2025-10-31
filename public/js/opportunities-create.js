import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

async function addOpportunity(e){
  e.preventDefault();
  const { db, auth } = window.__crewup;
  const user = auth.currentUser;
  if(!user){ alert("Please login to create an opportunity."); window.location.href='login.html'; return; }

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const roles = document.getElementById('roles').value.split(',').map(s=>s.trim()).filter(Boolean);
  const skills = document.getElementById('skills').value.split(',').map(s=>s.trim()).filter(Boolean);

  try{
    const docRef = await addDoc(collection(db, "opportunities"), {
      title,
      description,
      ownerId: user.uid,
      roles,
      requiredSkills: skills,
      teamMemberIds: [user.uid],
      createdAt: serverTimestamp()
    });
    window.location.href = `opportunity.html?id=${docRef.id}`;
  }catch(err){ alert(err.message); }
}

export { addOpportunity };
