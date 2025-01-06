function getApiBaseUrl() {
    const apiBaseUrl = window.__API_BASE_URL__ || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    return apiBaseUrl.replace(/\/$/, '');
}

export function setupEventListeners() {
    const addressInput = document.getElementById('addressInput'); 
    const retrieveButton = document.getElementById('Retrieve'); 

    retrieveButton.addEventListener('click', async () => {
        const addressValue = addressInput.value.trim();
        console.log('Adress Input:', addressValue);
        if (!addressValue) {
            alert('Please enter an address.');
            return;
        }

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/leases`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch lease agreements');
            }
            
            const leases = await response.json();
            console.log('Fetched leases:', leases);
            const matchingLease = leases.find(lease => lease.address === addressValue);

            if (matchingLease) {
                // Creating PDF
                const { jsPDF } = window.jspdf;
                const lease = new jsPDF();

                // Styling and structuring the PDF
                lease.setFontSize(18);
                lease.setFont('helvetica', 'bold');
                lease.text('Lease Agreement', 105, 20, null, null, 'center');

                lease.setFontSize(12);
                lease.setFont('helvetica', 'bold');
                lease.text('Address:', 10, 40);
                lease.setFont('helvetica', 'normal');
                lease.text(matchingLease.address, 50, 40);
    
                lease.setFont('helvetica', 'bold');
                lease.text('Rent:', 10, 50);
                lease.setFont('helvetica', 'normal');
                lease.text(`${matchingLease.rentAmount}`, 50, 50);

                lease.setFont('helvetica', 'bold');
                lease.text('Tenants:', 10, 60);
                lease.setFont('helvetica', 'normal');

                matchingLease.tenants.forEach((tenant, index) => {
                    lease.text(`Tenant ${index + 1}:`, 10, 70 + (index * 10));
                    lease.text(`${tenant.firstName} ${tenant.lastName}`, 50, 70 + (index * 10));
                });

                // Dates
                const startY = 80 + (matchingLease.tenants.length * 10) + 30; 

                lease.setLineWidth(0.5);
                lease.line(10, startY - 10, 200, startY - 10); 

                lease.setFont('helvetica', 'bold');
                lease.text('Important Dates:', 10, startY);
                
                lease.setFont('helvetica', 'normal');
                lease.text('Lease Start:', 10, startY + 10);
                lease.text(new Date(matchingLease.leaseStart).toLocaleDateString(), 50, startY + 10);

                lease.setFont('helvetica', 'bold');
                lease.text('Lease End:', 10, startY + 20);
                lease.setFont('helvetica', 'normal');
                lease.text(new Date(matchingLease.leaseEnd).toLocaleDateString(), 50, startY + 20);

                lease.setFont('helvetica', 'bold');
                lease.text('Signed At:', 10, startY + 30);
                lease.setFont('helvetica', 'normal');
                lease.text(new Date(matchingLease.signedAt).toLocaleDateString(), 50, startY + 30);

                // Signature Section
                const signatureY = startY + 50; // Space for signatures
                lease.line(10, signatureY, 80, signatureY);
                lease.text('Signature (Landlord)', 10, signatureY + 10);

                matchingLease.tenants.forEach((tenant, index) => {
                    const yPos = signatureY + 30 + (index * 20); 
                    lease.line(10, yPos, 80, yPos);
                    lease.text(`Signature (Tenant ${index + 1})`, 10, yPos + 10);
                });
                
                lease.save('lease.pdf');
            } else {
                alert('No matching lease found for the provided address.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error retrieving leases: ${error.message}`);
        }
    });
}
setupEventListeners();