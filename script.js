/* ============================================
   TESLA GIVEAWAY - INTERACTIVE JAVASCRIPT
   ============================================ */

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function goToClaim() {
    showPage('claimPage');
}

function goToCheckout() {
    // Validate claim form
    const form = document.getElementById('claimForm');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return;
    }

    // Save claim data
    saveClaimData();

    // Show checkout page
    showPage('checkoutPage');
    updateCheckoutDisplay();
}

function goToConfirmation() {
    // Validate payment
    const confirmCheckbox = document.getElementById('confirmPayment');
    const paymentProof = document.getElementById('paymentProof');

    if (!confirmCheckbox.checked) {
        alert('Please confirm that you have paid');
        return;
    }

    if (!paymentProof.files.length) {
        alert('Please upload payment proof');
        return;
    }

    // Show confirmation page
    showPage('confirmationPage');
    updateConfirmationDisplay();
    startCountdown();
}

// ============================================
// CLAIM PAGE FUNCTIONALITY
// ============================================

const claimData = {};

function saveClaimData() {
    // Get selected car model
    const selectedModel = document.querySelector('input[name="carModel"]:checked').value;
    claimData.carModel = selectedModel;

    // Get personal info
    claimData.fullName = document.getElementById('fullName').value;
    claimData.phone = document.getElementById('phone').value;
    claimData.email = document.getElementById('email').value;

    // Get delivery address
    claimData.street = document.getElementById('street').value;
    claimData.city = document.getElementById('city').value;
    claimData.state = document.getElementById('state').value;
    claimData.country = document.getElementById('country').value;
    claimData.zip = document.getElementById('zip').value;

    // Update delivery display
    updateDeliveryDisplay();

    // Save to localStorage
    localStorage.setItem('claimData', JSON.stringify(claimData));
}

function updateDeliveryDisplay() {
    const addressDisplay = document.getElementById('deliveryDisplay');
    const addressText = `${claimData.street}<br>${claimData.city}, ${claimData.state} ${claimData.zip}<br>${claimData.country}`;
    addressDisplay.innerHTML = addressText;
}

// Real-time address update as user types
document.addEventListener('DOMContentLoaded', () => {
    const addressFields = ['street', 'city', 'state', 'country', 'zip'];
    addressFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('change', updateDeliveryDisplay);
        }
    });

    // Car model selection
    document.querySelectorAll('input[name="carModel"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.car-model-card').forEach(card => {
                card.classList.remove('active');
            });
            e.target.parentElement.classList.add('active');
        });
    });
});

// ============================================
// CHECKOUT PAGE FUNCTIONALITY
// ============================================

function updateCheckoutDisplay() {
    // Update car model display
    const carModel = claimData.carModel || 'Model 3';
    document.getElementById('carModelDisplay').textContent = `Tesla ${carModel} 2025`;
    document.getElementById('summaryFee').textContent = '$299';
    document.getElementById('summaryTime').textContent = '10–14 business days';
    document.getElementById('totalValue').textContent = '$299';
}

// Delivery option selection
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const card = e.target.closest('.delivery-card');
            const fee = card.getAttribute('data-fee');
            const time = card.getAttribute('data-time');

            // Update all delivery cards styling
            document.querySelectorAll('.delivery-card').forEach(c => {
                c.classList.remove('active');
            });
            card.classList.add('active');

            // Update summary
            document.getElementById('summaryFee').textContent = `$${fee}`;
            document.getElementById('summaryTime').textContent = time;
            document.getElementById('totalValue').textContent = `$${fee}`;
        });
    });

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-card').forEach(card => {
                card.classList.remove('active');
            });
            e.target.closest('.payment-card').classList.add('active');
        });
    });

    // File upload handler
    const paymentProof = document.getElementById('paymentProof');
    if (paymentProof) {
        paymentProof.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const status = document.getElementById('uploadStatus');
                status.textContent = `✓ ${file.name} uploaded`;
                status.style.color = '#e82127';
            }
        });
    }
});

// ============================================
// CONFIRMATION PAGE FUNCTIONALITY
// ============================================

function updateConfirmationDisplay() {
    // Load claim data
    const savedData = localStorage.getItem('claimData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        const carModel = data.carModel || 'Model 3';
        document.getElementById('confirmCarModel').textContent = `Tesla ${carModel} 2025`;
        document.getElementById('confirmName').textContent = data.fullName || 'John Doe';
    }

    // Get delivery option
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    if (selectedDelivery) {
        const deliveryMethod = selectedDelivery.value;
        const fee = selectedDelivery.closest('.delivery-card').getAttribute('data-fee');
        
        document.getElementById('confirmDelivery').textContent = `${deliveryMethod} Delivery`;
        document.getElementById('confirmFee').textContent = `$${fee}`;
    } else {
        document.getElementById('confirmDelivery').textContent = 'Standard Delivery';
        document.getElementById('confirmFee').textContent = '$299';
    }

    // Generate tracking ID
    const trackingId = `TES-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    document.getElementById('trackingId').textContent = trackingId;
}

// Countdown timer
function startCountdown() {
    let seconds = 13;
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(interval);
            // Redirect to home
            window.location.href = '/';
        }
    }, 1000);
}

// ============================================
// LOCAL STORAGE PERSISTENCE
// ============================================

window.addEventListener('beforeunload', () => {
    if (Object.keys(claimData).length > 0) {
        localStorage.setItem('claimData', JSON.stringify(claimData));
    }
});

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('claimData');
    if (savedData) {
        Object.assign(claimData, JSON.parse(savedData));
    }
});

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Show claim page by default
    showPage('claimPage');

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Prevent form submission on Enter
    document.getElementById('claimForm').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Add validation listeners
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#e82127';
            } else {
                emailInput.style.borderColor = '';
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value && !validatePhone(phoneInput.value)) {
                phoneInput.style.borderColor = '#e82127';
            } else {
                phoneInput.style.borderColor = '';
            }
        });
    }
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id !== 'claimPage') {
            goToClaim();
        }
    }
});

// Focus management
function manageFocus(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        const firstInput = page.querySelector('input, button, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}
