// Navigation logic

const sections = {
  home: document.getElementById('home'),
  'find-donors': document.getElementById('find-donors'),
  register: document.getElementById('register')
};

// Health & Wellness section (outside main sections)
const wellnessSection = document.querySelector('section.w-full.flex.justify-center.items-center');

function showSection(sectionId) {
  Object.keys(sections).forEach(id => {
    if (id === sectionId) {
      sections[id].classList.remove('hidden');
    } else {
      sections[id].classList.add('hidden');
    }
  });
  // Show wellness cards only on Home
  if (wellnessSection) {
    if (sectionId === 'home') {
      wellnessSection.classList.remove('hidden');
    } else {
      wellnessSection.classList.add('hidden');
    }
  }
}

// Handle nav and CTA clicks
const navLinks = document.querySelectorAll('nav a, .flex a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.replace('#', '');
      showSection(sectionId || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// Find Donors form logic
const searchForm = document.getElementById('search-form');
const donorResults = document.getElementById('donor-results');
if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    donorResults.innerHTML = '<div class="text-gray-500">Searching...</div>';
    const bloodGroup = document.getElementById('search-blood-group').value;
    const location = document.getElementById('search-location').value;
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (location) params.append('location', location);
    try {
      const res = await fetch(`/api/v1/donors/search?${params.toString()}`);
      const donors = await res.json();
      if (Array.isArray(donors) && donors.length > 0) {
        donorResults.innerHTML = donors.map(donor => `
          <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="font-bold text-lg text-red-700">${donor.name}</div>
            <div class="text-gray-700">Blood Group: <span class="font-semibold">${donor.bloodGroup}</span></div>
            <div class="text-gray-700">Location: ${donor.location || 'N/A'}</div>
            <div class="text-gray-700">Contact: ${donor.contactNumber || 'N/A'}</div>
            <div class="text-gray-500 text-sm">Last Donation: ${donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'N/A'}</div>
          </div>
        `).join('');
      } else {
        donorResults.innerHTML = '<div class="text-gray-500">No donors found.</div>';
      }
    } catch (err) {
      donorResults.innerHTML = '<div class="text-red-600">Error fetching donors.</div>';
    }
  });
}

// Register as a Donor form logic
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('donor-name').value,
      bloodGroup: document.getElementById('donor-blood-group').value,
      contactNumber: document.getElementById('donor-contact').value,
      location: document.getElementById('donor-location').value,
      lastDonationDate: document.getElementById('donor-last-donation') ? document.getElementById('donor-last-donation').value : undefined
    };
    try {
      const res = await fetch('/api/v1/donors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        registerForm.reset();
        window.location.href = 'dashboard.html';
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      alert('Error registering donor.');
    }
  });
}

// Show home section by default on load
showSection('home');
