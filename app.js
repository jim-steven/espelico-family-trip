let content = null;

async function init() {
  try {
    const response = await fetch('content.json');
    content = await response.json();
    renderAll();
    setupNavigation();
    setupDetailPanel();
    setupFAQ();
  } catch (error) {
    console.error('Failed to load content:', error);
  }
}

function renderAll() {
  renderTravelers();
  renderQuickAnswers();
  renderFlights();
  renderAccommodations();
  renderItinerary();
  renderDocuments();
  renderEmployment();
  renderReturnAssurance();
  renderFAQ();
}

function renderTravelers() {
  const container = document.getElementById('travelers-list');
  if (!container) return;
  
  container.innerHTML = content.travelers.map(t => `
    <div class="traveler-item">
      <div class="traveler-avatar">${getInitials(t.name)}</div>
      <div class="traveler-info">
        <h3>${t.name}</h3>
        <p>${t.role} • ${t.employment}</p>
      </div>
    </div>
  `).join('');
}

function renderQuickAnswers() {
  const container = document.getElementById('quick-answers');
  if (!container) return;
  
  const qa = content.quickAnswers;
  const items = [
    { label: 'Purpose', value: qa.purpose, icon: 'tour' },
    { label: 'Stay', value: qa.lengthOfStay, icon: 'schedule' },
    { label: 'Accommodation', value: qa.accommodation, icon: 'hotel' },
    { label: 'Funds', value: qa.funds, icon: 'account_balance' },
    { label: 'Return', value: qa.returnTicket, icon: 'flight_land' }
  ];
  
  container.innerHTML = items.map(item => `
    <div class="quick-answer-item">
      <span class="material-icons-outlined">${item.icon}</span>
      <div>
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      </div>
    </div>
  `).join('');
}

function renderFlights() {
  const container = document.getElementById('flights-container');
  if (!container) return;
  
  container.innerHTML = content.flights.bookings.map(booking => `
    <div class="booking-card">
      <div class="booking-header">
        <div class="booking-ref">
          Booking Reference
          <strong>${booking.reference}</strong>
        </div>
        <div class="booking-status">
          <span class="material-icons-outlined">check_circle</span>
          ${booking.status}
        </div>
      </div>
      ${booking.returnNote ? `<div class="booking-note"><span class="material-icons-outlined">info</span>${booking.returnNote}</div>` : ''}
      <div class="booking-passengers">
        <span class="material-icons-outlined">person</span>
        ${booking.passengers.join(', ')}
      </div>
      ${booking.segments.map(seg => `
        <div class="flight-segment">
          <span class="segment-type ${seg.type}">${seg.type === 'outbound' ? 'Outbound Flight' : 'Return Flight'}</span>
          <div class="flight-route">
            <div class="flight-point departure">
              <div class="flight-time">${seg.departure}</div>
              <div class="flight-city">${seg.from.code} - ${seg.from.name}</div>
              <div class="flight-terminal">${seg.from.terminal}</div>
            </div>
            <div class="flight-arrow">
              <span class="flight-number">${seg.flightNumber}</span>
              <span class="material-icons-outlined">arrow_forward</span>
              <span class="flight-number">${seg.airline}</span>
            </div>
            <div class="flight-point arrival">
              <div class="flight-time">${seg.arrival}</div>
              <div class="flight-city">${seg.to.code} - ${seg.to.name}</div>
              <div class="flight-terminal">${seg.to.terminal}</div>
            </div>
          </div>
          <div class="flight-date">
            <span class="material-icons-outlined">event</span>
            ${seg.date}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function renderAccommodations() {
  const container = document.getElementById('accommodations-container');
  if (!container) return;
  
  container.innerHTML = `<div class="accommodation-grid">
    ${content.accommodations.map(acc => `
      <div class="accommodation-card" onclick="openAccommodationDetail('${acc.id}')">
        <img class="accommodation-image" src="${acc.image}" alt="${acc.name}" onerror="this.style.display='none'">
        <div class="accommodation-content">
          <span class="accommodation-country ${acc.country.toLowerCase()}">${acc.country}</span>
          <h3 class="accommodation-name">${acc.name}</h3>
          <div class="accommodation-address">
            <span class="material-icons-outlined">location_on</span>
            <span>${acc.address}</span>
          </div>
          <div class="accommodation-dates">
            <span class="material-icons-outlined">date_range</span>
            ${acc.checkIn} → ${acc.checkOut}
          </div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

function renderItinerary() {
  const container = document.getElementById('itinerary-container');
  if (!container) return;
  
  container.innerHTML = content.itinerary.map((day, index) => `
    <div class="itinerary-day" onclick="openItineraryDetail(${index})">
      <div class="itinerary-card">
        <div class="itinerary-date">Day ${day.day} • ${day.date}</div>
        <h3 class="itinerary-title">${day.title}</h3>
        <div class="itinerary-location">
          <span class="material-icons-outlined">location_on</span>
          ${day.location}
        </div>
        <ul class="itinerary-items">
          ${day.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function renderDocuments() {
  const container = document.getElementById('documents-container');
  if (!container) return;
  
  container.innerHTML = content.documents.categories.map(cat => `
    <div class="document-category">
      <h3 class="category-header">
        <span class="material-icons-outlined">${cat.icon}</span>
        ${cat.name}
      </h3>
      <div class="document-list">
        ${cat.files.map(file => `
          <div class="document-item ${file.file ? 'has-file' : 'no-file'}">
            <div class="document-icon ${file.type}">
              <span class="material-icons-outlined">${file.type === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
            </div>
            <div class="document-info">
              <div class="document-name">${file.name}</div>
              <div class="document-desc">${file.description}</div>
            </div>
            <div class="document-actions">
              ${file.file ? `
                <a href="${file.file}" target="_blank" class="doc-btn" title="View">
                  <span class="material-icons-outlined">visibility</span>
                </a>
                <a href="${file.file}" download class="doc-btn" title="Download">
                  <span class="material-icons-outlined">download</span>
                </a>
              ` : `
                <span class="doc-btn disabled" title="Not uploaded">
                  <span class="material-icons-outlined">hourglass_empty</span>
                </span>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  const fundsStatement = document.getElementById('funds-statement');
  if (fundsStatement) {
    fundsStatement.textContent = content.proofOfFunds.statement;
  }
  
  const fundsNote = document.getElementById('funds-note');
  if (fundsNote) {
    fundsNote.textContent = content.proofOfFunds.note;
  }
}

function renderEmployment() {
  const container = document.getElementById('employment-container');
  if (!container) return;
  
  container.innerHTML = content.employment.map(emp => `
    <div class="employment-card">
      <div class="employment-header">
        <div class="employment-avatar">${getInitials(emp.traveler)}</div>
        <div class="employment-info">
          <h3>${emp.traveler}</h3>
          <span class="employment-status">${emp.status}</span>
        </div>
      </div>
      <p class="employment-desc">${emp.description}</p>
      <div class="employment-docs">
        ${emp.documents.map(doc => `
          <span class="employment-doc-tag">
            <span class="material-icons-outlined">description</span>
            ${doc}
          </span>
        `).join('')}
      </div>
      ${emp.notes ? `<p class="employment-notes">${emp.notes}</p>` : ''}
    </div>
  `).join('');
}

function renderReturnAssurance() {
  const statement = document.getElementById('return-statement');
  if (statement) {
    statement.textContent = content.returnAssurance.statement;
  }
  
  const flightsContainer = document.getElementById('return-flights');
  if (flightsContainer) {
    flightsContainer.innerHTML = content.returnAssurance.returnFlights.map(rf => `
      <div class="return-flight-item">
        <span class="material-icons-outlined">flight_land</span>
        <span class="name">${rf.traveler}</span>
        <span class="date">${rf.date} • ${rf.flight}${rf.reason ? ` <em>(${rf.reason})</em>` : ''}</span>
      </div>
    `).join('');
  }
  
  const tiesList = document.getElementById('ties-list');
  if (tiesList) {
    tiesList.innerHTML = content.returnAssurance.ties.map(tie => `<li>${tie}</li>`).join('');
  }
}

function renderFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  
  container.innerHTML = content.faq.map((item, index) => `
    <div class="faq-item" data-index="${index}">
      <div class="faq-question">
        <span class="material-icons-outlined">help_outline</span>
        ${item.question}
        <span class="material-icons-outlined icon-expand">expand_more</span>
      </div>
      <div class="faq-answer">${formatFAQAnswer(item.answer)}</div>
    </div>
  `).join('');
}

function formatFAQAnswer(answer) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return answer.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  
  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-section');
      
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
      
      nav.classList.remove('open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function setupDetailPanel() {
  const overlay = document.getElementById('detail-overlay');
  const panel = document.getElementById('detail-panel');
  const closeBtn = document.getElementById('detail-close');
  
  const closePanel = () => {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  overlay?.addEventListener('click', closePanel);
  closeBtn?.addEventListener('click', closePanel);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });
}

function openDetailPanel(heroContent, detailContent) {
  const overlay = document.getElementById('detail-overlay');
  const panel = document.getElementById('detail-panel');
  const heroEl = document.getElementById('detail-hero');
  const contentEl = document.getElementById('detail-content');
  
  heroEl.innerHTML = heroContent;
  contentEl.innerHTML = detailContent;
  
  overlay.classList.add('open');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openAccommodationDetail(accId) {
  const acc = content.accommodations.find(a => a.id === accId);
  if (!acc) return;
  
  const heroContent = acc.image ? `<img src="${acc.image}" alt="${acc.name}">` : '';
  
  const detailContent = `
    <h2 class="detail-title">${acc.name}</h2>
    <p class="detail-subtitle">${acc.type} in ${acc.city}, ${acc.country}</p>
    
    <div class="detail-actions">
      ${acc.mapUrl ? `<a href="${acc.mapUrl}" target="_blank" class="detail-action">
        <span class="material-icons-outlined">map</span>
        Open Map
      </a>` : ''}
      <button class="detail-action" onclick="copyToClipboard('${acc.address}')">
        <span class="material-icons-outlined">content_copy</span>
        Copy Address
      </button>
      ${acc.phone ? `<a href="tel:${acc.phone}" class="detail-action">
        <span class="material-icons-outlined">call</span>
        Call
      </a>` : ''}
      <button class="detail-action" onclick="shareItem('${acc.name}', '${acc.address}')">
        <span class="material-icons-outlined">share</span>
        Share
      </button>
    </div>
    
    <ul class="detail-info-list">
      <li class="detail-info-item">
        <span class="material-icons-outlined">location_on</span>
        <div class="info-content">
          <span class="info-label">Address</span>
          <span class="info-value">${acc.address}</span>
        </div>
      </li>
      <li class="detail-info-item">
        <span class="material-icons-outlined">login</span>
        <div class="info-content">
          <span class="info-label">Check-in</span>
          <span class="info-value">${acc.checkIn}</span>
        </div>
      </li>
      <li class="detail-info-item">
        <span class="material-icons-outlined">logout</span>
        <div class="info-content">
          <span class="info-label">Check-out</span>
          <span class="info-value">${acc.checkOut}</span>
        </div>
      </li>
      ${acc.confirmationCode ? `
      <li class="detail-info-item">
        <span class="material-icons-outlined">confirmation_number</span>
        <div class="info-content">
          <span class="info-label">Confirmation Code</span>
          <span class="info-value">${acc.confirmationCode}</span>
        </div>
      </li>` : ''}
      ${acc.host ? `
      <li class="detail-info-item">
        <span class="material-icons-outlined">person</span>
        <div class="info-content">
          <span class="info-label">Host</span>
          <span class="info-value">${acc.host}</span>
        </div>
      </li>` : ''}
      ${acc.phone ? `
      <li class="detail-info-item">
        <span class="material-icons-outlined">phone</span>
        <div class="info-content">
          <span class="info-label">Phone</span>
          <span class="info-value">${acc.phone}</span>
        </div>
      </li>` : ''}
      ${acc.guests ? `
      <li class="detail-info-item">
        <span class="material-icons-outlined">group</span>
        <div class="info-content">
          <span class="info-label">Guests</span>
          <span class="info-value">${acc.guests} guests</span>
        </div>
      </li>` : ''}
      ${acc.notes ? `
      <li class="detail-info-item">
        <span class="material-icons-outlined">notes</span>
        <div class="info-content">
          <span class="info-label">Notes</span>
          <span class="info-value">${acc.notes}</span>
        </div>
      </li>` : ''}
    </ul>
  `;
  
  openDetailPanel(heroContent, detailContent);
}

function openItineraryDetail(index) {
  const day = content.itinerary[index];
  if (!day) return;
  
  const heroContent = `<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2c5282 0%, #38a169 100%); color: white;">
    <div style="text-align: center;">
      <div style="font-size: 3rem; font-weight: 700;">Day ${day.day}</div>
      <div style="font-size: 1.1rem; opacity: 0.9;">${day.date}</div>
    </div>
  </div>`;
  
  const detailContent = `
    <h2 class="detail-title">${day.title}</h2>
    <p class="detail-subtitle">${day.location}</p>
    
    <div class="detail-actions">
      <button class="detail-action" onclick="copyToClipboard('${day.location}')">
        <span class="material-icons-outlined">content_copy</span>
        Copy Location
      </button>
      <a href="https://maps.google.com/?q=${encodeURIComponent(day.location)}" target="_blank" class="detail-action">
        <span class="material-icons-outlined">map</span>
        Open Map
      </a>
    </div>
    
    <ul class="detail-info-list">
      <li class="detail-info-item">
        <span class="material-icons-outlined">event</span>
        <div class="info-content">
          <span class="info-label">Date</span>
          <span class="info-value">${day.date}</span>
        </div>
      </li>
      <li class="detail-info-item">
        <span class="material-icons-outlined">location_on</span>
        <div class="info-content">
          <span class="info-label">Location</span>
          <span class="info-value">${day.location}</span>
        </div>
      </li>
      <li class="detail-info-item">
        <span class="material-icons-outlined">checklist</span>
        <div class="info-content">
          <span class="info-label">Activities</span>
          <span class="info-value">
            <ul style="margin-top: 0.5rem; padding-left: 1rem;">
              ${day.items.map(item => `<li style="margin-bottom: 0.35rem;">${item}</li>`).join('')}
            </ul>
          </span>
        </div>
      </li>
    </ul>
  `;
  
  openDetailPanel(heroContent, detailContent);
}

function setupFAQ() {
  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (question) {
      const faqItem = question.parentElement;
      faqItem.classList.toggle('open');
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch(() => {
    console.error('Failed to copy');
  });
}

function shareItem(title, text) {
  if (navigator.share) {
    navigator.share({ title, text }).catch(console.error);
  } else {
    copyToClipboard(text);
  }
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', init);
