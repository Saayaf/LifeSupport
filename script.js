// Payment Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Element References
    const modal = document.getElementById('paymentModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const donationAmountSpan = document.getElementById('donationAmount');
    const upiQRCode = document.getElementById('upiQRCode');

    // Configuration
    const UPI_CONFIG = {
        ID: 'saifullakhadar@ybl',
        MERCHANT_NAME: 'Life Support Trust'
    };

    // State Management
    let currentDonationAmount = 0;

    // Utility Functions
    function formatAmount(amount) {
        return Number(amount).toFixed(2);
    }

    // Modal Management
    function openModal() {
        if (!modal) {
            console.error('Payment modal not found!');
            return false;
        }
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        return true;
    }

    function closeModal() {
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset donation state
        currentDonationAmount = 0;
        donationAmountSpan.textContent = '0';
    }

    // Donation Handling
    function validateDonationAmount(amount) {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid donation amount greater than 0.');
            return false;
        }
        return numAmount;
    }

    function showPaymentModal(amount) {
        const validAmount = validateDonationAmount(amount);
        if (!validAmount) return;

        currentDonationAmount = validAmount;
        donationAmountSpan.textContent = formatAmount(validAmount);

        // Update QR Code and Modal
        if (upiQRCode) {
            upiQRCode.style.display = 'block';
        }

        openModal();
        console.log(`Opened donation modal for ₹${validAmount}`);
    }

    function handleDonationButton(button) {
        let amount;
        
        if (button.classList.contains('custom')) {
            // Custom amount prompt
            const customAmount = prompt('Enter custom donation amount (in ₹):', '');
            if (customAmount === null) return;
            
            amount = validateDonationAmount(customAmount);
            if (!amount) return;
        } else if (button.classList.contains('donate-now') || button.classList.contains('cta-button')) {
            // Default amount for "Donate Now" buttons
            amount = 1000;
        } else {
            // Preset amount buttons
            amount = parseFloat(button.textContent.replace('₹', ''));
        }

        showPaymentModal(amount);
    }

    // UPI Payment Handling
    function handleUPIPayment(app) {
        if (!currentDonationAmount || currentDonationAmount <= 0) {
            alert('Please select a donation amount first.');
            return;
        }

        const upiId = UPI_CONFIG.ID;
        const merchantName = UPI_CONFIG.MERCHANT_NAME;
        const amount = currentDonationAmount;
        const transactionNote = 'Donation to Life Support Trust';
        
        // Construct comprehensive UPI deep link
        const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}` +
                        `&pn=${encodeURIComponent(merchantName)}` +
                        `&am=${amount}` +
                        `&cu=INR` +
                        `&tn=${encodeURIComponent(transactionNote)}`;
        
        console.log('Attempting UPI Payment:', {
            app,
            upiId,
            amount,
            merchantName
        });
        
        // App-specific deep links
        const appLinks = {
            'gpay': `tez://upi/pay?pa=${encodeURIComponent(upiId)}`,
            'phonepe': `phonepe://pay?pa=${encodeURIComponent(upiId)}`,
            'paytm': `paytmmp://pay?pa=${encodeURIComponent(upiId)}`
        };

        try {
            const specificAppLink = appLinks[app] || upiLink;
            window.location.href = specificAppLink;
        } catch (error) {
            console.error('UPI Payment initiation failed:', error);
            alert(`Could not open ${app} for payment. Please try another method.`);
        }
    }

    // Event Listeners
    // Donation Buttons
    document.querySelectorAll('.donate-btn, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleDonationButton(this);
        });
    });

    // UPI App Buttons
    document.querySelectorAll('.upi-app').forEach(app => {
        app.addEventListener('click', function(e) {
            e.preventDefault();
            const upiApp = this.dataset.app;
            handleUPIPayment(upiApp);
        });
    });

    // Modal Close Interactions
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Additional Page Interactions
    // Smooth Scrolling for Navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Contact Form Handling
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

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = '#fff';
        }
    });
});
