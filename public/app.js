const auth = firebase.auth()
const db = firebase.firestore()

// Elements
const elements = {
  whenSignedIn: document.getElementById('whenSignedIn'),
  signOutBtn: document.getElementById('signOutBtn'),
  userDetails: document.getElementById('userDetails'),
  tableHeaders: document.querySelectorAll('th'),
  partnerModal: $('#partnerModal'),
  importPartnerModal: $('#importPartnerModal'),
  submitPartnerBtn: document.getElementById('submitPartnerBtn'),
  importPartnerBtn: document.getElementById('importPartnerBtn'),
  partnerForm: document.getElementById('partnerForm'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
  sectorFilter: document.getElementById('sectorFilter'),
  addPartnerBtn: document.getElementById('addPartnerBtn'),
  submitPartnerBtn2: document.getElementById('submitPartnerBtn2'),
  resetBtn: document.getElementById('resetBtn'),
  thingsList: document.getElementById('thingsList'),
  downloadBtn: document.getElementById('downloadBtn'),
  csvFileInput: document.getElementById('csvFileInput')
}

// Firestore reference
const dbReference = db.collection('partners')

// Sorting variables
let currentSortColumn = 'name'
let currentSortDirection = 'asc'

// Partner list
let partnerData = null

// Event listeners
window.addEventListener('DOMContentLoaded', (event) => {
  elements.signOutBtn.onclick = () => auth.signOut().then(window.location.href = '/index.html')
  elements.addPartnerBtn.addEventListener('click', () => elements.partnerModal.modal('show'))
  elements.importPartnerBtn.addEventListener('click', () => elements.importPartnerModal.modal('show'))
  elements.submitPartnerBtn2.addEventListener('click', importPartner)
  elements.csvFileInput.addEventListener('change', () => { elements.submitPartnerBtn2.disabled = false })
  elements.partnerModal.on('hidden.bs.modal', () => elements.partnerForm.reset())
  elements.submitPartnerBtn.addEventListener('click', handleFormSubmission)
  elements.resetBtn.addEventListener('click', handleReset)
  elements.typeFilter.addEventListener('change', doesInputExist)
  elements.sectorFilter.addEventListener('change', doesInputExist)
  elements.searchInput.addEventListener('input', doesInputExist)
  elements.tableHeaders.forEach(header => header.addEventListener('click', handleSorting))
  elements.thingsList.addEventListener('click', handleListClick)
  elements.downloadBtn.addEventListener('click', download)
})
// Authentication state change
auth.onAuthStateChanged(user => {
  if (user) {
    elements.userDetails.innerHTML = `Hello ${user.displayName}!`
  }
}
)

// Render partners
const renderPartners = partners => {
  const data = partners.map(item => {
    const { id, ...rest } = item
    return rest
  })
  partnerData = data
  elements.thingsList.innerHTML = partners.map(partner => `
        <tr>
            <td hidden><input type="checkbox" value=""></td>
            <td id="tableName">${partner.name}</td>
            <td>${partner.type}</td>
            <td>${partner.sector}</td>
            <td>${partner.resources}</td>
            <td>${partner.individual}</td>
            <td>${partner.email}</td>
            <td>${partner.phone}</td>
            <td>${partner.address}</td>
            <td>${partner.date}</td>
            <td id="actionBtn">
                <button class="btn btn-primary editBtn" id="editBtn" data-id="${partner.id}">Edit</button>
                <button class="btn btn-danger deleteBtn" id="submitBtn" data-id="${partner.id}">Delete</button>
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

function importPartner () {
  elements.importPartnerModal.modal('hide')
  csvToJson(elements.csvFileInput).then(result => {
    dbReference.get()
      .then(() => result.forEach(partner => addPartner(dbReference, partner.name, partner.type, partner.sector, partner.resources,
        partner.individual, partner.email, partner.phone, partner.address, partner.date)))
      .catch(error => console.error('Error adding documents:', error))
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

function download () {
  const header = Object.keys(partnerData[0])
  const headerString = header.join(',')
  const replacer = (key, value) => value ?? ''
  const rowItems = partnerData.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(',')
  )
  const csv = [headerString, ...rowItems].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', 'download.csv')
  a.click()
}

function csvToJson (csvFileInput) {
  return new Promise((resolve, reject) => {
    const file = csvFileInput.files[0]
    const reader = new FileReader()

    reader.onload = function (event) {
      const csvData = event.target.result
      const jsonData = parseCsvToJson(csvData)
      resolve(jsonData)
    }
    reader.readAsText(file)
  })
}

function parseCsvToJson (csvData) {
  const rows = csvData.trim().split('\n')
  const headers = rows[0].split(',')
  const jsonData = []

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',')
    const obj = {}

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = values[j].trim()
    }

    jsonData.push(obj)
  }

  return jsonData
}

// Update sort indicators
const updateSortIndicators = () => {
  const sortIndicators = document.querySelectorAll('.sort-indicator')
  sortIndicators.forEach(indicator => { indicator.innerHTML = '' })
  const currentHeader = document.querySelector(`th[data-column="${currentSortColumn}"]`)
  const indicator = currentSortDirection === 'asc' ? '&uarr;' : '&darr;'
  currentHeader.querySelector('.sort-indicator').innerHTML = indicator
}

// Initial render
let unsubWNoInput
let unsubWInput = false
let editMode = false
let editPartnerId = ''
unsubWNoInput = fetchAndRenderPartners()
doesInputExist()
updateSortIndicators()

const icons = document.querySelectorAll('.icon')
icons.forEach(icon => {
  icon.addEventListener('click', (event) => {
    icon.classList.toggle('open')
  })
})
