// ============================================
// LEARNSYNERGY - COMPLETE LANDING PAGE JS
// Backend Ready with API Integration
// Version: 2.0.0 - Light Mode Only
// ============================================

class LearnSynergyApp {
    constructor() {
        this.state = {
            isLoading: true,
            isMobileMenuOpen: false,
            currentModal: null,
            apiBaseUrl: 'https://api.learnsynergy.app/v1',
            user: this.getStoredUser(),
            authToken: this.getStoredToken()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.simulateLoading();
        this.updateCurrentYear();
        this.setupCodeHighlighting();
        this.updateUIForAuth();
    }
    
    // ===== AUTH METHODS =====
    getStoredUser() {
        try {
            const user = localStorage.getItem('learnsynergy_user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }
    
    getStoredToken() {
        return localStorage.getItem('learnsynergy_token');
    }
    
    storeUser(user, token) {
        localStorage.setItem('learnsynergy_user', JSON.stringify(user));
        localStorage.setItem('learnsynergy_token', token);
        this.state.user = user;
        this.state.authToken = token;
        this.updateUIForAuth();
    }
    
    clearUser() {
        localStorage.removeItem('learnsynergy_user');
        localStorage.removeItem('learnsynergy_token');
        this.state.user = null;
        this.state.authToken = null;
        this.updateUIForAuth();
    }
    
    updateUIForAuth() {
        const loginBtn = document.getElementById('loginBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const joinFreeBtn = document.getElementById('joinFreeBtn');
        
        if (this.state.user) {
            // User is logged in
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
                loginBtn.onclick = () => this.redirectToDashboard();
            }
            
            if (getStartedBtn) {
                getStartedBtn.innerHTML = '<i class="fas fa-rocket"></i> Go to Dashboard';
                getStartedBtn.onclick = () => this.redirectToDashboard();
            }
            
            if (joinFreeBtn) {
                joinFreeBtn.innerHTML = '<i class="fas fa-rocket"></i> Go to Dashboard';
                joinFreeBtn.onclick = () => this.redirectToDashboard();
            }
        } else {
            // User is not logged in
            if (loginBtn) {
                loginBtn.innerHTML = 'Log In';
                loginBtn.onclick = () => this.showModal('loginModal');
            }
            
            if (getStartedBtn) {
                getStartedBtn.innerHTML = '<i class="fas fa-rocket"></i> Get Started';
                getStartedBtn.onclick = () => this.showModal('signupModal');
            }
            
            if (joinFreeBtn) {
                joinFreeBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Learning Free';
                joinFreeBtn.onclick = () => this.showModal('signupModal');
            }
        }
    }
    
    redirectToDashboard() {
        // Redirect to actual dashboard
        window.open('https://app.learnsynergy.com/dashboard', '_blank');
    }
    
    // ===== API METHODS =====
    async apiRequest(endpoint, options = {}) {
        const url = `${this.state.apiBaseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.state.authToken) {
            headers['Authorization'] = `Bearer ${this.state.authToken}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            this.showError('Network error. Please try again.');
            throw error;
        }
    }
    
    async submitEarlyAccess(email) {
        this.showLoading('Submitting your request...');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.hideLoading();
            this.showSuccess('Success! You\'ve been added to our early access list.', email);
            
            // Store in local storage for demo
            const waitlist = JSON.parse(localStorage.getItem('learnsynergy_waitlist') || '[]');
            waitlist.push({ email, timestamp: new Date().toISOString() });
            localStorage.setItem('learnsynergy_waitlist', JSON.stringify(waitlist));
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to submit. Please try again.');
        }
    }
    
    async handleLogin(email, password) {
        this.showLoading('Signing you in...');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Demo user data
            const user = {
                id: 'user_123',
                email: email,
                username: email.split('@')[0],
                name: 'Demo User',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
                role: 'user'
            };
            
            const token = 'demo_token_' + Date.now();
            
            this.storeUser(user, token);
            this.hideLoading();
            this.hideModal();
            this.showSuccess('Successfully logged in! Redirecting to dashboard...', email);
            
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1500);
            
        } catch (error) {
            this.hideLoading();
            this.showError('Login failed. Please check your credentials.');
        }
    }
    
    async handleSignup(username, email, password) {
        this.showLoading('Creating your account...');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const user = {
                id: 'user_' + Date.now(),
                email: email,
                username: username,
                name: username.charAt(0).toUpperCase() + username.slice(1),
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
                role: 'user'
            };
            
            const token = 'demo_token_' + Date.now();
            
            this.storeUser(user, token);
            this.hideLoading();
            this.hideModal();
            this.showSuccess('Account created successfully! Welcome to LearnSynergy.', email);
            
            setTimeout(() => {
                this.redirectToDashboard();
            }, 2000);
            
        } catch (error) {
            this.hideLoading();
            this.showError('Signup failed. Please try again.');
        }
    }
    
    // ===== MODAL METHODS =====
    showModal(modalId, data = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.state.currentModal = modalId;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Update modal content with data
        if (data.message && modal.querySelector('.success-message')) {
            modal.querySelector('.success-message').textContent = data.message;
        }
        
        if (data.email && modal.querySelector('#successEmail')) {
            modal.querySelector('#successEmail').textContent = data.email;
        }
        
        if (data.error && modal.querySelector('#errorMessage')) {
            modal.querySelector('#errorMessage').textContent = data.error;
        }
        
        // Focus first input in modal
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    hideModal() {
        if (!this.state.currentModal) return;
        
        const modal = document.getElementById(this.state.currentModal);
        if (modal) {
            modal.classList.remove('active');
        }
        
        this.state.currentModal = null;
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }
    
    showLoading(message = 'Processing...') {
        this.showModal('loadingModal', { message });
    }
    
    hideLoading() {
        if (this.state.currentModal === 'loadingModal') {
            this.hideModal();
        }
    }
    
    showSuccess(message, email = '') {
        this.showModal('successModal', { message, email });
    }
    
    showError(message) {
        this.showModal('errorModal', { error: message });
    }
    
    // ===== FORM VALIDATION =====
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePassword(password) {
        return password.length >= 8;
    }
    
    validateUsername(username) {
        return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    }
    
    showFormError(input, message) {
        // Remove existing error
        const existingError = input.parentElement.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Add error class
        input.classList.add('error');
        
        // Create error element
        const error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        error.style.cssText = `
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentElement.appendChild(error);
        
        // Focus input
        input.focus();
        
        // Auto remove
        setTimeout(() => {
            input.classList.remove('error');
            if (error.parentElement) error.remove();
        }, 3000);
    }
    
    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                this.state.isMobileMenuOpen = navLinks.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', this.state.isMobileMenuOpen);
                
                // Update icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = this.state.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
                }
            });
        }
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.state.isMobileMenuOpen && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.menu-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on nav link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideModal();
            });
        });
        
        // Modal background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.currentModal) {
                this.hideModal();
            }
        });
        
        // Early access form
        const earlyAccessForm = document.getElementById('earlyAccessForm');
        if (earlyAccessForm) {
            earlyAccessForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('emailInput').value.trim();
                
                if (!this.validateEmail(email)) {
                    this.showFormError(document.getElementById('emailInput'), 'Please enter a valid email');
                    return;
                }
                
                this.submitEarlyAccess(email);
                earlyAccessForm.reset();
            });
        }
        
        // Watch demo button
        const watchDemoBtn = document.getElementById('watchDemoBtn');
        if (watchDemoBtn) {
            watchDemoBtn.addEventListener('click', () => {
                this.showModal('demoModal');
            });
        }
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Password toggle
            const togglePassword = loginForm.querySelector('#togglePassword');
            if (togglePassword) {
                togglePassword.addEventListener('click', () => {
                    const passwordInput = loginForm.querySelector('#loginPassword');
                    const type = passwordInput.type === 'password' ? 'text' : 'password';
                    passwordInput.type = type;
                    togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                });
            }
            
            // Forgot password
            const forgotPasswordLink = document.getElementById('forgotPasswordLink');
            if (forgotPasswordLink) {
                forgotPasswordLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hideModal();
                    this.showModal('forgotPasswordModal');
                });
            }
            
            // Sign in button
            const signInBtn = document.getElementById('signInBtn');
            if (signInBtn) {
                signInBtn.addEventListener('click', () => {
                    const email = document.getElementById('loginEmail').value.trim();
                    const password = document.getElementById('loginPassword').value.trim();
                    
                    if (!this.validateEmail(email)) {
                        this.showFormError(document.getElementById('loginEmail'), 'Please enter a valid email');
                        return;
                    }
                    
                    if (!this.validatePassword(password)) {
                        this.showFormError(document.getElementById('loginPassword'), 'Password must be at least 8 characters');
                        return;
                    }
                    
                    this.handleLogin(email, password);
                });
            }
            
            // Create account button in login modal
            const createAccountBtn = document.getElementById('createAccountBtn');
            if (createAccountBtn) {
                createAccountBtn.addEventListener('click', () => {
                    this.hideModal();
                    this.showModal('signupModal');
                });
            }
            
            // Enter key to submit login
            loginForm.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    signInBtn.click();
                }
            });
        }
        
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            // Password toggle
            const toggleSignupPassword = signupForm.querySelector('#toggleSignupPassword');
            if (toggleSignupPassword) {
                toggleSignupPassword.addEventListener('click', () => {
                    const passwordInput = signupForm.querySelector('#signupPassword');
                    const type = passwordInput.type === 'password' ? 'text' : 'password';
                    passwordInput.type = type;
                    toggleSignupPassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                });
            }
            
            // Password strength
            const passwordInput = signupForm.querySelector('#signupPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', () => {
                    this.updatePasswordStrength(passwordInput.value);
                });
            }
            
            // Create account button
            const createAccountBtn2 = document.getElementById('createAccountBtn2');
            if (createAccountBtn2) {
                createAccountBtn2.addEventListener('click', () => {
                    const username = document.getElementById('signupUsername').value.trim();
                    const email = document.getElementById('signupEmail').value.trim();
                    const password = document.getElementById('signupPassword').value.trim();
                    const confirmPassword = document.getElementById('confirmPassword').value.trim();
                    const termsAgreed = document.getElementById('termsAgreement').checked;
                    
                    if (!this.validateUsername(username)) {
                        this.showFormError(document.getElementById('signupUsername'), 'Username must be at least 3 characters (letters, numbers, underscores only)');
                        return;
                    }
                    
                    if (!this.validateEmail(email)) {
                        this.showFormError(document.getElementById('signupEmail'), 'Please enter a valid email');
                        return;
                    }
                    
                    if (!this.validatePassword(password)) {
                        this.showFormError(document.getElementById('signupPassword'), 'Password must be at least 8 characters');
                        return;
                    }
                    
                    if (password !== confirmPassword) {
                        this.showFormError(document.getElementById('confirmPassword'), 'Passwords do not match');
                        return;
                    }
                    
                    if (!termsAgreed) {
                        this.showError('Please agree to the Terms of Service and Privacy Policy');
                        return;
                    }
                    
                    this.handleSignup(username, email, password);
                });
            }
            
            // Have account button
            const haveAccountBtn = document.getElementById('haveAccountBtn');
            if (haveAccountBtn) {
                haveAccountBtn.addEventListener('click', () => {
                    this.hideModal();
                    this.showModal('loginModal');
                });
            }
            
            // Enter key to submit signup
            signupForm.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    createAccountBtn2.click();
                }
            });
        }
        
        // Forgot password modal
        const sendResetLinkBtn = document.getElementById('sendResetLinkBtn');
        if (sendResetLinkBtn) {
            sendResetLinkBtn.addEventListener('click', () => {
                const email = document.getElementById('resetEmail').value.trim();
                
                if (!this.validateEmail(email)) {
                    this.showFormError(document.getElementById('resetEmail'), 'Please enter a valid email');
                    return;
                }
                
                this.showLoading('Sending reset link...');
                
                // Simulate API call
                setTimeout(() => {
                    this.hideLoading();
                    this.hideModal();
                    this.showSuccess('Password reset link sent! Check your email.', email);
                }, 1500);
            });
        }
        
        const cancelResetBtn = document.getElementById('cancelResetBtn');
        if (cancelResetBtn) {
            cancelResetBtn.addEventListener('click', () => {
                this.hideModal();
                this.showModal('loginModal');
            });
        }
        
        // Success modal OK button
        const successOkBtn = document.getElementById('successOkBtn');
        if (successOkBtn) {
            successOkBtn.addEventListener('click', () => this.hideModal());
        }
        
        // Error modal OK button
        const errorModalBtn = document.querySelector('#errorModal .modal-btn');
        if (errorModalBtn) {
            errorModalBtn.addEventListener('click', () => this.hideModal());
        }
        
        // Demo modal watch button
        const demoWatchBtn = document.querySelector('#demoModal .modal-btn-primary');
        if (demoWatchBtn) {
            demoWatchBtn.addEventListener('click', () => {
                window.open('https://app.learnsynergy.com/demo', '_blank');
            });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
        
        // Window scroll for navbar shadow
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.state.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // External link tracking
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const url = link.href;
                console.log('External link clicked:', url);
                // You could add analytics tracking here
            });
        });
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navLinks) navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
        this.state.isMobileMenuOpen = false;
    }
    
    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar .strength-bar');
        const strengthText = document.querySelector('.strength-text span');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let color = '#EF4444';
        let text = 'Weak';
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        if (strength >= 75) {
            color = '#10B981';
            text = 'Strong';
        } else if (strength >= 50) {
            color = '#F59E0B';
            text = 'Medium';
        } else if (strength >= 25) {
            color = '#EF4444';
            text = 'Weak';
        } else {
            color = '#6B7280';
            text = 'None';
        }
        
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    // ===== LOADER & UI METHODS =====
    simulateLoading() {
        const loader = document.getElementById('loader');
        const landingPage = document.getElementById('landingPage');
        const progressBar = document.getElementById('progressBar');
        
        if (!loader || !landingPage) return;
        
        let progress = 0;
        const steps = ['step1', 'step2', 'step3'];
        let currentStep = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            if (progress >= 30 && currentStep === 0) {
                this.updateStep(steps[0]);
                currentStep = 1;
            }
            if (progress >= 60 && currentStep === 1) {
                this.updateStep(steps[1]);
                currentStep = 2;
            }
            if (progress >= 90 && currentStep === 2) {
                this.updateStep(steps[2]);
            }
            
            if (progress >= 100) {
                this.completeLoading();
            } else {
                setTimeout(updateProgress, 200);
            }
        };
        
        setTimeout(updateProgress, 500);
    }
    
    updateStep(stepId) {
        const step = document.getElementById(stepId);
        if (step) {
            step.classList.add('active');
            setTimeout(() => {
                step.classList.add('completed');
            }, 500);
        }
    }
    
    completeLoading() {
        const loader = document.getElementById('loader');
        const landingPage = document.getElementById('landingPage');
        
        if (!loader || !landingPage) return;
        
        loader.classList.add('fade-out');
        this.state.isLoading = false;
        
        setTimeout(() => {
            loader.style.display = 'none';
            landingPage.style.opacity = '1';
            landingPage.removeAttribute('aria-hidden');
            document.body.style.overflow = '';
            this.setupAnimations();
            
            // Trigger initial scroll for navbar
            window.dispatchEvent(new Event('scroll'));
        }, 800);
    }
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.feature-card, .step-card, .testimonial-card, .code-window, .stat').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupCodeHighlighting() {
        const codeElement = document.querySelector('.code-content code');
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        const highlighted = code
            .replace(/\b(const|return|join)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(learnSynergy|learner|knowledge|network)\b/g, '<span class="variable">$1</span>')
            .replace(/\("([^"]+)"\)/g, '(<span class="string">"$1"</span>)')
            .replace(/\/\/[^\n]*/g, '<span class="comment">$&</span>');
        
        codeElement.innerHTML = highlighted;
    }
    
    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.LearnSynergyApp = new LearnSynergyApp();
    console.log('LearnSynergy App Initialized 🚀');
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Show user-friendly error only if not already showing modal
    if (window.LearnSynergyApp && !document.querySelector('.global-error') && !window.LearnSynergyApp.state.currentModal) {
        window.LearnSynergyApp.showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Handle offline/online status
window.addEventListener('offline', () => {
    if (window.LearnSynergyApp) {
        window.LearnSynergyApp.showError('You are offline. Please check your connection.');
    }
});

window.addEventListener('online', () => {
    const errorModal = document.getElementById('errorModal');
    if (errorModal && errorModal.classList.contains('active')) {
        window.LearnSynergyApp.hideModal();
    }
});