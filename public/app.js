const auth = firebase.auth()
const db = firebase.firestore()

// Elements
const elements = {
  whenSignedIn: document.getElementById('whenSignedIn'),
  whenSignedOut: document.getElementById('whenSignedOut'),
  signInBtn: document.getElementById('signInBtn'),
  signOutBtn: document.getElementById('signOutBtn'),
  userDetails: document.getElementById('userDetails'),
  tableHeaders: document.querySelectorAll('th'),
  partnerModal: $('#partnerModal'),
  partnerForm: document.getElementById('partnerForm'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
  sectorFilter: document.getElementById('sectorFilter'),
  addPartnerBtn: document.getElementById('addPartnerBtn'),
  submitPartnerBtn: document.getElementById('submitPartnerBtn'),
  resetBtn: document.getElementById('resetBtn'),
  thingsList: document.getElementById('thingsList')
}

// Firestore reference
const dbReference = db.collection('partners')

// Sorting variables
let currentSortColumn = 'name'
let currentSortDirection = 'asc'

// Firebase Auth & Providers
const provider = new firebase.auth.GoogleAuthProvider()

// Event listeners
elements.signInBtn.onclick = () => auth.signInWithRedirect(provider)
elements.signOutBtn.onclick = () => auth.signOut().then(location.reload())
elements.addPartnerBtn.addEventListener('click', () => elements.partnerModal.modal('show'))
elements.partnerModal.on('hidden.bs.modal', () => elements.partnerForm.reset())
elements.submitPartnerBtn.addEventListener('click', handleFormSubmission)
elements.resetBtn.addEventListener('click', handleReset)
elements.typeFilter.addEventListener('change', doesInputExist)
elements.sectorFilter.addEventListener('change', doesInputExist)
elements.searchInput.addEventListener('input', doesInputExist)
elements.tableHeaders.forEach(header => header.addEventListener('click', handleSorting))
elements.thingsList.addEventListener('click', handleListClick)

// Authentication state change
auth.onAuthStateChanged(user => {
  elements.whenSignedIn.hidden = !user
  elements.whenSignedOut.hidden = user
  elements.userDetails.innerHTML = user ? `${user.displayName}` : ''
})

// Render partners
const renderPartners = partners => {
  elements.thingsList.innerHTML = partners.map(partner => `
        <tr>
            <td>${partner.name}</td>
            <td>${partner.type}</td>
            <td>${partner.sector}</td>
            <td>${partner.resources}</td>
            <td>${partner.individual}</td>
            <td>${partner.email}</td>
            <td>${partner.phone}</td>
            <td>${partner.address}</td>
            <td>${partner.date}</td>
            <td id="actionBtn">
                <button class="btn btn-primary editBtn" data-id="${partner.id}">Edit</button>
                <button class="btn btn-danger deleteBtn" data-id="${partner.id}">Delete</button>
            </td>
        </tr>
    `).join('')
}

// Fetch and render
const fetchAndRenderPartners = () => dbReference.onSnapshot(snapshot => {
  const partners = []
  snapshot.forEach(doc => {
    partners.push({ id: doc.id, ...doc.data() })
  })
  renderPartners(sortBy(partners, currentSortColumn, currentSortDirection))
})

const filterPartners = (typeFilter, sectorFilter, searchInput) => {
  let query = dbReference
  if (typeFilter) { query = query.where('type', '==', typeFilter) }
  if (sectorFilter) { query = query.where('sector', '==', sectorFilter) }
  if (!searchInput) {
    return query.onSnapshot(snapshot => {
      const partners = []
      snapshot.forEach(doc => {
        const partnerData = doc.data()
        partners.push({ id: doc.id, ...partnerData })
      })
      renderPartners(sortBy(partners, currentSortColumn, currentSortDirection))
    })
  }

  if (searchInput) {
    return query.onSnapshot(snapshot => {
      const partners = []
      snapshot.forEach(doc => {
        const partnerData = doc.data()
        const searchableFields = ['name', 'resources', 'individual', 'email', 'phone', 'address', 'date']
        if (searchInput && searchableFields.some(field => partnerData[field].toLowerCase().includes(searchInput.toLowerCase()))) {
          partners.push({ id: doc.id, ...partnerData })
        }
      })
      renderPartners(sortBy(partners, currentSortColumn, currentSortDirection))
    })
  }
}

function sortBy (partners, value, direction) {
  partners.sort((a, b) => {
    const aValue = a[value]
    const bValue = b[value]
    return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  // Return the sorted JSON list
  return partners
}

// Validation functions
function isValidInput (input) { return typeof input === 'string' && input.trim() !== '' }
function isValidType (type) { return type === 'Business' || type === 'Community' }
function isValidSector (sector) {
  const validSectors = ['Technology', 'Healthcare', 'Finance', 'Non-profit', 'Energy', 'Environment', 'Art', 'Entrepreneurship', 'Manufacturing', 'Education', 'Other']
  return validSectors.includes(sector)
}
function isValidEmail (email) { return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) }
function isValidPhone (phone) { return /^\d{3}-\d{3}-\d{4}$/.test(phone) }
function isValidDate (date) {
  const [year, month, day] = date.split('-').map(Number)
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const isValidMonth = month >= 1 && month <= 12
  const daysInMonth = new Date(year, month, 0).getDate()
  const isValidDay = day >= 1 && day <= daysInMonth
  return isValidFormat && isValidMonth && isValidDay
}

// Handling form submission
function handleFormSubmission () {
  const fields = ['#nameInput', '#typeInput', '#sectorInput', '#resourcesInput', '#individualInput', '#emailInput', '#phoneInput', '#addressInput', '#dateInput']
  const values = fields.map(field => document.querySelector(field).value.trim())

  const [name, type, sector, resources, individual, email, phone, address, date] = values

  if (!isValidInput(name)) {
    alert('Please enter a valid name.')
    return
  }

  if (!isValidType(type)) {
    alert('Please select a valid type (Business or Community).')
    return
  }

  if (!isValidSector(sector)) {
    alert('Please select a valid sector.')
    return
  }

  if (!isValidInput(resources)) {
    alert('Please enter valid resources.')
    return
  }

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.')
    return
  }

  if (!isValidInput(individual)) {
    alert('Please enter a valid individual.')
    return
  }

  if (!isValidPhone(phone)) {
    alert('Please enter a valid phone number (e.g., XXX-XXX-XXXX).')
    return
  }

  if (!isValidDate(date)) {
    alert('Please enter a valid date in the format YYYY-MM-DD.')
    return
  }

  if (!editMode) { addPartner(dbReference, name, type, sector, resources, individual, email, phone, address, date) }

  if (editMode) {
    editMode = false
    dbReference.doc(editPartnerId).update({
      name,
      type,
      sector,
      resources,
      individual,
      email,
      phone,
      address,
      date
    }).catch(error => console.error('Error updating document:', error))
  }
  elements.partnerModal.modal('hide')
}

// Add partner
function addPartner (dbReference, name, type, sector, resources, individual, email, phone, address, date) {
  dbReference.add({
    name,
    type,
    sector,
    resources,
    individual,
    email,
    phone,
    address,
    date
  })
}

// Reset form
function handleReset () {
  document.getElementById('searchInput').value = ''
  document.getElementById('sectorFilter').value = ''
  document.getElementById('typeFilter').value = ''
  currentSortColumn = 'name'
  currentSortDirection = 'asc'
  doesInputExist()
}

// Sorting handler
function handleSorting () {
  const columnName = this.getAttribute('data-column')
  if (columnName) {
    if (currentSortColumn === columnName) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      currentSortColumn = columnName
      currentSortDirection = 'asc'
    }
    doesInputExist()
    updateSortIndicators()
  }
}

// List click handler
function handleListClick (event) {
  const { target } = event
  if (target.classList.contains('deleteBtn')) {
    const partnerId = target.dataset.id
    if (confirm('Are you sure you want to delete this partner?')) {
      dbReference.doc(partnerId).delete()
    }
  }
  if (target.classList.contains('editBtn')) {
    editPartnerId = target.dataset.id
    dbReference.doc(editPartnerId).get().then(doc => {
      if (doc.exists) {
        const { name, type, sector, resources, individual, email, phone, address, date } = doc.data();
        ['#nameInput', '#typeInput', '#sectorInput', '#resourcesInput', '#individualInput', '#emailInput', '#phoneInput', '#addressInput', '#dateInput']
          .forEach((field, index) => { document.querySelector(field).value = [name, type, sector, resources, individual, email, phone, address, date][index] })
        elements.partnerModal.modal('show')
        elements.submitPartnerBtn.textContent = 'Save Changes'
        editMode = true
      }
    })
  }
}

// Check if input exists and apply filters
function doesInputExist () {
  const searchInput = elements.searchInput.value.trim().toLowerCase()
  const typeFilter = elements.typeFilter.value
  const sectorFilter = elements.sectorFilter.value
  if (searchInput || typeFilter || sectorFilter) {
    if (unsubWNoInput) {
      unsubWNoInput()
      unsubWNoInput = false
    }
    unsubWInput = filterPartners(typeFilter, sectorFilter, searchInput)
  }
  if (!searchInput && !typeFilter && !sectorFilter) {
    if (unsubWInput) {
      unsubWInput()
      unsubWInput = false
    }
    unsubWNoInput = fetchAndRenderPartners()
  }
}

// Update sort indicators
const updateSortIndicators = () => {
  const sortIndicators = document.querySelectorAll('.sort-indicator')
  sortIndicators.forEach(indicator => { indicator.innerHTML = '' })
  const currentHeader = document.querySelector(`th[data-column="${currentSortColumn}"]`)
  const indicator = currentSortDirection === 'asc' ? '&uarr;' : '&darr;'
  currentHeader.querySelector('.sort-indicator').innerHTML = indicator
}

const example = [['ABC Tech Solutions', 'Business', 'Technology', 'IT consulting, mentorship', 'John Doe', 'john.doe@abctech.com', '559-111-1111', '123 Main St', '2023-01-01'], ['Community Health Clinic', 'Community', 'Healthcare', 'Health education programs', 'Jane Smith', 'jane.smith@healthclinic.org', '559-111-1123', '456 Oak Ave', '2023-02-15'], ['Green Energy Co-op', 'Business', 'Energy', 'Renewable energy resources', 'Sam Green', 'sam.green@greenenergycoop.com', '559-111-1135', '789 Pine Rd', '2023-03-20'], ['Local Arts Foundation', 'Community', 'Arts', 'Art exhibitions, workshops', 'Alex Turner', 'alex.turner@artsfoundation.org', '559-111-1147', '321 Elm St', '2023-04-10'], ['XYZ Manufacturing', 'Business', 'Manufacturing', 'Internship programs, factory tours', 'Maria Rodriguez', 'maria.rodriguez@xyzmanufacturing.com', '559-111-1159', '987 Steel Blvd', '2023-05-05'], ['Youth Mentorship Alliance', 'Community', 'Education', 'Mentorship programs for students', 'Carlos Gonzalez', 'carlos.gonzalez@youthalliance.org', '559-111-1171', '654 Maple Ln', '2023-06-18'], ['Financial Literacy Institute', 'Business', 'Finance', 'Financial education workshops', 'Emily Johnson', 'emily.johnson@financeliteracy.org', '559-111-1183', '876 Oak Ridge', '2023-07-12'], ['Local Environmental Group', 'Community', 'Environment', 'Environmental cleanup events', 'Chris Anderson', 'chris.anderson@envirogroup.net', '559-111-1195', '543 Pine Ave', '2023-08-25'], ['Global Food Bank', 'Business', 'Non-profit', 'Food donations, volunteer opportunities', 'Sophia Lee', 'sophia.lee@globalfoodbank.org', '559-111-1207', '234 Walnut St', '2023-09-30'], ['Small Business Network', 'Community', 'Entrepreneurship', 'Business development workshops', 'Michael Brown', 'michael.brown@smallbiznetwork.com', '559-111-1219', '789 Birch Rd', '2023-10-05'], ['ABC Tech Innovations', 'Business', 'Technology', 'Innovative solutions, technology consulting', 'Alice Johnson', 'alice.johnson@abctech.com', '559-111-1231', '456 Tech Lane', '2023-11-11'], ['Community Health Foundation', 'Community', 'Healthcare', 'Health initiatives and community programs', 'Robert Miller', 'robert.miller@healthfoundation.org', '559-111-1243', '987 Health Blvd', '2023-12-12'], ['Green Energy Innovators', 'Business', 'Energy', 'Cutting-edge renewable energy projects', 'Eva Green', 'eva.green@greenenergyinnovators.com', '559-111-1255', '123 Wind Rd', '2024-01-15'], ['Local Arts Collective', 'Community', 'Arts', 'Collaborative art projects and exhibitions', 'Olivia Turner', 'olivia.turner@artscollective.org', '559-111-1267', '321 Gallery St', '2024-02-20'], ['XYZ Manufacturing Solutions', 'Business', 'Manufacturing', 'Efficient manufacturing processes and solutions', 'Carlos Rodriguez', 'carlos.rodriguez@xyzmanufacturing.com', '559-111-1279', '654 Steel Ave', '2024-03-25'], ['Youth Empowerment Alliance', 'Community', 'Education', 'Empowering youth through education programs', 'Isabella Gonzalez', 'isabella.gonzalez@youthalliance.org', '559-111-1291', '876 Education Ln', '2024-04-30'], ['Financial Literacy Center', 'Business', 'Finance', 'Comprehensive financial literacy programs', 'Daniel Johnson', 'daniel.johnson@financeliteracy.org', '559-111-1303', '543 Finance Ave', '2024-05-05'], ['Local Environmental Conservation', 'Community', 'Environment', 'Conserving local ecosystems and habitats', 'Sophie Anderson', 'sophie.anderson@conservation.net', '559-111-1315', '789 Conservation Rd', '2024-06-10'], ['Global Food Assistance', 'Business', 'Non-profit', 'Providing food assistance globally', 'Noah Lee', 'noah.lee@globalfoodassistance.org', '559-111-1327', '234 Assistance St', '2024-07-15'], ['Small Business Hub', 'Community', 'Entrepreneurship', 'Supporting small businesses and entrepreneurship', 'Emma Brown', 'emma.brown@smallbizhub.com', '559-111-1339', '789 Hub Rd', '2024-08-20'], ['Tech Innovations XYZ', 'Business', 'Technology', 'Cutting-edge innovations in technology', 'Alice Smith', 'alice.smith@techinnovationsxyz.com', '559-111-1351', '456 Innovate Lane', '2024-09-25'], ['Community Health Initiatives XYZ', 'Community', 'Healthcare', 'Community-driven health initiatives', 'Robert Johnson', 'robert.johnson@healthinitiativesxyz.org', '559-111-1363', '987 Initiatives Blvd', '2024-10-30'], ['Green Energy Pioneers', 'Business', 'Energy', 'Pioneering sustainable energy solutions', 'Eva Rodriguez', 'eva.rodriguez@greenenergypioneers.com', '559-111-1375', '123 Pioneer Rd', '2024-11-15'], ['Local Arts Guild', 'Community', 'Arts', 'Supporting local artists and creative projects', 'Oliver Turner', 'oliver.turner@artsguild.org', '559-111-1387', '321 Artistic St', '2024-12-20'], ['XYZ Manufacturing Innovations', 'Business', 'Manufacturing', 'Innovative manufacturing practices', 'Maria Rodriguez', 'maria.rodriguez@xyzinnovations.com', '559-111-1399', '654 Innovation Ave', '2025-01-25'], ['Youth Empowerment Network', 'Community', 'Education', 'Connecting youth with empowerment resources', 'Isaac Gonzalez', 'isaac.gonzalez@youthempowernetwork.org', '559-111-1411', '876 Empower Ln', '2025-02-28'], ['Financial Literacy Institute XYZ', 'Business', 'Finance', 'Advanced financial literacy education', 'Danielle Johnson', 'danielle.johnson@literacyinstitutexyz.org', '559-111-1423', '543 Financial Ave', '2025-03-15'], ['Local Environmental Stewards', 'Community', 'Environment', 'Stewardship for local environmental conservation', 'Sophia Turner', 'sophia.turner@envirostewards.net', '559-111-1435', '789 Steward Rd', '2025-04-20'], ['Green Initiative Collective', 'Community', 'Environment', 'Promoting green initiatives and sustainability', 'Jacob Green', 'jacob.green@greeninitiativecollective.org', '559-111-1447', '456 Eco Lane', '2025-05-25'], ['Tech Innovate Solutions', 'Business', 'Technology', 'Innovative solutions for tech advancement', 'Lily Tech', 'lily.tech@techinnovatesolutions.com', '559-111-1459', '654 Tech Blvd', '2025-06-30']]
function initDb (dbReference, example) {
  dbReference.get()
    .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete()))
    .then(() => example.forEach(i => addPartner(dbReference, ...i)))
    .catch(error => console.error('Error deleting documents:', error))
}

// Initial render
let unsubWNoInput
let unsubWInput = false
let editMode = false
let editPartnerId = ''
// initDb(dbReference, example)
unsubWNoInput = fetchAndRenderPartners()
doesInputExist()
updateSortIndicators()
