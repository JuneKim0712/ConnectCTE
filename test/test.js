const { exec } = require('child_process')
const assert = require('assert')
const firebase = require('@firebase/testing')

const MY_PROJECT_ID = 'fbla23jk'

function getFirestore (auth) {
  return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth }).firestore()
}

// Start Firebase emulators before tests
before(async function () {
  this.timeout(20000) // Set timeout to 60 seconds
  try {
    console.log('Starting Firebase emulators...')
    exec('firebase emulators:start --only firestore')
    console.log('Firebase emulators started successfully!')
    await new Promise(resolve => setTimeout(resolve, 2000))
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
  it('reject read to user that are not logged in', async () => {
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

  it('allows read to user who does not have email verified and has @vusd.us domain', async () => {
    const myAuth = { uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: true }
    const db = getFirestore(myAuth)
    const testDoc = db.collection('partners')
    await firebase.assertSucceeds(testDoc.get())
  })

  const myAuth = { uid: 'june', email: 'junwo.ki6700@vusd.us', email_verified: true }
  const db = getFirestore(myAuth)
  const testDB = db.collection('partners')

  it('reject create or update for invalid input of name', async () => {
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
    await firebase.assertFails(testDB.doc('exampleDoc').update({
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
