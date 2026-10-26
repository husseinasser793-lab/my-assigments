// ==========================================
// 1. STATE MANAGEMENT (LOCAL STORAGE)
// ==========================================

// If contacts exist in localStorage, parse them; otherwise initialize
let contactList = JSON.parse(localStorage.getItem("contacts")) || [];

// ==========================================
// 2. DOM ELEMENT SELECTION
// ==========================================

// Inputs from the modal
const contactNameInput = document.getElementById("contactName");
const contactPhoneInput = document.getElementById("contactPhone");
const contactEmailInput = document.getElementById("contactEmail");
const contactCategorySelect = document.getElementById("contactCategory");
const isFavoriteCheckbox = document.getElementById("isFavorite");
const isEmergencyCheckbox = document.getElementById("isEmergency");

// Buttons & Containers
const saveContactBtn = document.getElementById("saveContactBtn");
const contactsContainer = document.getElementById("contactsContainer");
const noContactsAlert = document.getElementById("noContactsAlert");
const searchInput = document.getElementById("searchInput");
const favoritesList = document.getElementById("favoritesList");
const emergencyList = document.getElementById("emergencyList");
const modalTitle = document.getElementById("ContactModalLabel");

// Error Messages
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");

// Stat Counters
const totalCountDisplay = document.getElementById("totalCount");
const favoritesCountDisplay = document.getElementById("favoritesCount");
const emergencyCountDisplay = document.getElementById("emergencyCount");

// Track whether we are editing an existing contact (null = adding new; number = contact ID)
let editContactId = null;

// ==========================================
// 3. REGEX VALIDATION & HELPER FUNCTIONS
// ==========================================

const REGEX_NAME = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
const REGEX_PHONE = /^(01[0125][0-9]{8}|\+?[0-9]{9,15})$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
  const nameVal = contactNameInput.value.trim();
  const isValid = REGEX_NAME.test(nameVal);
  if (!isValid) {
    nameError.classList.remove("d-none");
    contactNameInput.classList.add("is-invalid");
  } else {
    nameError.classList.add("d-none");
    contactNameInput.classList.remove("is-invalid");
  }
  return isValid;
}

function validatePhone() {
  const phoneVal = contactPhoneInput.value.trim();
  const isValid = REGEX_PHONE.test(phoneVal);
  if (!isValid) {
    phoneError.classList.remove("d-none");
    contactPhoneInput.classList.add("is-invalid");
  } else {
    phoneError.classList.add("d-none");
    contactPhoneInput.classList.remove("is-invalid");
  }
  return isValid;
}

function validateEmail() {
  const emailVal = contactEmailInput.value.trim();
  const isValid = emailVal === "" || REGEX_EMAIL.test(emailVal);
  if (!isValid) {
    emailError.classList.remove("d-none");
    contactEmailInput.classList.add("is-invalid");
  } else {
    emailError.classList.add("d-none");
    contactEmailInput.classList.remove("is-invalid");
  }
  return isValid;
}

// Live validation on typing
contactNameInput.addEventListener("input", validateName);
contactPhoneInput.addEventListener("input", validatePhone);
contactEmailInput.addEventListener("input", validateEmail);

function validateForm() {
  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isEmailValid = validateEmail();
  return isNameValid && isPhoneValid && isEmailValid;
}

// Clear form inputs and validation errors
function clearForm() {
  contactNameInput.value = "";
  contactPhoneInput.value = "";
  contactEmailInput.value = "";
  contactCategorySelect.value = "Family";
  isFavoriteCheckbox.checked = false;
  isEmergencyCheckbox.checked = false;

  contactNameInput.classList.remove("is-invalid");
  contactPhoneInput.classList.remove("is-invalid");
  contactEmailInput.classList.remove("is-invalid");
  nameError.classList.add("d-none");
  phoneError.classList.add("d-none");
  emailError.classList.add("d-none");

  editContactId = null;
  modalTitle.textContent = "Add New Contact";
  saveContactBtn.textContent = "Save Contact";
}

// Save to LocalStorage
function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contactList));
}

// Update the top counter badges & the Favorites/Emergency lists
function updateCounts() {
  totalCountDisplay.textContent = contactList.length;
  favoritesCountDisplay.textContent = contactList.filter(c => c.isFavorite).length;
  emergencyCountDisplay.textContent = contactList.filter(c => c.isEmergency).length;
  displaySpecialLists();
}

// Render Favorites & Emergency Quick-Access Cards
function displaySpecialLists() {
  // 1. Favorites List
  const favorites = contactList.filter(c => c.isFavorite);
  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="text-secondary text-center small my-2">No favorite contacts yet ⭐</p>`;
  } else {
    favoritesList.innerHTML = favorites.map(c => `
      <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded-3">
        <div>
          <strong class="d-block text-dark">${c.name}</strong>
          <small class="text-secondary">${c.phone}</small>
        </div>
        <a href="tel:${c.phone}" class="btn btn-sm btn-outline-warning rounded-pill">
          <i class="fas fa-phone"></i> Call
        </a>
      </div>
    `).join("");
  }

  // 2. Emergency List
  const emergencies = contactList.filter(c => c.isEmergency);
  if (emergencies.length === 0) {
    emergencyList.innerHTML = `<p class="text-secondary text-center small my-2">No emergency contacts yet 🩺</p>`;
  } else {
    emergencyList.innerHTML = emergencies.map(c => `
      <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded-3">
        <div>
          <strong class="d-block text-dark">${c.name}</strong>
          <small class="text-secondary">${c.phone}</small>
        </div>
        <a href="tel:${c.phone}" class="btn btn-sm btn-outline-danger rounded-pill">
          <i class="fas fa-phone"></i> Urgent Call
        </a>
      </div>
    `).join("");
  }
}

// ==========================================
// 4. ADD & EDIT CONTACT LOGIC
// ==========================================

function addContact() {
  if (!validateForm()) {
    return;
  }

  const nameVal = contactNameInput.value.trim();
  const phoneVal = contactPhoneInput.value.trim();
  const emailVal = contactEmailInput.value.trim();
  const categoryVal = contactCategorySelect.value;
  const isFav = isFavoriteCheckbox.checked;
  const isEmerg = isEmergencyCheckbox.checked;

  if (editContactId !== null) {
    // Update existing contact
    const contact = contactList.find(c => c.id === editContactId);
    if (contact) {
      contact.name = nameVal;
      contact.phone = phoneVal;
      contact.email = emailVal;
      contact.category = categoryVal;
      contact.isFavorite = isFav;
      contact.isEmergency = isEmerg;
    }

    saveContactsToStorage();
    clearForm();

    // Close modal
    const modalElement = document.getElementById("ContactModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();

    // Update screen
    updateCounts();
    searchContacts();

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Contact details updated successfully.",
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    // Create new contact
    const newContact = {
      id: Date.now(),
      name: nameVal,
      phone: phoneVal,
      email: emailVal,
      category: categoryVal,
      isFavorite: isFav,
      isEmergency: isEmerg
    };

    contactList.push(newContact);
    saveContactsToStorage();
    clearForm();

    // Close modal
    const modalElement = document.getElementById("ContactModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();

    // Update screen
    updateCounts();
    searchContacts();

    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "New contact added successfully.",
      timer: 1500,
      showConfirmButton: false
    });
  }
}

// Open modal in edit mode
function openEditModal(id) {
  const contact = contactList.find(c => c.id === id);
  if (!contact) return;

  editContactId = id;
  contactNameInput.value = contact.name;
  contactPhoneInput.value = contact.phone;
  contactEmailInput.value = contact.email || "";
  contactCategorySelect.value = contact.category;
  isFavoriteCheckbox.checked = contact.isFavorite;
  isEmergencyCheckbox.checked = contact.isEmergency;

  modalTitle.textContent = "Edit Contact";
  saveContactBtn.textContent = "Update Contact";

  const modalElement = document.getElementById("ContactModal");
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
}

// ==========================================
// 5. DISPLAY CONTACTS FUNCTION
// ==========================================

function displayContacts(list = contactList) {
  if (list.length === 0) {
    noContactsAlert.classList.remove("d-none");
    contactsContainer.innerHTML = "";
    return;
  }

  noContactsAlert.classList.add("d-none");

  let cardsHtml = "";

  for (let i = 0; i < list.length; i++) {
    const contact = list[i];

    // Badge color based on category
    let badgecolor = "bg-secondary";
    if (contact.category === "Family") badgecolor = "bg-primary";
    if (contact.category === "Friends") badgecolor = "bg-success";
    if (contact.category === "Work") badgecolor = "bg-info text-dark";

    // Colors for favorite & emergency
    const starClass = contact.isFavorite ? "bg-warning text-white" : "bg-warning-subtle text-warning";
    const emergencyClass = contact.isEmergency ? "bg-danger text-white" : "bg-danger-subtle text-danger";

    // Generate Initials (e.g., "Asser Hussein" -> "AH")
    const nameWords = contact.name.trim().split(" ").filter(w => w.length > 0);
    let initials = "";
    if (nameWords.length >= 2) {
      initials = (nameWords[0][0] + nameWords[nameWords.length - 1][0]).toUpperCase();
    } else if (nameWords.length === 1) {
      initials = nameWords[0].slice(0, 2).toUpperCase();
    }

    cardsHtml += `
    <div class="col-12 col-md-6 mb-3">
      <div class="p-3 bg-white border border-1 shadow-sm rounded-3 d-flex flex-column justify-content-between h-100">
        <div>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-3 bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1rem;">
                ${initials}
              </div>
              <div>
                <h5 class="fw-bold text-dark mb-0">${contact.name}</h5>
                <span class="badge ${badgecolor} rounded-pill">${contact.category}</span>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column gap-2 mb-3">
            <span class="d-flex align-items-center gap-2">
              <i class="fas fa-phone rounded-2 p-2 bg-info-subtle text-info"></i> ${contact.phone}
            </span>
            ${contact.email ? `
            <span class="d-flex align-items-center gap-2">
              <i class="fas far fa-envelope rounded-2 p-2 bg-primary-subtle text-primary"></i> ${contact.email}
            </span>` : ""}
          </div>
        </div>

        <div class="w-100 justify-content-between d-flex align-items-center pt-2 border-top">
          <div class="d-flex gap-2">
            <a href="tel:${contact.phone}"><i class="fas p-2 rounded-3 bg-success-subtle text-success fa-phone"></i></a>
            ${contact.email ? `<a href="mailto:${contact.email}"><i class="fas far fa-envelope rounded-2 p-2 bg-primary-subtle text-primary"></i></a>` : ""}
          </div>
          <div class="d-flex gap-2">
            <i class="fas p-2 rounded-3 fa-star ${starClass}" style="cursor: pointer;" onclick="toggleFavorite(${contact.id})"></i>
            <i class="fas p-2 rounded-3 far fa-heart ${emergencyClass}" style="cursor: pointer;" onclick="toggleEmergency(${contact.id})"></i>
            <i class="fas p-2 rounded-3 fa-pen bg-info-subtle text-info" style="cursor: pointer;" onclick="openEditModal(${contact.id})"></i>
            <i class="fas p-2 rounded-3 fa-trash bg-danger-subtle text-danger" style="cursor: pointer;" onclick="deleteContact(${contact.id})"></i>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  // Insert all cards into the container
  contactsContainer.innerHTML = cardsHtml;
}

// ==========================================
// 6. ACTION FUNCTIONS (DELETE & TOGGLES)
// ==========================================

// 1. Delete Contact with SweetAlert2
function deleteContact(id) {
  const contact = contactList.find(c => c.id === id);
  if (!contact) return;

  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete "${contact.name}"? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      contactList = contactList.filter(c => c.id !== id);
      saveContactsToStorage();
      updateCounts();
      searchContacts();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Contact removed successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

// 2. Toggle Favorite Star
function toggleFavorite(id) {
  const contact = contactList.find(c => c.id === id);
  if (!contact) return;

  contact.isFavorite = !contact.isFavorite;
  saveContactsToStorage();
  updateCounts();
  searchContacts();
}

// 3. Toggle Emergency Heart
function toggleEmergency(id) {
  const contact = contactList.find(c => c.id === id);
  if (!contact) return;

  contact.isEmergency = !contact.isEmergency;
  saveContactsToStorage();
  updateCounts();
  searchContacts();
}

// ==========================================
// 7. SEARCH FUNCTION
// ==========================================

function searchContacts() {
  const query = searchInput.value.trim().toLowerCase();

  // Filter contacts where Name, Phone, or Email matches the query
  const filteredList = contactList.filter(contact =>
    contact.name.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    (contact.email && contact.email.toLowerCase().includes(query))
  );

  displayContacts(filteredList);
}

// ==========================================
// 8. EVENT LISTENERS & INITIAL LOAD
// ==========================================

// Search on typing
searchInput.addEventListener("input", searchContacts);

// Save / Update button
saveContactBtn.addEventListener("click", addContact);

// Reset modal to Add mode when Add Contact button in navbar is clicked
const addContactNavBtn = document.querySelector('[data-bs-target="#ContactModal"]');
if (addContactNavBtn) {
  addContactNavBtn.addEventListener("click", clearForm);
}

// Initial display on page load
updateCounts();
displayContacts();
