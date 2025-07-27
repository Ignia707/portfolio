document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling Navigation Logic ---
    const navLinks = document.querySelectorAll('nav.main-nav ul li a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href'); // Get the ID from the href (e.g., "#education")
            const targetSection = document.querySelector(targetId); // Find the corresponding section element

            if (targetSection) {
                // Get the height of the sticky navigation bar
                const mainNavHeight = document.querySelector('.main-nav').offsetHeight;

                // Scroll to the target section, adjusting for the sticky header
                window.scrollTo({
                    top: targetSection.offsetTop - mainNavHeight,
                    behavior: 'smooth' // Smooth scroll effect
                });
            }
        });
    });

    // --- Fade-in Animations & Skills Progress Bar Logic (Intersection Observer) ---
    // Select all elements that should fade in on scroll
    const faders = document.querySelectorAll('.fade-in-on-scroll');

    // Select all skill categories to animate their progress bars
    const skillCategories = document.querySelectorAll('.skill-category');

    // Options for the Intersection Observer
    const appearOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Start animation 50px before bottom of viewport
    };

    // Create a new Intersection Observer instance
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // If element is not visible, do nothing
                return;
            } else {
                // If element is visible, add 'is-visible' class to trigger CSS animation
                entry.target.classList.add('is-visible');
                // Stop observing this element, so animation only runs once
                observer.unobserve(entry.target);

                // --- Skill Progress Bar Specific Animation ---
                // Check if the observed element is a skill category
                if (entry.target.classList.contains('skill-category')) {
                    // Get the proficiency value from the data-proficiency attribute
                    const proficiency = entry.target.dataset.proficiency;
                    // Find the progress bar fill element within this skill category
                    const progressBarFill = entry.target.querySelector('.skill-progress-fill');

                    // If both the fill element and proficiency value exist
                    if (progressBarFill && proficiency) {
                        // Set the width of the fill element to the proficiency percentage, triggering CSS transition
                        progressBarFill.style.width = proficiency + '%';
                    }
                }
            }
        });
    }, appearOptions); // Pass the defined options to the observer

    // Observe each element that should fade in
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Also observe each skill category to trigger their progress bar animations
    // (This is important even if they also have 'fade-in-on-scroll' because the skill bar logic
    // is specific to the 'skill-category' class within the observer callback)
    skillCategories.forEach(category => {
        appearOnScroll.observe(category);
    });


    // --- Scroll Progress Indicator Logic ---
    const progressBar = document.getElementById('scroll-progress-bar');

    function updateScrollProgress() {
        // document.documentElement.scrollHeight is the total scrollable height of the document.
        // document.documentElement.clientHeight is the height of the viewport.
        // Subtracting them gives the maximum scroll distance.
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // document.documentElement.scrollTop is the current scroll position from the top.
        const scrolled = document.documentElement.scrollTop;

        // Calculate the scroll percentage (0-100)
        const progress = (scrolled / totalHeight) * 100;

        // Update the width style of the progress bar element
        progressBar.style.width = progress + '%';
    }

    // Attach the updateScrollProgress function to the window's scroll event
    window.addEventListener('scroll', updateScrollProgress);

    // Call it once on load to set the initial position (e.g., if page loads partially scrolled)
    updateScrollProgress();


    // --- Project Detail Modal Logic ---
    const projectItems = document.querySelectorAll('.project-item'); // Select all project cards
    const modal = document.getElementById('project-modal'); // The modal overlay element
    const closeButton = document.querySelector('.close-button'); // The close button inside the modal

    // Get references to elements within the modal where content will be displayed
    const modalTitle = document.getElementById('modal-project-title');
    const modalDescription = document.getElementById('modal-project-description');
    const modalDemoLink = document.getElementById('modal-project-demo');
    const modalGithubLink = document.getElementById('modal-project-github');
    const modalTechContainer = document.getElementById('modal-project-tech'); // Container for tech tags

    // Add click event listener to each project item
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            // Retrieve data from data- attributes on the clicked project item
            const title = item.dataset.title;
            const description = item.dataset.description;
            const techString = item.dataset.tech; // Tech tags as a comma-separated string
            const githubLink = item.dataset.github;
            const demoLink = item.dataset.demo;

            // Populate the modal content with retrieved data
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            // Clear any previously loaded tech tags
            modalTechContainer.innerHTML = '';
            // If techString exists, create and append new tech tags
            if (techString) {
                techString.split(',').forEach(tech => { // Split the string by comma
                    const trimmedTech = tech.trim(); // Remove leading/trailing whitespace
                    if (trimmedTech) {
                        const span = document.createElement('span'); // Create a new span element
                        span.classList.add('tech-tag'); // Add the tech-tag class for styling
                        span.textContent = trimmedTech; // Set its text content
                        modalTechContainer.appendChild(span); // Add to the modal's tech container
                    }
                });
            }

            // Set hrefs for demo and GitHub links and control their visibility
            if (demoLink) {
                modalDemoLink.href = demoLink;
                modalDemoLink.style.display = 'inline-flex'; // Show the button
            } else {
                modalDemoLink.style.display = 'none'; // Hide if no demo link
            }

            if (githubLink) {
                modalGithubLink.href = githubLink;
                modalGithubLink.style.display = 'inline-flex'; // Show the button
            } else {
                modalGithubLink.style.display = 'none'; // Hide if no GitHub link
            }

            // Display the modal by setting its display property to 'flex' (for centering)
            modal.style.display = 'flex';
            // Prevent scrolling on the body while the modal is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Add event listener for the close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal
        document.body.style.overflow = ''; // Restore body scrolling
    });

    // Add event listener to close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) { // If the click target is the modal overlay itself
            modal.style.display = 'none'; // Hide the modal
            document.body.style.overflow = ''; // Restore body scrolling
        }
    });

    // Add event listener to close modal with 'Escape' key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none'; // Hide the modal
            document.body.style.overflow = ''; // Restore body scrolling
        }
    });

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) { // Ensure the form exists before adding listeners
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button to prevent multiple submissions
            formStatus.textContent = 'Sending...'; // Update status message
            formStatus.className = 'form-status'; // Reset class

            const formData = new FormData(contactForm);
            // Formspree requires a specific name for email subject, which is handled in HTML with name="_subject"
            // If you want to customize it more, you can manually set it here:
            // formData.append('_subject', 'New message from your portfolio site!');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Formspree needs this header
                    }
                });

                if (response.ok) { // Check if the response was successful (HTTP status 200 OK)
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.classList.add('success');
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Handle non-OK responses (e.g., server errors, Formspree issues)
                    const data = await response.json();
                    if (data.errors) {
                        formStatus.textContent = 'Error: ' + data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = 'Oops! There was an issue sending your message.';
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                // Handle network errors (e.g., no internet connection)
                formStatus.textContent = 'Network error. Please try again later.';
                formStatus.classList.add('error');
                console.error('Form submission error:', error);
            } finally {
                submitButton.disabled = false; // Re-enable button
                // Clear status message after a few seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }
});