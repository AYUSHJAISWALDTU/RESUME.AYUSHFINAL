// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initModalFunctionality();
    initSmoothScrolling();
    
    // Load dynamic content from API
    loadProjects();
    loadSkills();
    loadCertificates();
});

// Navigation functionality
function initNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Highlight active navigation link
    window.addEventListener('scroll', highlightActiveNavLink);
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-slide-up, .project-card, .certificate-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Animate skill pills on scroll
    const skillPills = document.querySelectorAll('.skill-pill');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            }
        });
    }, observerOptions);

    skillPills.forEach((pill, index) => {
        pill.style.opacity = '0';
        pill.style.animationDelay = `${index * 0.1}s`;
        skillObserver.observe(pill);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !message) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to backend API
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Show success message
                showToast(data.message, 'success');
                
                // Reset form
                form.reset();
            } else {
                // Show error message
                showToast(data.message || 'Failed to send message. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            
            // Fallback to mailto
            const subject = encodeURIComponent('Portfolio Contact: Message from ' + name);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`
            );
            
            const mailtoLink = `mailto:ayushjaiswa00004@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            showToast('Opening email client as fallback...', 'info');
            form.reset();
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('i');
    const toastText = toast.querySelector('span');
    
    // Set message and icon based on type
    toastText.textContent = message;
    
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.background = '#10b981';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.style.background = '#ef4444';
    } else if (type === 'info') {
        toastIcon.className = 'fas fa-info-circle';
        toast.style.background = '#3b82f6';
    } else if (type === 'loading') {
        toastIcon.className = 'fas fa-spinner fa-spin';
        toast.style.background = '#7C3AED';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Modal functionality for certificate images
function initModalFunctionality() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Open modal function (called from HTML)
function openModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modal.style.display = 'block';
    modalImage.src = imgElement.src;
    modalImage.alt = imgElement.alt;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Close modal function (called from HTML)
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Typing animation for hero title (optional enhancement)
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// Particle background animation (optional enhancement)
function createParticleBackground() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(124, 58, 237, 0.3);
            border-radius: 50%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
    
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Theme toggle functionality (bonus feature)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #7C3AED, #9333ea);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress indicator
initScrollProgress();

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(highlightActiveNavLink, 100);
window.addEventListener('scroll', debouncedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        './assets/Ayush.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Error handling for missing images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Add loading animation to buttons
function addButtonLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    return function removeLoadingState() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and tracking (placeholder for Google Analytics or similar)
function trackEvent(eventName, eventData) {
    // Replace with your analytics tracking code
    console.log('Event tracked:', eventName, eventData);
    
    // Example for Google Analytics
    // gtag('event', eventName, eventData);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            page_location: window.location.href
        });
    }
});

// Console welcome message
console.log(`
🚀 Welcome to Ayush Jaiswal's Portfolio!
📧 Contact: ayushjaiswa00004@gmail.com
🔗 GitHub: https://github.com/AYUSHJAISWALDTU
💼 Built with HTML, CSS, and JavaScript
`);

// Accessibility improvements
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #7C3AED;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.id = 'main-content';
    }
    
    // Enhance keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName === 'A') {
                this.click();
            }
        });
    });
}

// Initialize accessibility features
initAccessibility();

// API Functions for Dynamic Content
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects?featured=true&limit=7`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                updateProjectsSection(data.data);
            }
        }
    } catch (error) {
        console.log('Using static projects (API not available):', error);
    }
}

async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateSkillsSection(data.data);
            }
        }
    } catch (error) {
        console.log('Using static skills (API not available):', error);
    }
}

async function loadCertificates() {
    try {
        const response = await fetch(`${API_BASE_URL}/certificates?featured=true`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                updateCertificatesSection(data.data);
            }
        }
    } catch (error) {
        console.log('Using static certificates (API not available):', error);
    }
}

function updateProjectsSection(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card animate-slide-up">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-type">${project.type}</div>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.githubUrl ? `
                    <a href="${project.githubUrl}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> Code
                    </a>
                ` : ''}
                ${project.demoUrl ? `
                    <a href="${project.demoUrl}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                ` : `
                    <a href="#" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                `}
            </div>
        </div>
    `).join('');
    
    // Re-initialize animations for new content
    initScrollAnimations();
}

function updateSkillsSection(skillsData) {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;
    
    // Group skills by category if they're not already grouped
    const groupedSkills = Array.isArray(skillsData) ? 
        skillsData.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {}) : skillsData;
    
    skillsContainer.innerHTML = Object.entries(groupedSkills).map(([category, skills]) => `
        <div class="skills-category">
            <h3>${category}</h3>
            <div class="skills-pills">
                ${skills.map(skill => `<span class="skill-pill">${skill.name}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // Re-initialize animations for new content
    initScrollAnimations();
}

function updateCertificatesSection(certificates) {
    const certificatesGrid = document.querySelector('.certificates-grid');
    if (!certificatesGrid) return;
    
    certificatesGrid.innerHTML = certificates.map(cert => `
        <div class="certificate-card animate-slide-up">
            <div class="certificate-image">
                <img src="${cert.imageUrl || `https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=${encodeURIComponent(cert.title)}`}" 
                     alt="${cert.title}" 
                     onclick="openModal(this)">
                <div class="certificate-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
            <div class="certificate-content">
                <h3>${cert.title}</h3>
                <p>${cert.description}</p>
                <a href="${cert.imageUrl || '#'}" download class="download-btn">
                    <i class="fas fa-download"></i> Download
                </a>
            </div>
        </div>
    `).join('');
    
    // Re-initialize animations for new content
    initScrollAnimations();
}

// Simple download handler with fallbacks
function handleDownload(event, certName) {
    event.preventDefault(); // Prevent default link behavior
    
    const basePath = './assets/certificates/';
    const pdfPath = `${basePath}${certName}.pdf`;
    const imagePath = `${basePath}${certName}.jpg`;
    
    // Try to download PDF first
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${certName}-certificate.pdf`;
    link.style.display = 'none';
    
    // Add error handler for missing PDF
    link.onerror = function() {
        console.log('PDF not found, trying image...');
        // Try image instead
        link.href = imagePath;
        link.download = `${certName}-certificate.jpg`;
        
        link.onerror = function() {
            // If both fail, show message and open email
            showToast('Certificate file not available. Opening email to request copy...', 'info');
            
            const subject = encodeURIComponent(`Request for ${certName} Certificate`);
            const body = encodeURIComponent(`Hi Ayush,\n\nI would like to request a copy of your ${certName} certificate.\n\nThank you!`);
            const emailLink = `mailto:ayushjaiswa00004@gmail.com?subject=${subject}&body=${body}`;
            
            setTimeout(() => {
                window.open(emailLink, '_blank');
            }, 1500);
            return;
        };
    };
    
    // Append link and trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showToast('Starting download...', 'success');
}

// Alternative simple download function
function downloadCertificateSimple(certName) {
    // Direct download attempt
    const pdfUrl = `./assets/certificates/${certName}.pdf`;
    
    // Create temporary link
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${certName}-certificate.pdf`;
    link.click();
    
    showToast('Download started!', 'success');
}

// Helper function to download files
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add certificate management helper
function addCertificateFile(certName, file) {
    // This function can be extended for dynamic certificate upload
    // For now, it provides guidance on adding certificates
    console.log(`To add ${certName} certificate:`);
    console.log(`1. Save file as: ./assets/certificates/${certName}.pdf or ${certName}.jpg`);
    console.log(`2. Refresh the portfolio`);
    console.log(`3. Download will work automatically`);
}
