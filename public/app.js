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
  elements.userDetails.innerHTML = user ? `<h3>Hello ${user.displayName}!</h3>` : ''
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
                <button class="btn btn-danger btn-primary editBtn" data-id="${partner.id}">Edit</button>
                <button class="btn btn-danger btn-secondary deleteBtn" data-id="${partner.id}">Delete</button>
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

// Handling form submission
function handleFormSubmission () {
  const fields = ['#nameInput', '#typeInput', '#sectorInput', '#resourcesInput', '#individualInput', '#emailInput', '#phoneInput', '#addressInput', '#dateInput']
  const values = fields.map(field => document.querySelector(field).value.trim())

  const [name, type, sector, resources, individual, email, phone, address, date] = values

  if (!isValidInput(name) || !isValidType(type) || !isValidSector(sector) || !isValidInput(resources) ||
  !isValidEmail(email) || !isValidInput(individual) || !isValidPhone(phone) || !isValidDate(date)) {
    alert('Please fill in all fields with valid data.')
    return
  }

  if (!editMode) addPartner(dbReference, name, type, sector, resources, individual, email, phone, address, date)
  if (editMode) {
    editMode = false
    dbReference.doc(editPartnerId).update({
      name, type, sector, resources, individual, email, phone, address, date
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

// Validation functions
function isValidInput (input) { return typeof input === 'string' && input.trim() !== '' }
function isValidType (type) { return type === 'Business' || type === 'Community' }
function isValidSector (sector) {
  const validSectors = ['Technology', 'Healthcare', 'Finance', 'Non-profit', 'Energy', 'Environment', 'Art', 'Entrepreneurship', 'Manufacturing', 'Education', 'Other']
  return validSectors.includes(sector)
}
function isValidEmail (email) { return email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') }
function isValidPhone (phone) { return /^\d{3}-\d{3}-\d{4}$/.test(phone) }
function isValidDate (date) {
  const [year, month, day] = date.split('-').map(Number)
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const isValidMonth = month >= 1 && month <= 12
  const daysInMonth = new Date(year, month, 0).getDate()
  const isValidDay = day >= 1 && day <= daysInMonth
  return isValidFormat && isValidMonth && isValidDay
}

// Initial render
let unsubWNoInput
let unsubWInput = false
let editMode = false
let editPartnerId = ''
initDb(dbReference, example)
unsubWNoInput = fetchAndRenderPartners()
doesInputExist()
updateSortIndicators()
