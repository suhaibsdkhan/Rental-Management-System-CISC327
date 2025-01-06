function addInputEventListener(addButton, tenantNameArea) {
    addButton.addEventListener('click', function() {
        // Create a new input element
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = 'Tenant Name';
        newInput.required = true;
        newInput.className = 'tenant-input';

        // Create a container for the input
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.appendChild(newInput);

        // Append the new input to the input area
        tenantNameArea.appendChild(inputContainer);
    });
}
/*
function createLease(adressValue, rentValue, tenants){
    const { jsPDF } = window.jspdf;
    const lease = new jsPDF();

    // Styling and stucturing the PDF
    lease.setFontSize(18);
    lease.setFont('helvetica', 'bold');
    lease.text('Lease Agreement', 105, 20, null, null, 'center');

    lease.setFontSize(12);
    lease.setFont('helvetica', 'bold');
    lease.text('Address:', 10, 40);
    lease.setFont('helvetica', 'normal');
    lease.text(adressValue, 50, 40);

    lease.setFont('helvetica', 'bold');
    lease.text('Rent:', 10, 50);
    lease.setFont('helvetica', 'normal');
    lease.text(`${rentValue}`, 50, 50);

    lease.setLineWidth(0.5);
    lease.line(10, 60, 200, 60);

    lease.setFont('helvetica', 'bold');
    lease.text('Tenants:', 10, 70);
    lease.setFont('helvetica', 'normal');

    tenants.forEach((input, index) => {
        const name = input.value.trim();
        lease.text(`Tenant ${index + 1}:`, 10, 80 + (index * 10));
        lease.text(name, 50, 80 + (index * 10));
    });

    // Signature Section
    const startY = 100 + (tenants.length * 10);
    lease.line(10, startY, 80, startY);
    lease.text('Signature (Landlord)', 10, startY + 10);

    tenants.forEach((input, index) => {
        const yPos = startY + 30 + (index * 20);
        lease.line(10, yPos, 80, yPos);
        lease.text(`Signature (Tenant ${index + 1})`, 10, yPos + 10);
    });

    lease.save('lease.pdf');
}
*/
async function saveLeaseToServer(leaseData){
    try {
        const response = await fetch('/api/lease', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leaseData)
        });

        if (response.ok) {
            const leaseId = await response.text();
            alert(`Lease saved successfully with ID: ${leaseId}`);
        } else {
            const error = await response.text();
            alert(`Error saving lease: ${error}`);
            console.log(`Error saving lease: ${error}`)
        }
    } catch (error) {
        alert(`Network error: ${error.message}`);
    }
}

function addPdfButtonEventListener(adress, rent, tenantNameArea, pdfButton){
    pdfButton.addEventListener('click', async function() {

        const adressValue = adress.value.trim();
        const rentValue = rent.value.trim();

        // Get all tenant names
        const tenants = tenantNameArea.querySelectorAll('.tenant-input');

        //Check to see if all inputs are filled
        let filled = true;
        if((adressValue === '') || (rentValue === '')){
            filled = false;
        }
        tenants.forEach((input) => {
            if (input.value.trim() === '') {
                filled = false;
            }
        });
        if(!filled){
            alert('Please fill out all input fields before generating the PDF.');
            return false;
        }

        //check to see if the rent value is numeric
        if(isNaN(parseFloat(rentValue))){
            alert('The rent value contains characters that are not numeric.');
            return false;
        }

        //check if no tenant inputs were added
        if(tenants.length === 0){
            alert('No tenants were added.');
            return false;
        }

        //Saving to database
        //Splitting the tenant names into first and last names.
        const tenantData = Array.from(tenants).map(input => {
            const name = input.value.trim(); // Get the value of the input
            const [firstName, ...lastNameParts] = name.split(' ');

            // Return an object with first and last name
            return { FirstName: firstName, LastName: lastNameParts.join(' ') };
        });

        //creating lease data
        const leaseData = {
            Address: adressValue,
            LeaseStart: new Date().toISOString(),
            LeaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            RentAmount: parseFloat(rentValue),
            Tenants: tenantData
        };

        await saveLeaseToServer(leaseData);

        //creating pdf
        //createLease(adressValue, rentValue, tenants);
        return true;
    });
}

export function setupEventListeners() {
    //Recieving inputs and ui elements
    const adress = document.getElementById('adress');
    const rent = document.getElementById('rent');
    const addButton = document.getElementById('add-button');
    const tenantNameArea = document.getElementById('add-tenant-area');
    const pdfButton = document.getElementById('pdf-button');

    //Adding fields for muliple tenants
    addInputEventListener(addButton, tenantNameArea);

    //Generating a pdf with inputs information
    addPdfButtonEventListener(adress, rent, tenantNameArea, pdfButton);
}

//only run the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', setupEventListeners);



export function setupEventListenersTestVersion(testAdress, testRent, testAddButton, testTenantArea, testPDF) {
    //Recieving inputs and ui elements
    const adress = testAdress;
    const rent = testRent;
    const addButton = testAddButton;
    const tenantNameArea = testTenantArea;
    const pdfButton = testPDF;

    addInputEventListener(addButton, tenantNameArea);

    //Generating a pdf with inputs information
    addPdfButtonEventListener(adress, rent, tenantNameArea, pdfButton);
}