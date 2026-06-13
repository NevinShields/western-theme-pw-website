document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Page Loader & Scroll Initialization
       ========================================================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                // Trigger hero animations explicitly once loader leaves
                triggerScrollAnimations();
            }, 800); // Wait for the transition bar animation
        });
        
        // Fallback if load event fires before DOMContentLoaded binds it
        setTimeout(() => {
            loader.classList.add('fade-out');
            triggerScrollAnimations();
        }, 3000);
    }

    // Scroll header background transition
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. Mobile Navigation Menu Toggle
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileOverlay) {
        const toggleMobileMenu = () => {
            mobileToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        mobileToggle.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    /* ==========================================================================
       3. Floating Sunbeam Dust Particles (Canvas Engine)
       ========================================================================== */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        // Resize Handler
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5; // Small dust spots
                this.speedX = Math.random() * 0.4 - 0.2; // Slow drift
                this.speedY = -(Math.random() * 0.6 + 0.2); // Slow rise
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.active = true;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Sway drift
                this.speedX += Math.sin(this.y * 0.01) * 0.01;

                // Fade out as it nears top
                if (this.y < 50) {
                    this.opacity -= 0.01;
                }

                if (this.opacity <= 0 || this.y < 0 || this.x < 0 || this.x > canvas.width) {
                    this.active = false;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 176, 140, ${this.opacity})`; // Weathered Tan dust color
                ctx.fill();
            }
        }

        const initParticles = () => {
            particlesArray = [];
            for (let i = 0; i < 40; i++) {
                particlesArray.push(new Particle());
            }
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Add new particles to keep count steady
            if (particlesArray.length < 50 && Math.random() < 0.15) {
                particlesArray.push(new Particle());
            }

            for (let i = particlesArray.length - 1; i >= 0; i--) {
                const p = particlesArray[i];
                p.update();
                if (p.active) {
                    p.draw();
                } else {
                    particlesArray.splice(i, 1);
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    /* ==========================================================================
       4. Scroll-Triggered Fade-Up Animations (IntersectionObserver)
       ========================================================================== */
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const triggerScrollAnimations = () => {
        fadeUpElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.85;
            if (isVisible) {
                el.classList.add('animated');
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeUpElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', triggerScrollAnimations);
        triggerScrollAnimations();
    }

    /* ==========================================================================
       5. Before & After Interactive Sliders
       ========================================================================== */
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            sliderWrappers.forEach(w => w.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetWrapper = document.getElementById(targetId);
            if (targetWrapper) {
                targetWrapper.classList.add('active');
                // Reinitialize slider bounds on switch
                const slider = targetWrapper.querySelector('.before-after-slider');
                if (slider) adjustSliderWidths(slider);
            }
        });
    });

    // Handle width alignment on resize
    const adjustSliderWidths = (slider) => {
        const sliderWidth = slider.offsetWidth;
        const imgs = slider.querySelectorAll('img');
        const placeholders = slider.querySelectorAll('.fallback-placeholder');
        
        imgs.forEach(img => {
            img.style.width = `${sliderWidth}px`;
        });
        placeholders.forEach(pl => {
            pl.style.width = `${sliderWidth}px`;
        });
    };

    const initSliders = () => {
        const sliders = document.querySelectorAll('.before-after-slider');
        
        sliders.forEach(slider => {
            adjustSliderWidths(slider);
            window.addEventListener('resize', () => adjustSliderWidths(slider));

            const beforeContainer = slider.querySelector('.before-img');
            const handle = slider.querySelector('.slider-handle');
            let isDragging = false;

            const moveSlider = (clientX) => {
                const rect = slider.getBoundingClientRect();
                const x = clientX - rect.left;
                let percentage = (x / rect.width) * 100;
                
                // Boundaries
                if (percentage < 0) percentage = 0;
                if (percentage > 100) percentage = 100;

                beforeContainer.style.width = `${percentage}%`;
                handle.style.left = `${percentage}%`;
            };

            // Mouse Events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                slider.style.cursor = 'ew-resize';
                e.preventDefault();
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
                slider.style.cursor = 'default';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                moveSlider(e.clientX);
            });

            // Touch Events (Mobile)
            handle.addEventListener('touchstart', () => {
                isDragging = true;
            }, { passive: true });

            window.addEventListener('touchend', () => {
                isDragging = false;
            });

            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                moveSlider(e.touches[0].clientX);
            });
            
            // Support click-to-slide
            slider.addEventListener('click', (e) => {
                if (e.target.closest('.slider-handle')) return; // ignore handle clicks
                moveSlider(e.clientX);
            });
        });
    };
    initSliders();

    /* ==========================================================================
       6. Postcard Testimonials Carousel
       ========================================================================== */
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.review-postcard');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;

        const updateCarousel = (index) => {
            currentIndex = index;
            // Bound index
            if (currentIndex < 0) currentIndex = slides.length - 1;
            if (currentIndex >= slides.length) currentIndex = 0;

            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach(d => d.classList.remove('active'));
            if (dots && dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        };

        // Arrow Triggers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
        }

        // Dot triggers
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => updateCarousel(idx));
        });

        // Touch swipe support
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            const difference = startX - endX;
            if (Math.abs(difference) > 50) { // minimum swipe threshold
                if (difference > 0) {
                    updateCarousel(currentIndex + 1); // Swiped left
                } else {
                    updateCarousel(currentIndex - 1); // Swiped right
                }
            }
        });
    }

    /* ==========================================================================
       7. Scroll-Activated Trail-Map Path Animation
       ========================================================================== */
    const processSection = document.querySelector('.process-section');
    const activeTrailPath = document.getElementById('active-trail-path');
    const trailSteps = document.querySelectorAll('.trail-step');

    if (activeTrailPath && processSection) {
        const pathLength = activeTrailPath.getTotalLength();
        activeTrailPath.style.strokeDasharray = pathLength;
        activeTrailPath.style.strokeDashoffset = pathLength;

        const handleTrailScroll = () => {
            const rect = processSection.getBoundingClientRect();
            const sectionHeight = processSection.offsetHeight;
            
            // Percentage of section scrolled through screen center
            const triggerPoint = window.innerHeight * 0.5;
            let percentScrolled = (triggerPoint - rect.top) / sectionHeight;
            
            if (percentScrolled < 0) percentScrolled = 0;
            if (percentScrolled > 1) percentScrolled = 1;

            // Animate SVG path dashoffset
            const offset = pathLength - (percentScrolled * pathLength);
            activeTrailPath.style.strokeDashoffset = offset;

            // Activate step circles based on percentage progress
            trailSteps.forEach((step, index) => {
                // Approximate ratios for steps along path triggers
                const ratios = [0.15, 0.45, 0.70, 0.90];
                if (percentScrolled >= ratios[index]) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleTrailScroll);
        // Fire initially
        handleTrailScroll();
    }

    /* ==========================================================================
       8. Custom Video Player Controls
       ========================================================================== */
    const video = document.getElementById('cinematic-video');
    const playBtn = document.getElementById('video-play-button');
    const videoOverlay = document.querySelector('.video-mock-overlay');

    if (video && playBtn && videoOverlay) {
        const togglePlay = () => {
            if (video.paused) {
                video.play();
                videoOverlay.classList.add('hidden');
                video.setAttribute('controls', 'true'); // Show native controls once playing
            } else {
                video.pause();
                videoOverlay.classList.remove('hidden');
                video.removeAttribute('controls');
            }
        };

        playBtn.addEventListener('click', togglePlay);
        
        // If user pauses via native player controls, restore custom overlay
        video.addEventListener('pause', () => {
            videoOverlay.classList.remove('hidden');
            video.removeAttribute('controls');
        });
    }

    /* ==========================================================================
       9. Service Area Map Pins & Highlights
       ========================================================================== */
    const mapPins = document.querySelectorAll('.map-pin');
    const citySelectors = document.querySelectorAll('.city-selector-btn');
    const popup = document.getElementById('map-info-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDesc = document.getElementById('popup-desc');
    const popupDispatch = document.getElementById('popup-dispatch');

    const cityDetails = {
        harrisburg: {
            title: 'Harrisburg Hub',
            desc: 'Central dispatch center. Crews operate daily, delivering rapid response siding restoration, gutter clearing, and driveway washing.',
            dispatch: 'Within 48 Hours'
        },
        mechanicsburg: {
            title: 'Mechanicsburg Route',
            desc: 'Regular service routes. Ideal for historic estate washing, weathered siding cleaning, and patio pressure wash treatments.',
            dispatch: '3 - 4 Days'
        },
        camphill: {
            title: 'Camp Hill Route',
            desc: 'Dedicated soft-washing service runs. Specializing in metal roofs, delicate composite decks, and brick masonry restorations.',
            dispatch: '2 - 3 Days'
        },
        carlisle: {
            title: 'Carlisle Outpost',
            desc: 'Serving commercial properties, country estates, and agricultural buildings with hot-water surface cleaning solutions.',
            dispatch: 'Within 5 Days'
        },
        hershey: {
            title: 'Hershey Route',
            desc: 'Regular routes near Hershey area. Residential cleaning specials, siding soft washes, and driveway sealing options.',
            dispatch: '2 - 4 Days'
        },
        newcumberland: {
            title: 'New Cumberland Route',
            desc: 'Susquehanna riverway crews dispatching daily. Quick scheduling availability for deck cleaning and gutter brightening.',
            dispatch: '24 - 48 Hours'
        },
        enola: {
            title: 'Enola Service Run',
            desc: 'Cumberland valley dispatch routes. Complete package details including roofs, house siding, and sidewalk wash services.',
            dispatch: '3 - 5 Days'
        },
        lemoyne: {
            title: 'Lemoyne Service Area',
            desc: 'Daily local coverage. Low pressure soft washing and commercial-grade storefront cleaning programs.',
            dispatch: 'Within 48 Hours'
        }
    };

    const updateMapPopup = (cityKey) => {
        const details = cityDetails[cityKey];
        if (!details) return;

        // Update popup text
        popupTitle.textContent = details.title;
        popupDesc.textContent = details.desc;
        popupDispatch.textContent = details.dispatch;

        // Show popup
        popup.classList.add('active');

        // Toggle Active pins
        mapPins.forEach(pin => {
            if (pin.getAttribute('data-city') === cityKey) {
                pin.classList.add('active');
            } else {
                pin.classList.remove('active');
            }
        });

        // Toggle Active directory buttons
        citySelectors.forEach(btn => {
            if (btn.getAttribute('data-city') === cityKey) {
                btn.classList.add('active');
                // Scroll button into view inside scrollable sidebar if needed
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                btn.classList.remove('active');
            }
        });
    };

    // Bind City Buttons
    citySelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            const cityKey = btn.getAttribute('data-city');
            updateMapPopup(cityKey);
        });
    });

    // Bind Map Pin SVG elements
    mapPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const cityKey = pin.getAttribute('data-city');
            updateMapPopup(cityKey);
        });
    });

    // Show default harrisburg popup initially
    setTimeout(() => {
        updateMapPopup('harrisburg');
    }, 1500);

    /* ==========================================================================
       10. FAQ Accordions (Wood Panel Height Animation)
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    /* ==========================================================================
       11. Form Validation & Image Uploader
       ========================================================================== */
    const quoteForm = document.getElementById('quote-request-form');
    const photoInput = document.getElementById('form-photos');
    const dropzone = document.getElementById('photo-dropzone');
    const previewGrid = document.getElementById('dropzone-preview');
    const successBox = document.getElementById('form-success-message');
    const submitBtn = document.getElementById('submit-quote-btn');
    
    let uploadedFilesList = [];

    // Drag-Drop highlight binders
    if (dropzone && photoInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handlePhotosUpload(files);
        });

        photoInput.addEventListener('change', (e) => {
            handlePhotosUpload(e.target.files);
        });
    }

    const handlePhotosUpload = (files) => {
        const arr = Array.from(files);
        
        arr.forEach(file => {
            if (!file.type.startsWith('image/')) return; // Images only
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }

            uploadedFilesList.push(file);

            // Render Preview Thumbnails
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const thumb = document.createElement('div');
                thumb.classList.add('preview-thumb');
                
                const img = document.createElement('img');
                img.src = reader.result;
                img.alt = 'Uploaded property visual';
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('preview-thumb-remove');
                removeBtn.innerHTML = '&times;';
                removeBtn.type = 'button';
                
                removeBtn.addEventListener('click', () => {
                    const idx = uploadedFilesList.indexOf(file);
                    if (idx > -1) {
                        uploadedFilesList.splice(idx, 1);
                    }
                    thumb.remove();
                });

                thumb.appendChild(img);
                thumb.appendChild(removeBtn);
                previewGrid.appendChild(thumb);
            };
        });
    };

    // Form Submission Handler (Mock Process)
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button, simulate loading
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Processing Estimate Request...</span>';

            // Simulate server network latency
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Hide inputs, show success Sage Green feedback
                quoteForm.reset();
                previewGrid.innerHTML = '';
                uploadedFilesList = [];
                
                // Keep success visible, auto scroll to it
                successBox.classList.remove('hidden');
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove success after 10 seconds or keep visible
                setTimeout(() => {
                    successBox.classList.add('hidden');
                }, 12000);

            }, 2000);
        });
    }
});
