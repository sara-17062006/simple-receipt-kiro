// Get form elements
const receiptNo = document.getElementById('receiptNo');
const date = document.getElementById('date');
const customer = document.getElementById('customer');
const amount = document.getElementById('amount');
const purpose = document.getElementById('purpose');
const paymentMode = document.getElementById('paymentMode');

// Get display elements
const displayReceiptNo = document.getElementById('displayReceiptNo');
const displayDate = document.getElementById('displayDate');
const displayCustomer = document.getElementById('displayCustomer');
const displayAmount = document.getElementById('displayAmount');
const displayPurpose = document.getElementById('displayPurpose');
const displayPaymentMode = document.getElementById('displayPaymentMode');

const receiptDiv = document.getElementById('receipt');
const receiptForm = document.getElementById('receiptForm');
const printBtn = document.getElementById('printBtn');

// Live preview update function
function updatePreview() {
    displayReceiptNo.textContent = receiptNo.value || '-';
    displayDate.textContent = date.value || '-';
    displayCustomer.textContent = customer.value || '-';
    displayAmount.textContent = amount.value ? parseFloat(amount.value).toFixed(2) : '0.00';
    displayPurpose.textContent = purpose.value || '-';
    displayPaymentMode.textContent = paymentMode.value || '-';
}

// Add event listeners for live preview
receiptNo.addEventListener('input', updatePreview);
date.addEventListener('input', updatePreview);
customer.addEventListener('input', updatePreview);
amount.addEventListener('input', updatePreview);
purpose.addEventListener('input', updatePreview);
paymentMode.addEventListener('change', updatePreview);

// Form submission
receiptForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updatePreview();
    receiptDiv.classList.remove('hidden');
    receiptDiv.scrollIntoView({ behavior: 'smooth' });
});

// Print/PDF generation using html2canvas + jsPDF
printBtn.addEventListener('click', async function() {
    // Hide the print button temporarily
    printBtn.style.display = 'none';
    
    try {
        // Wait a moment for the button to hide
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture the receipt as canvas
        const canvas = await html2canvas(receiptDiv, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        // Get canvas dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Add image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Save PDF
        pdf.save(`receipt_${receiptNo.value || 'receipt'}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        // Show the button again
        printBtn.style.display = 'block';
    }
});

// Set today's date by default
date.valueAsDate = new Date();
