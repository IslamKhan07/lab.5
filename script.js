// DOM elementləri
const profileView = document.getElementById('profile-view');
const editForm = document.getElementById('edit-form');
const resetBtn = document.getElementById('reset-btn');

// Məlumatları yüklə
let profileData = {};

async function loadProfileData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    profileData = data.profile;
    renderProfile();
    
    // LocalStorage-dan yüklə (əgər varsa)
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      profileData = JSON.parse(savedData);
      renderProfile();
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
  }
}

// Profili göstər
function renderProfile() {
  profileView.innerHTML = '';
  
  for (const [key, value] of Object.entries(profileData)) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'profile-field';
    
    const label = document.createElement('strong');
    label.textContent = `${key}: `;
    
    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    }
    
    const span = document.createElement('span');
    span.textContent = displayValue;
    span.id = `profile-${key}`;
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Düzəliş et';
    editBtn.className = 'btn edit-btn';
    editBtn.onclick = () => showEditForm(key);
    
    fieldDiv.append(label, span, editBtn);
    profileView.appendChild(fieldDiv);
  }
}

// Redaktə formasını göstər
function showEditForm(field) {
  profileView.style.display = 'none';
  editForm.style.display = 'block';
  editForm.innerHTML = '';
  
  const form = document.createElement('form');
  
  const label = document.createElement('label');
  label.textContent = field;
  label.htmlFor = `edit-${field}`;
  
  let input;
  
  if (Array.isArray(profileData[field])) {
    input = document.createElement('textarea');
    input.value = profileData[field].join('\n');
    input.rows = 5;
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.value = profileData[field];
  }
  
  input.id = `edit-${field}`;
  input.className = 'form-input';
  
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Yadda Saxla';
  saveBtn.className = 'btn save-btn';
  saveBtn.onclick = () => saveChanges(field);
  
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Ləğv et';
  cancelBtn.className = 'btn cancel-btn';
  cancelBtn.onclick = cancelEdit;
  
  form.append(label, input, saveBtn, cancelBtn);
  editForm.appendChild(form);
}

// Dəyişiklikləri yadda saxla
function saveChanges(field) {
  const input = document.getElementById(`edit-${field}`);
  
  if (Array.isArray(profileData[field])) {
    profileData[field] = input.value.split('\n').map(item => item.trim());
  } else {
    profileData[field] = input.value;
  }
  
  // LocalStorage-a yaz
  localStorage.setItem('profileData', JSON.stringify(profileData));
  
  // Yenidən render et
  cancelEdit();
  renderProfile();
}

// Redaktəni ləğv et
function cancelEdit() {
  profileView.style.display = 'block';
  editForm.style.display = 'none';
}

// Hamısını sıfırla
resetBtn.addEventListener('click', () => {
  if (confirm('Bütün dəyişikliklər silinəcək. Davam etmək istəyirsiniz?')) {
    localStorage.removeItem('profileData');
    loadProfileData();
  }
});

// Səhifə yüklənəndə məlumatları yüklə
document.addEventListener('DOMContentLoaded', loadProfileData);