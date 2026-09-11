// Initialize EmailJS globally at the top with your Public Key
(function(){
    emailjs.init("ofuvygiOwM7FqJmz-");
})();

window.addEventListener('DOMContentLoaded', function() {
    // 1. Handle Contact Form -> Redirects to Contact Thank-You page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            emailjs.sendForm('service_hady0bt', 'template_cbfc3mm', this)
                .then(() => {
                    window.location.href = 'thank-you-contact.html';
                }, (error) => {
                    console.error('FAILED...', error);
                    alert('Failed to send message. Please try again or call us directly.');
                });
        });
    }

    // 2. Handle Schedule Form Step 1 -> Calendar Transition & Email
    const scheduleForm = document.getElementById('schedule-form');
    const continueBtn = document.getElementById('to-calendar-btn');
    
    if (continueBtn && scheduleForm) {
        continueBtn.addEventListener('click', function() {
            const name = document.getElementById('sched-name').value;
            const email = document.getElementById('sched-email').value;
            const phone = document.getElementById('sched-phone').value;
            const address = document.getElementById('sched-address').value;

            if (!name || !email || !phone || !address) {
                alert('Please fill out all required fields before proceeding to the calendar.');
                return;
            }

            continueBtn.textContent = "Sending Details...";
            continueBtn.disabled = true;

            emailjs.sendForm('service_hady0bt', 'template_da4ka5u', scheduleForm)
                .then(() => {
                    document.getElementById('form-step-1').style.display = 'none';
                    document.getElementById('form-step-2').style.display = 'block';
                }, (error) => {
                    console.error('FAILED...', error);
                    alert('Failed to send details. Please try again.');
                    continueBtn.textContent = "Continue to Calendar";
                    continueBtn.disabled = false;
                });
        });
    }

    // 3. Handle Step 2: Back to Details Button
    const backBtn = document.getElementById('back-to-form-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.getElementById('form-step-2').style.display = 'none';
            document.getElementById('form-step-1').style.display = 'block';
            
            if (continueBtn) {
                continueBtn.textContent = "Continue to Calendar";
                continueBtn.disabled = false;
            }
        });
    }

    // 4. Handle Step 2 Final Submission / Confirmation -> Redirects to Booking Thank-You page
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = 'thank-you-booking.html';
        });
    }
});

// Listen for successful booking completion from the Google Calendar iframe
window.addEventListener('message', function(event) {
    if (event.origin.includes('calendar.google.com')) {
        try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data && (data.type === 'appointmentBookingCompleted' || data.action === 'booking_confirmed')) {
                window.location.href = 'thank-you-booking.html';
            }
        } catch (e) {
            // Fallback for cross-origin frame messages
        }
    }
});