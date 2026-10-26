/**
 * ==============================================================================
 * ContactHub - Smart Contact Manager
 * JavaScript Implementation Guide & Logic
 * ==============================================================================
 * This script demonstrates:
 * 1. State Management with LocalStorage
 * 2. CRUD Operations (Create, Read, Update, Delete)
 * 3. Base64 Avatar Upload using FileReader API
 * 4. Regex Form Validation
 * 5. Real-Time Search Filtering
 * 6. SweetAlert2 Confirmation Dialogs
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. Initial State & Default Contacts
// ------------------------------------------------------------------------------
const DEFAULT_CONTACTS = [
  {
    id: "contact_1729500000_101",
    name: "Ahmed Hassan",
    phone: "01012345678",
    email: "ahmed.hassan@example.com",
    address: "Nasr City, Cairo",
    group: "work",
    notes: "Senior Frontend Lead & mentor.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    isFavorite: true,
    isEmergency: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "contact_1729500000_102",
    name: "Nouran Mansour",
    phone: "01123456789",
    email: "nouran.m@gmail.com",
    address: "Maadi, Cairo",
    group: "family",
    notes: "Sister - Call in case of urgent matters.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    isFavorite: true,
    isEmergency: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "contact_1729500000_103",
    name: "Dr. Mostafa Kamel",
    phone: "01234567890",
    email: "dr.kamel@clinic.eg",
    address: "Mohandessin, Giza",
    group: "other",
    notes: "Family Doctor - Available 24/7.",
    avatar: "",
    isFavorite: false,
    isEmergency: true,
    createdAt: new Date().toISOString()
  }
];

let contacts = [];
let currentSearchQuery = "";

// ------------------------------------------------------------------------------
// 2. DOM Elements Selection
// ------------------------------------------------------------------------------
const totalCountDisplay = document.getElementById("totalCountDisplay");
const favoritesCountDisplay = document.getElementById("favoritesCountDisplay");
const emergencyCountDisplay = document.getElementById("emergencyCountDisplay");

const contactsContainer = document.getElementById("contactsContainer");
const emptyState = document.getElementById("emptyState");
const favoritesList = document.getElementById("favoritesList");
const emergencyList = document.getElementById("emergencyList");
const searchInput = document.getElementById("searchInput");

// Modal Elements
const contactModal = document.getElementById("contactModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const openAddContactBtn = document.getElementById("openAddContactBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

// Form Elements
const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const contactNameInput = document.getElementById("contactName");
const contactPhoneInput = document.getElementById("contactPhone");
const contactEmailInput = document.getElementById("contactEmail");
const contactAddressInput = document.getElementById("contactAddress");
const contactGroupSelect = document.getElementById("contactGroup");
const contactNotesTextarea = document.getElementById("contactNotes");
const contactFavoriteCheckbox = document.getElementById("contactFavorite");
const contactEmergencyCheckbox = document.getElementById("contactEmergency");

// Avatar Elements
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const avatarBase64Input = document.getElementById("avatarBase64");

// Error Label Elements
const contactNameError = document.getElementById("contactNameError");
const contactPhoneError = document.getElementById("contactPhoneError");
const contactEmailError = document.getElementById("contactEmailError");

// ------------------------------------------------------------------------------
// 3. LocalStorage Persistence
// ------------------------------------------------------------------------------
function loadContactsFromStorage() {
  const storedData = localStorage.getItem("contacthub_contacts");
  if (storedData) {
    try {
      contacts = JSON.parse(storedData);
    } catch (e) {
      contacts = DEFAULT_CONTACTS;
    }
  } else {
    // First time visitor: seed default demo contacts
    contacts = [...DEFAULT_CONTACTS];
    saveContactsToStorage();
  }
}

function saveContactsToStorage() {
  localStorage.setItem("contacthub_contacts", JSON.stringify(contacts));
}

// ------------------------------------------------------------------------------
// 4. Avatar & Color Utilities
// ------------------------------------------------------------------------------

/**
 * Extracts initials from contact name (e.g., "Sara Ahmed" -> "SA")
 */
function getInitials(name) {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase();
}

/**
 * Returns dynamic gradient colors based on string character codes
 */
function getGradientByName(name) {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-pink-600"
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
}

/**
 * Generates avatar HTML (Image if exists, otherwise initial initials pill)
 */
function renderAvatarHTML(contact, size = "large") {
  const dim = size === "large" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  const rounded = size === "large" ? "rounded-2xl" : "rounded-xl";

  if (contact.avatar) {
    return `
      <img src="${contact.avatar}" alt="${contact.name}" class="${dim} ${rounded} object-cover shadow-sm shrink-0" />
    `;
  }

  const initials = getInitials(contact.name);
  const gradient = getGradientByName(contact.name);

  return `
    <div class="${dim} ${rounded} bg-gradient-to-br ${gradient} text-white font-bold flex items-center justify-center shadow-sm shrink-0">
      ${initials}
    </div>
  `;
}

/**
 * Group badge colors
 */
function getGroupBadge(group) {
  if (!group) return "";
  const styles = {
    family: "bg-blue-50 text-blue-700 border-blue-200",
    friends: "bg-emerald-50 text-emerald-700 border-emerald-200",
    work: "bg-purple-50 text-purple-700 border-purple-200",
    school: "bg-amber-50 text-amber-700 border-amber-200",
    other: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const style = styles[group.toLowerCase()] || styles.other;
  return `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${style}">
      ${group}
    </span>
  `;
}

// ------------------------------------------------------------------------------
// 5. Validation Rules (Regex)
// ------------------------------------------------------------------------------
const REGEX_NAME = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/; // Supports English and Arabic characters
const REGEX_PHONE = /^(01[0125][0-9]{8}|\+?[0-9]{9,15})$/; // Egyptian format or valid 9-15 digit phone
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
  const value = contactNameInput.value.trim();
  const isValid = REGEX_NAME.test(value);
  contactNameError.classList.toggle("hidden", isValid);
  contactNameInput.classList.toggle("border-rose-500", !isValid);
  return isValid;
}

function validatePhone() {
  const value = contactPhoneInput.value.trim();
  const isValid = REGEX_PHONE.test(value);
  contactPhoneError.classList.toggle("hidden", isValid);
  contactPhoneInput.classList.toggle("border-rose-500", !isValid);
  return isValid;
}

function validateEmail() {
  const value = contactEmailInput.value.trim();
  if (!value) {
    contactEmailError.classList.add("hidden");
    contactEmailInput.classList.remove("border-rose-500");
    return true; // Email is optional
  }
  const isValid = REGEX_EMAIL.test(value);
  contactEmailError.classList.toggle("hidden", isValid);
  contactEmailInput.classList.toggle("border-rose-500", !isValid);
  return isValid;
}

// Real-time live validation on input typing
contactNameInput.addEventListener("input", validateName);
contactPhoneInput.addEventListener("input", validatePhone);
contactEmailInput.addEventListener("input", validateEmail);

// ------------------------------------------------------------------------------
// 6. Rendering UI (Cards, Sidebars, Counters)
// ------------------------------------------------------------------------------

/**
 * Recalculate stats numbers
 */
function updateCounters() {
  const total = contacts.length;
  const favorites = contacts.filter((c) => c.isFavorite).length;
  const emergency = contacts.filter((c) => c.isEmergency).length;

  totalCountDisplay.textContent = total;
  favoritesCountDisplay.textContent = favorites;
  emergencyCountDisplay.textContent = emergency;
}

/**
 * Render the main contact list
 */
function renderContactsGrid() {
  // Filter by search query if active
  let list = contacts;
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    list = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }

  // Handle empty state
  if (list.length === 0) {
    contactsContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Render cards
  contactsContainer.innerHTML = list
    .map((c) => {
      const avatarHTML = renderAvatarHTML(c, "large");
      const groupBadge = getGroupBadge(c.group);

      const favIcon = c.isFavorite
        ? `<i class="fa-solid fa-star text-amber-400"></i>`
        : `<i class="fa-regular fa-star text-gray-400 hover:text-amber-400"></i>`;

      const emergencyIcon = c.isEmergency
        ? `<i class="fa-solid fa-heart-pulse text-rose-500"></i>`
        : `<i class="fa-regular fa-heart text-gray-400 hover:text-rose-500"></i>`;

      return `
        <div class="contact-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <!-- Top Card Header: Avatar & Info & Action Badges -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="relative">
                  ${avatarHTML}
                  ${
                    c.isEmergency
                      ? `<div title="Emergency Contact" class="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center ring-2 ring-white text-white text-[9px]">
                          <i class="fa-solid fa-heart-pulse"></i>
                         </div>`
                      : ""
                  }
                </div>
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-gray-900 truncate">${c.name}</h3>
                  <div class="flex flex-wrap items-center gap-1.5 mt-1">
                    ${groupBadge}
                    ${
                      c.isEmergency
                        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                             <i class="fa-solid fa-heart-pulse text-[9px]"></i>Emergency
                           </span>`
                        : ""
                    }
                  </div>
                </div>
              </div>

              <!-- Star Favorite Toggle -->
              <button
                onclick="toggleFavorite('${c.id}')"
                class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                title="${c.isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
              >
                ${favIcon}
              </button>
            </div>

            <!-- Contact Details -->
            <div class="space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-3">
              <div class="flex items-center gap-2.5 truncate">
                <div class="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-phone text-violet-600 text-xs"></i>
                </div>
                <a href="tel:${c.phone}" class="hover:text-violet-600 transition-colors font-medium">${c.phone}</a>
              </div>

              ${
                c.email
                  ? `
                <div class="flex items-center gap-2.5 truncate">
                  <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-envelope text-blue-600 text-xs"></i>
                  </div>
                  <a href="mailto:${c.email}" class="hover:text-violet-600 transition-colors truncate">${c.email}</a>
                </div>`
                  : ""
              }

              ${
                c.address
                  ? `
                <div class="flex items-center gap-2.5 truncate">
                  <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-location-dot text-emerald-600 text-xs"></i>
                  </div>
                  <span class="truncate">${c.address}</span>
                </div>`
                  : ""
              }

              ${
                c.notes
                  ? `
                <p class="text-xs text-gray-400 italic bg-gray-50/70 p-2 rounded-lg mt-1 line-clamp-2">
                  "${c.notes}"
                </p>`
                  : ""
              }
            </div>
          </div>

          <!-- Card Bottom Action Bar -->
          <div class="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-gray-100">
            <div class="flex items-center gap-1.5">
              <!-- Call -->
              <a
                href="tel:${c.phone}"
                title="Call"
                class="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                <i class="fa-solid fa-phone"></i>
              </a>

              <!-- Toggle Emergency -->
              <button
                onclick="toggleEmergency('${c.id}')"
                title="${c.isEmergency ? 'Remove from emergency' : 'Mark as emergency'}"
                class="w-8 h-8 rounded-lg bg-gray-50 hover:bg-rose-50 flex items-center justify-center transition-colors text-xs cursor-pointer"
              >
                ${emergencyIcon}
              </button>
            </div>

            <!-- Edit & Delete -->
            <div class="flex items-center gap-1.5">
              <button
                onclick="openEditModal('${c.id}')"
                class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600 flex items-center justify-center transition-colors text-xs cursor-pointer"
                title="Edit Contact"
              >
                <i class="fa-solid fa-pen"></i>
              </button>

              <button
                onclick="confirmDeleteContact('${c.id}')"
                class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors text-xs cursor-pointer"
                title="Delete Contact"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Render Sidebar Quick-Lists (Favorites & Emergency)
 */
function renderSidebarLists() {
  const favorites = contacts.filter((c) => c.isFavorite);
  const emergency = contacts.filter((c) => c.isEmergency);

  // Favorites Panel
  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">No favorite contacts yet</p>`;
  } else {
    favoritesList.innerHTML = favorites
      .map(
        (c) => `
        <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-2.5 min-w-0">
            ${renderAvatarHTML(c, "small")}
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">${c.name}</p>
              <p class="text-[11px] text-gray-500 truncate">${c.phone}</p>
            </div>
          </div>
          <a href="tel:${c.phone}" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center text-xs transition-colors shrink-0">
            <i class="fa-solid fa-phone"></i>
          </a>
        </div>
      `
      )
      .join("");
  }

  // Emergency Panel
  if (emergency.length === 0) {
    emergencyList.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">No emergency contacts yet</p>`;
  } else {
    emergencyList.innerHTML = emergency
      .map(
        (c) => `
        <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-2.5 min-w-0">
            ${renderAvatarHTML(c, "small")}
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">${c.name}</p>
              <p class="text-[11px] text-rose-500 font-medium truncate">${c.phone}</p>
            </div>
          </div>
          <a href="tel:${c.phone}" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs transition-colors shrink-0">
            <i class="fa-solid fa-phone-flip"></i>
          </a>
        </div>
      `
      )
      .join("");
  }
}

/**
 * Master render function that refreshes everything
 */
function renderAll() {
  updateCounters();
  renderContactsGrid();
  renderSidebarLists();
}

// ------------------------------------------------------------------------------
// 7. Modal Handlers & Avatar Image Reader
// ------------------------------------------------------------------------------

function openAddModal() {
  modalTitle.textContent = "Add New Contact";
  contactForm.reset();
  contactIdInput.value = "";
  avatarBase64Input.value = "";
  avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;

  // Hide validation errors
  contactNameError.classList.add("hidden");
  contactPhoneError.classList.add("hidden");
  contactEmailError.classList.add("hidden");
  contactNameInput.classList.remove("border-rose-500");
  contactPhoneInput.classList.remove("border-rose-500");
  contactEmailInput.classList.remove("border-rose-500");

  contactModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  contactNameInput.focus();
}

function openEditModal(id) {
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;

  modalTitle.textContent = "Edit Contact";
  contactIdInput.value = contact.id;
  contactNameInput.value = contact.name;
  contactPhoneInput.value = contact.phone;
  contactEmailInput.value = contact.email || "";
  contactAddressInput.value = contact.address || "";
  contactGroupSelect.value = contact.group || "";
  contactNotesTextarea.value = contact.notes || "";
  contactFavoriteCheckbox.checked = !!contact.isFavorite;
  contactEmergencyCheckbox.checked = !!contact.isEmergency;
  avatarBase64Input.value = contact.avatar || "";

  // Set avatar preview
  if (contact.avatar) {
    avatarPreview.innerHTML = `<img src="${contact.avatar}" class="w-full h-full object-cover rounded-2xl" />`;
  } else {
    avatarPreview.innerHTML = `<span class="text-2xl">${getInitials(contact.name)}</span>`;
  }

  // Clear errors
  contactNameError.classList.add("hidden");
  contactPhoneError.classList.add("hidden");
  contactEmailError.classList.add("hidden");
  contactNameInput.classList.remove("border-rose-500");
  contactPhoneInput.classList.remove("border-rose-500");
  contactEmailInput.classList.remove("border-rose-500");

  contactModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  contactNameInput.focus();
}

function closeModal() {
  contactModal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Convert uploaded picture to Base64 data string
avatarInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    // Check if file is image and <= 2MB
    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid File", "Please select an image file (PNG, JPG, WebP)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      avatarBase64Input.value = event.target.result;
      avatarPreview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded-2xl" />`;
    };
    reader.readAsDataURL(file);
  }
});

// Modal open/close listeners
openAddContactBtn.addEventListener("click", openAddModal);
emptyAddBtn.addEventListener("click", openAddModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

// Close on Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !contactModal.classList.contains("hidden")) {
    closeModal();
  }
});

// ------------------------------------------------------------------------------
// 8. CRUD Operations
// ------------------------------------------------------------------------------

/**
 * Handle form submission (Create or Update)
 */
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isEmailValid = validateEmail();

  if (!isNameValid || !isPhoneValid || !isEmailValid) {
    return;
  }

  const editId = contactIdInput.value;
  const contactData = {
    name: contactNameInput.value.trim(),
    phone: contactPhoneInput.value.trim(),
    email: contactEmailInput.value.trim(),
    address: contactAddressInput.value.trim(),
    group: contactGroupSelect.value,
    notes: contactNotesTextarea.value.trim(),
    avatar: avatarBase64Input.value,
    isFavorite: contactFavoriteCheckbox.checked,
    isEmergency: contactEmergencyCheckbox.checked
  };

  if (editId) {
    // UPDATE existing contact
    const index = contacts.findIndex((c) => c.id === editId);
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...contactData
      };
      saveContactsToStorage();
      renderAll();
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact details updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });
    }
  } else {
    // CREATE new contact
    const newContact = {
      id: `contact_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...contactData,
      createdAt: new Date().toISOString()
    };
    contacts.unshift(newContact);
    saveContactsToStorage();
    renderAll();
    closeModal();
    Swal.fire({
      icon: "success",
      title: "Contact Added!",
      text: `${newContact.name} has been added to your contacts.`,
      timer: 1500,
      showConfirmButton: false
    });
  }
});

/**
 * Quick toggle Favorite status
 */
window.toggleFavorite = function (id) {
  const contact = contacts.find((c) => c.id === id);
  if (contact) {
    contact.isFavorite = !contact.isFavorite;
    saveContactsToStorage();
    renderAll();
  }
};

/**
 * Quick toggle Emergency status
 */
window.toggleEmergency = function (id) {
  const contact = contacts.find((c) => c.id === id);
  if (contact) {
    contact.isEmergency = !contact.isEmergency;
    saveContactsToStorage();
    renderAll();
  }
};

/**
 * Delete Contact with SweetAlert2 Confirmation
 */
window.confirmDeleteContact = function (id) {
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;

  Swal.fire({
    title: `Delete ${contact.name}?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7c3aed",
    cancelButtonColor: "#f43f5e",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      contacts = contacts.filter((c) => c.id !== id);
      saveContactsToStorage();
      renderAll();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Contact has been removed.",
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
};

// ------------------------------------------------------------------------------
// 9. Search Bar Filter
// ------------------------------------------------------------------------------
searchInput.addEventListener("input", function (e) {
  currentSearchQuery = e.target.value.trim();
  renderContactsGrid();
});

// ------------------------------------------------------------------------------
// 10. Initialization
// ------------------------------------------------------------------------------
loadContactsFromStorage();
renderAll();
