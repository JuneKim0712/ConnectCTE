const auth = firebase.auth();
const db = firebase.firestore();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDetails = document.getElementById('userDetails');
const provider = new firebase.auth.GoogleAuthProvider();
const example = [['ABC Tech Solutions', 'Business', 'Technology', 'IT consulting, mentorship', 'John Doe', 'john.doe@abctech.com', '559-111-1111', '123 Main St', '2023-01-01'], ['Community Health Clinic', 'Community', 'Healthcare', 'Health education programs', 'Jane Smith', 'jane.smith@healthclinic.org', '559-111-1123', '456 Oak Ave', '2023-02-15'], ['Green Energy Co-op', 'Business', 'Energy', 'Renewable energy resources', 'Sam Green', 'sam.green@greenenergycoop.com', '559-111-1135', '789 Pine Rd', '2023-03-20'], ['Local Arts Foundation', 'Community', 'Arts', 'Art exhibitions, workshops', 'Alex Turner', 'alex.turner@artsfoundation.org', '559-111-1147', '321 Elm St', '2023-04-10'], ['XYZ Manufacturing', 'Business', 'Manufacturing', 'Internship programs, factory tours', 'Maria Rodriguez', 'maria.rodriguez@xyzmanufacturing.com', '559-111-1159', '987 Steel Blvd', '2023-05-05'], ['Youth Mentorship Alliance', 'Community', 'Education', 'Mentorship programs for students', 'Carlos Gonzalez', 'carlos.gonzalez@youthalliance.org', '559-111-1171', '654 Maple Ln', '2023-06-18'], ['Financial Literacy Institute', 'Business', 'Finance', 'Financial education workshops', 'Emily Johnson', 'emily.johnson@financeliteracy.org', '559-111-1183', '876 Oak Ridge', '2023-07-12'], ['Local Environmental Group', 'Community', 'Environment', 'Environmental cleanup events', 'Chris Anderson', 'chris.anderson@envirogroup.net', '559-111-1195', '543 Pine Ave', '2023-08-25'], ['Global Food Bank', 'Business', 'Non-profit', 'Food donations, volunteer opportunities', 'Sophia Lee', 'sophia.lee@globalfoodbank.org', '559-111-1207', '234 Walnut St', '2023-09-30'], ['Small Business Network', 'Community', 'Entrepreneurship', 'Business development workshops', 'Michael Brown', 'michael.brown@smallbiznetwork.com', '559-111-1219', '789 Birch Rd', '2023-10-05'], ['ABC Tech Innovations', 'Business', 'Technology', 'Innovative solutions, technology consulting', 'Alice Johnson', 'alice.johnson@abctech.com', '559-111-1231', '456 Tech Lane', '2023-11-11'], ['Community Health Foundation', 'Community', 'Healthcare', 'Health initiatives and community programs', 'Robert Miller', 'robert.miller@healthfoundation.org', '559-111-1243', '987 Health Blvd', '2023-12-12'], ['Green Energy Innovators', 'Business', 'Energy', 'Cutting-edge renewable energy projects', 'Eva Green', 'eva.green@greenenergyinnovators.com', '559-111-1255', '123 Wind Rd', '2024-01-15'], ['Local Arts Collective', 'Community', 'Arts', 'Collaborative art projects and exhibitions', 'Olivia Turner', 'olivia.turner@artscollective.org', '559-111-1267', '321 Gallery St', '2024-02-20'], ['XYZ Manufacturing Solutions', 'Business', 'Manufacturing', 'Efficient manufacturing processes and solutions', 'Carlos Rodriguez', 'carlos.rodriguez@xyzmanufacturing.com', '559-111-1279', '654 Steel Ave', '2024-03-25'], ['Youth Empowerment Alliance', 'Community', 'Education', 'Empowering youth through education programs', 'Isabella Gonzalez', 'isabella.gonzalez@youthalliance.org', '559-111-1291', '876 Education Ln', '2024-04-30'], ['Financial Literacy Center', 'Business', 'Finance', 'Comprehensive financial literacy programs', 'Daniel Johnson', 'daniel.johnson@financeliteracy.org', '559-111-1303', '543 Finance Ave', '2024-05-05'], ['Local Environmental Conservation', 'Community', 'Environment', 'Conserving local ecosystems and habitats', 'Sophie Anderson', 'sophie.anderson@conservation.net', '559-111-1315', '789 Conservation Rd', '2024-06-10'], ['Global Food Assistance', 'Business', 'Non-profit', 'Providing food assistance globally', 'Noah Lee', 'noah.lee@globalfoodassistance.org', '559-111-1327', '234 Assistance St', '2024-07-15'], ['Small Business Hub', 'Community', 'Entrepreneurship', 'Supporting small businesses and entrepreneurship', 'Emma Brown', 'emma.brown@smallbizhub.com', '559-111-1339', '789 Hub Rd', '2024-08-20'], ['Tech Innovations XYZ', 'Business', 'Technology', 'Cutting-edge innovations in technology', 'Alice Smith', 'alice.smith@techinnovationsxyz.com', '559-111-1351', '456 Innovate Lane', '2024-09-25'], ['Community Health Initiatives XYZ', 'Community', 'Healthcare', 'Community-driven health initiatives', 'Robert Johnson', 'robert.johnson@healthinitiativesxyz.org', '559-111-1363', '987 Initiatives Blvd', '2024-10-30'], ['Green Energy Pioneers', 'Business', 'Energy', 'Pioneering sustainable energy solutions', 'Eva Rodriguez', 'eva.rodriguez@greenenergypioneers.com', '559-111-1375', '123 Pioneer Rd', '2024-11-15'], ['Local Arts Guild', 'Community', 'Arts', 'Supporting local artists and creative projects', 'Oliver Turner', 'oliver.turner@artsguild.org', '559-111-1387', '321 Artistic St', '2024-12-20'], ['XYZ Manufacturing Innovations', 'Business', 'Manufacturing', 'Innovative manufacturing practices', 'Maria Rodriguez', 'maria.rodriguez@xyzinnovations.com', '559-111-1399', '654 Innovation Ave', '2025-01-25'], ['Youth Empowerment Network', 'Community', 'Education', 'Connecting youth with empowerment resources', 'Isaac Gonzalez', 'isaac.gonzalez@youthempowernetwork.org', '559-111-1411', '876 Empower Ln', '2025-02-28'], ['Financial Literacy Institute XYZ', 'Business', 'Finance', 'Advanced financial literacy education', 'Danielle Johnson', 'danielle.johnson@literacyinstitutexyz.org', '559-111-1423', '543 Financial Ave', '2025-03-15'], ['Local Environmental Stewards', 'Community', 'Environment', 'Stewardship for local environmental conservation', 'Sophia Turner', 'sophia.turner@envirostewards.net', '559-111-1435', '789 Steward Rd', '2025-04-20'], ['Green Initiative Collective', 'Community', 'Environment', 'Promoting green initiatives and sustainability', 'Jacob Green', 'jacob.green@greeninitiativecollective.org', '559-111-1447', '456 Eco Lane', '2025-05-25'], ['Tech Innovate Solutions', 'Business', 'Technology', 'Innovative solutions for tech advancement', 'Lily Tech', 'lily.tech@techinnovatesolutions.com', '559-111-1459', '654 Tech Blvd', '2025-06-30']]
const dbReference = db.collection("partners");
const tableHeaders = document.querySelectorAll('th');
let currentSortColumn = 'name';
let currentSortDirection = 'asc';
let unsubWNoInput;
let unsubWInput = false;

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    whenSignedIn.hidden = !user;
    whenSignedOut.hidden = user;
    userDetails.innerHTML = user ? `<h3>Hello ${user.displayName}!</h3>` : '';
});

const renderPartners = partners => {
    const thingsList = document.getElementById('thingsList');
    thingsList.innerHTML = partners.map(partner => `
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
            <td><button class="btn btn-danger btn-sm deleteBtn" data-id="${partner.id}">Delete</button></td>
        </tr>
    `).join('');
};

const fetchAndRenderPartners = () => {
    return db.collection("partners").orderBy(currentSortColumn, currentSortDirection).onSnapshot(snapshot => {
        const partners = [];
        snapshot.forEach(doc => partners.push({ id: doc.id, ...doc.data() }));
        renderPartners(partners);
    });
};
// Open the partner modal when the add partner button is clicked
document.getElementById('addPartnerBtn').addEventListener('click', () => {
    $('#partnerModal').modal('show');
});

// Close the partner modal and reset form on close
$('#partnerModal').on('hidden.bs.modal', function () {
    document.getElementById('partnerForm').reset();
});

// Handle form submission
document.getElementById('submitPartnerBtn').addEventListener('click', () => {
    const [name, type, sector, resources, individual, email, phone, address, date] = Array.from(document.querySelectorAll('#nameInput, #typeInput, #sectorInput, #resourcesInput, #individualInput, #emailInput, #phoneInput, #addressInput, #dateInput')).map(el => el.value.trim());
    if (!name || !type || !sector || !resources || !email || !phone || !address || !date) {
        alert('Please fill in all fields.');
        return;
    }
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!isValidPhone(phone)) {
        alert('Please enter a valid phone number (xxx-xxx-xxxx).');
        return;
    }
    if (!isValidDate(date)) {
        alert('Please enter a valid date.');
        return;
    }
    add(dbReference, name, type, sector, resources, individual, email, phone, address, date);
    $('#partnerModal').modal('hide');
});


document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('sectorFilter').value = "";
    document.getElementById('typeFilter').value = "";
    currentSortColumn = 'name';
    currentSortDirection = 'asc';
    unsubWNoInput = fetchAndRenderPartners();
});

document.getElementById('typeFilter').addEventListener('change', doesInputExist);
document.getElementById('sectorFilter').addEventListener('change', doesInputExist);

function add(dbReference, name, type, sector, resources, individual, email, phone, address, date) {
    dbReference.add({ name, type, sector, resources, individual, email, phone, address, date });
}

function initDb(dbReference, example) {
    dbReference.get()
        .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete()))
        .then(() => example.forEach(i => add(dbReference, ...i)))
        .catch(error => console.error('Error deleting documents:', error));
}

function doesInputExist(){
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const sectorFilter = document.getElementById('sectorFilter').value;
    if (searchInput || typeFilter || sectorFilter){
        if (unsubWNoInput){
            unsubWNoInput()
            unsubWNoInput = false;
        };
        unsubWInput = filterPartners(typeFilter, sectorFilter, searchInput);
    }
    if (!searchInput && !typeFilter && !sectorFilter){
        if (unsubWInput){
            unsubWInput()
            unsubWInput = false;
        };
        unsubWNoInput = fetchAndRenderPartners();
    }
}

function isValidName(name) {
    return typeof name === 'string' && name.trim() !== '';
}

// Validation function for type (must be either "Business" or "Community")
function isValidType(type) {
    return type === 'Business' || type === 'Community';
}

// Validation function for sector   
function isValidSector(sector) {
    const validSectors = [
        'Technology', 'Healthcare', 'Finance', 'Non-profit',
        'Energy', 'Environment', 'Arts', 'Entrepreneurship',
        'Manufacturing', 'Education', 'Other'
    ];
    return validSectors.includes(sector);
}

// Validation function for email (must be a valid email format)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation function for phone (must be in xxx-xxx-xxxx format)
function isValidPhone(phone) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Validation function for date (must be a valid date format)
function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}

const filterPartners = (typeFilter, sectorFilter, searchInput) => {
    let query = db.collection("partners").orderBy(currentSortColumn, currentSortDirection);

    if (typeFilter) {
        query = query.where("type", "==", typeFilter);
    }
    if (sectorFilter) {
        query = query.where("sector", "==", sectorFilter);
    }

    return query.onSnapshot(snapshot => {
        const partners = [];
        snapshot.forEach(doc => {
            const partnerData = doc.data();
            if (Object.values(partnerData)
            .some(value => value.toLowerCase().includes(searchInput))) {
                partners.push({ id: doc.id, ...partnerData });
            }
        });
        renderPartners(partners);
    })
};


// Function to update sort indicators
const updateSortIndicators = () => {
    const sortIndicators = document.querySelectorAll('.sort-indicator');
    sortIndicators.forEach(indicator => indicator.innerHTML = '');
    const currentHeader = document.querySelector(`th[data-column="${currentSortColumn}"]`);
    const indicator = currentSortDirection === 'asc' ? '&uarr;' : '&darr;';
    currentHeader.querySelector('.sort-indicator').innerHTML = indicator;
};

// Add an event listener to the table headers to handle sorting
tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const columnName = header.getAttribute('data-column');
        if (currentSortColumn === columnName) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = columnName;
            currentSortDirection = 'asc';
        }
        doesInputExist();
        updateSortIndicators(); // Update sort indicators
    });
});

document.getElementById('searchInput').addEventListener('input', () => {
    doesInputExist();
});

thingsList.addEventListener('click', event => {
    if (event.target.classList.contains('deleteBtn')) {
        const partnerId = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this partner?")) {
            db.collection("partners").doc(partnerId).delete();
        }
    }
});


// initDb(dbReference, example);
unsubWNoInput = fetchAndRenderPartners();
doesInputExist(); 
updateSortIndicators();

