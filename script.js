// Payment Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close-modal');
    const donationAmountSpan = document.getElementById('donationAmount');
    let currentDonationAmount = 0;

    // Show payment modal with amount
    function showPaymentModal(amount) {
        if (!modal) {
            console.error('Payment modal not found!');
            return;
        }
        currentDonationAmount = amount;
        donationAmountSpan.textContent = amount.toFixed(2);
        
        // Update QR code with the current amount
        const qrCode = document.getElementById('upiQRCode');
        
        if (qrCode) {
            // The QR code is now a static image, so we just ensure it's displayed
            qrCode.style.display = 'block';
        } else {
            console.error('QR Code element not found in the document');
        }
        
        modal.style.display = 'block';
        console.log('Showing modal with amount:', amount);
    }

    // Close modal when clicking the X button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle donation buttons
    document.querySelectorAll('.donate-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Donation button clicked:', this.textContent);
            
            if (this.classList.contains('custom')) {
                const amount = prompt('Enter custom donation amount (in ₹):', '');
                if (amount !== null && amount.trim() !== '') {
                    const numAmount = parseFloat(amount);
                    if (!isNaN(numAmount) && numAmount > 0) {
                        showPaymentModal(numAmount);
                    } else {
                        alert('Please enter a valid amount greater than 0.');
                    }
                }
            } else if (this.classList.contains('donate-now')) {
                showPaymentModal(1000); // Default amount
            } else {
                const amount = parseFloat(this.textContent.replace('₹', ''));
                showPaymentModal(amount);
            }
        });
    });

    // Handle hero section donate button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            showPaymentModal(1000); // Default amount
        });
    }

    // Handle UPI app selection
    document.querySelectorAll('.upi-app').forEach(app => {
        app.addEventListener('click', function(e) {
            e.preventDefault();
            const upiApp = this.dataset.app;
            handleUPIPayment(upiApp);
        });
    });

    // Handle payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function(e) {
            const paymentMode = this.dataset.mode;
            if (paymentMode !== 'upi') {
                handlePayment(paymentMode);
            }
        });
    });

    // Handle UPI Payment
    function handleUPIPayment(app) {
        const amount = currentDonationAmount;
        const upiId = '9480981817@upi';
        const merchantName = 'Life Support Trust';
        const transactionNote = 'Donation to Life Support Trust';
        
        let paymentUrl = '';
        switch (app) {
            case 'gpay':
                paymentUrl = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=INR`;
                break;
            case 'phonepe':
                paymentUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=INR`;
                break;
            case 'paytm':
                paymentUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=INR`;
                break;
            case 'other':
                alert(`Please use this UPI ID to make the payment:\n\nUPI ID: ${upiId}\nAmount: ₹${amount}`);
                return;
        }
        
        window.location.href = paymentUrl;
    }

    // Handle other payment methods
    function handlePayment(mode) {
        const amount = currentDonationAmount;
        switch (mode) {
            case 'card':
                alert('Redirecting to secure card payment gateway...');
                break;
            case 'netbanking':
                alert('Redirecting to net banking portal...');
                break;
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);
        console.log('Form submitted:', formObject);
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// Add animation to service cards when they come into view
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(card);
});
