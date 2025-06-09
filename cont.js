document.addEventListener('DOMContentLoaded', () => {
    // Feedback Form Handling
    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const resetFormButton = document.getElementById('resetFormButton');
    const stars = document.querySelectorAll('.star');
    const selectedRatingInput = document.getElementById('selectedRating');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackButton = document.getElementById('feedbackButton');
    const aboutUsModal = document.getElementById('aboutUsModal');
    const aboutUsButton = document.getElementById('aboutUsButton');
    const closeButtons = document.querySelectorAll('.close-button');

    // Star Rating Functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.value);
            selectedRatingInput.value = rating;
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add('selected');
            }
        });

        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.value);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });

    // Modals functionality
    feedbackButton.addEventListener('click', () => {
        feedbackModal.classList.remove('hidden');
    });

    aboutUsButton.addEventListener('click', () => {
        aboutUsModal.classList.remove('hidden');
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            document.getElementById(modalId).classList.add('hidden');
        });
    });

    // Close modal if clicked outside content
    window.addEventListener('click', (event) => {
        if (event.target === feedbackModal) {
            feedbackModal.classList.add('hidden');
        }
        if (event.target === aboutUsModal) {
            aboutUsModal.classList.add('hidden');
        }
    });

    // Form submission handling for Formspree
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset(); // Clear the form
                    stars.forEach(s => s.classList.remove('selected', 'hover')); // Reset stars
                    thankYouMessage.classList.remove('hidden'); // Show thank you message
                    form.classList.add('hidden'); // Hide the form
                } else {
                    alert('Oops! There was a problem submitting your feedback.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    if (resetFormButton) {
        resetFormButton.addEventListener('click', () => {
            thankYouMessage.classList.add('hidden'); // Hide thank you message
            feedbackForm.classList.remove('hidden'); // Show the form again
            selectedRatingInput.value = ''; // Clear selected rating
        });
    }

    // FAQ Toggle
    window.toggleFAQ = function(element) {
        const answer = element.nextElementSibling;
        const icon = element.querySelector('i');

        if (!answer || !icon) {
            console.error('Answer or icon not found for element:', element);
            return;
        }

        const isOpen = answer.classList.contains('open');

        document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
            openAnswer.classList.remove('open');
            openAnswer.style.maxHeight = '0';
            openAnswer.previousElementSibling.classList.remove('active');
        });

        if (!isOpen) {
            answer.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            element.classList.add('active');
        } else {
            answer.classList.remove('open');
            answer.style.maxHeight = '0';
            element.classList.remove('active');
        }
    };
});