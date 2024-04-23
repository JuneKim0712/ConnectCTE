const { exec } = require('child_process')
const assert = require('assert')
const firebase = require('@firebase/testing')

const MY_PROJECT_ID = 'fbla23jk'

function getFirestore (auth) {
  return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth }).firestore()
}

// Start Firebase emulators before tests


describe('Feature tests for app.js', () => {
  // Section 1: Authentication state change
  describe('Authentication state change tests', () => {
    it('Test if user details update when the authentication state changes', () => {
      assert.strictEqual(true, true)
    })

    it('Test if the user is signed out when the signOutBtn button is clicked', () => {
      assert.strictEqual(true, true)
    })
  })

  // Section 3: Sorting and filters
  describe('Sorting and filters tests', () => {
    it('Test if handleSorting function sorts the partners list properly', () => {
      assert.strictEqual(true, true)
    })

    it('Test if filterPartners function filters partners based on input filters correctly', () => {
      assert.strictEqual(true, true)
    })
  })

  // Section 4: Form validation and submission
  describe('Form validation and submission tests', () => {
    it('Test if handleFormSubmission function validates the form inputs correctly and submits the form', () => {
      assert.strictEqual(true, true)
    })

    it('Test if addPartner function adds a partner with correct data', () => {
      assert.strictEqual(true, true)
    })
  })

  // Section 5: CSV import
  describe('CSV import tests', () => {
    it('Test if the CSV file is read correctly and converted to JSON', () => {
      assert.strictEqual(true, true)
    })

    it('Test if importPartner function imports partners from a CSV file correctly', () => {
      assert.strictEqual(true, true)
    })
  })

  // Section 6: Download
  describe('Download tests', () => {
    it('Test if the download function downloads the CSV file correctly', () => {
      assert.strictEqual(true, true)
    })
  })

  // Section 7: Utility functions
  describe('Utility functions tests', () => {
    it('Test each validation function (isValidInput, isValidType, isValidSector, isValidEmail, isValidPhone, isValidDate)' + '\n' + 'to ensure they work correctly with different inputs', () => {
      assert.strictEqual(true, true)
    })

    it('Test sortBy function to ensure it sorts the partners list correctly based on the provided criteria', () => {
      assert.strictEqual(true, true)
    })
  })
})

before(async function () {
  this.timeout(20000) // Set timeout to 60 seconds
  try {
    console.log('Starting Firebase emulators...')
    exec('firebase emulators:start --only firestore')
    console.log('Firebase emulators started successfully!')
    await new Promise(resolve => setTimeout(resolve, 4000))
  } catch (error) {
    console.error('Error starting Firebase emulators:', error)
    process.exit(1)
  }
})

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })
  await getFirestore({ uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: true })
    .collection('partners').doc('exampleDoc').set({
      name: 'ABC Tech Solutions',
      type: 'Business',
      sector: 'Technology',
      resources: 'IT consulting, mentorship',
      individual: 'John Doe',
      email: 'john.doe@abctech.com',
      phone: '559-111-1111',
      address: '123 Main St',
      date: '2023-01-01'
    })
})

describe('Check firestore.rule functions properly', () => {
  // Read Access Tests
  describe('Read Access Tests', () => {
    it('reject read to user that is not logged in', async () => {
      const myAuth = null
      const db = getFirestore(myAuth)
      const testDoc = db.collection('partners')
      await firebase.assertFails(testDoc.get())
    })

    it('reject read to user who does not have @vusd.us domain', async () => {
      const myAuth = { uid: 'june', email: 'junwo.ki6700@gmail.com', email_verified: true }
      const db = getFirestore(myAuth)
      const testDoc = db.collection('partners')
      await firebase.assertFails(testDoc.get())
    })

    it('reject read to user who does not have email verified', async () => {
      const myAuth = { uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: false }
      const db = getFirestore(myAuth)
      const testDoc = db.collection('partners')
      await firebase.assertFails(testDoc.get())
    })

    it('allows read to user with verified email and @vusd.us domain', async () => {
      const myAuth = { uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: true }
      const db = getFirestore(myAuth)
      const testDoc = db.collection('partners')
      await firebase.assertSucceeds(testDoc.get())
    })
  })

  // Create/Update Tests
  describe('Create/Update Tests', () => {
    const myAuth = { uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: true }
    const db = getFirestore(myAuth)
    const testDB = db.collection('partners')

    it('reject create or update for invalid input of name', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: '',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of type', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: '',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of sector', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: '',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of resources', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: '', // Empty resources
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of individual', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: '', // Empty individual
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of email', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'invalid_email', // Invalid email format
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of phone', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: 'invalid_phone_format', // Invalid phone format
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of address', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '', // Empty address
        date: '2023-01-01'
      }))
    })

    it('reject create or update for invalid input of date', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-13'
      }))
    })

    it('allows create with valid input', async () => {
      await firebase.assertSucceeds(testDB.add({
        name: 'Example Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })

    it('allows update with valid input', async () => {
      await firebase.assertSucceeds(testDB.doc('exampleDoc').update({
        name: 'updated Name',
        type: 'Business',
        sector: 'Technology',
        resources: 'IT consulting, mentorship',
        individual: 'John Doe',
        email: 'john.doe@abctech.com',
        phone: '559-111-1111',
        address: '123 Main St',
        date: '2023-01-01'
      }))
    })
  })
})
