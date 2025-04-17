/**
 * QuantumCSS Framework v1.0.0
 * Started this in October 2022 and still improving!
 * 
 * TODO: 
 * - Fix Safari flickering issue in dropdowns
 * - Add toast notifications (maybe next month)
 * - Refactor modal code - it's getting messy
 */

(function() {
  'use strict';
  
  // Global namespace for all our components
  window.Quantum = {};
  
  // Utility functions I use everywhere
  const util = {
    // Get parent element matching selector (for old browsers)
    closest: function(element, selector) {
      if (element.closest) {
        return element.closest(selector);
      }
      
      // For IE - does anyone still use it? Keeping just in case
      let parent = element;
      while (parent) {
        if (parent.matches && parent.matches(selector)) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    },
    
    // Fire custom events
    triggerEvent: function(element, eventName) {
      let event;
      if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent(eventName, { bubbles: true });
      } else {
        // Old browser fallback
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, false, {});
      }
      element.dispatchEvent(event);
    },
    
    // Get all siblings - handy for nav items
    getSiblings: function(element) {
      return Array.from(element.parentNode.children).filter(child => child !== element);
    },
    
    // Add/remove class with condition - I use this ALL the time
    toggleClass: function(element, className, condition) {
      if (condition) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
    
    // Get scrollbar width - needed for modal compensation
    // Found this trick on StackOverflow and modified it a bit
    getScrollbarWidth: function() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      
      return scrollbarWidth;
    }
  };
  
  /**
   * Alert Component
   * Simple dismissible alerts
   */
  Quantum.Alert = {
    init: function() {
      // Click handler for dismiss button
      document.addEventListener('click', function(event) {
        const dismissBtn = event.target.closest('[data-dismiss="alert"]');
        if (dismissBtn) {
          const alert = dismissBtn.closest('.alert');
          if (alert) {
            Quantum.Alert.close(alert);
          }
        }
      });
    },
    
    // Animate and remove alert
    close: function(element) {
      util.triggerEvent(element, 'close.q.alert');
      
      element.classList.add('fade-out');
      
      // FIXME: sometimes there's a flash before removal on Firefox
      setTimeout(function() {
        element.remove();
        util.triggerEvent(element, 'closed.q.alert');
      }, 300);
    }
  };
  
  /**
   * Tab Component
   * Click handlers for tab navigation
   */
  Quantum.Tab = {
    init: function() {
      document.addEventListener('click', function(event) {
        const tabLink = event.target.closest('[data-toggle="tab"]');
        if (tabLink) {
          event.preventDefault();
          Quantum.Tab.show(tabLink);
        }
      });
    },
    
    show: function(tabLink) {
      // Skip if already active
      if (tabLink.classList.contains('active')) return;
      
      // Get target tab pane
      const target = document.querySelector(tabLink.getAttribute('href') || tabLink.dataset.target);
      if (!target) return;
      
      // Get parent tabs container
      const tabContainer = util.closest(tabLink, '.nav');
      if (!tabContainer) return;
      
      // Deactivate current active tab and pane
      const activeTab = tabContainer.querySelector('.nav-link.active');
      const activePane = target.parentNode.querySelector('.tab-pane.active');
      
      if (activeTab) {
        activeTab.classList.remove('active');
        util.triggerEvent(activeTab, 'hide.q.tab');
      }
      
      if (activePane) {
        activePane.classList.remove('active');
      }
      
      // Activate new tab and pane
      tabLink.classList.add('active');
      target.classList.add('active');
      
      util.triggerEvent(tabLink, 'shown.q.tab');
    }
  };
  
  /**
   * Dropdown Component
   * Handles dropdown menus (still needs keyboard nav)
   */
  Quantum.Dropdown = {
    init: function() {
      // Toggle dropdown
      document.addEventListener('click', function(event) {
        const toggleBtn = event.target.closest('[data-toggle="dropdown"]');
        if (toggleBtn) {
          event.preventDefault();
          Quantum.Dropdown.toggle(toggleBtn);
        }
      });
      
      // Close all dropdowns when clicking outside
      document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
          Quantum.Dropdown.closeAll();
        }
      });
      
      // Close all dropdowns on ESC key
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          Quantum.Dropdown.closeAll();
        }
      });
    },
    
    toggle: function(toggleBtn) {
      const dropdown = util.closest(toggleBtn, '.dropdown');
      if (!dropdown) return;
      
      const menu = dropdown.querySelector('.dropdown-menu');
      if (!menu) return;
      
      const isOpen = menu.classList.contains('show');
      
      // Close all other dropdowns first
      Quantum.Dropdown.closeAll();
      
      // If was closed, open it
      if (!isOpen) {
        util.triggerEvent(dropdown, 'show.q.dropdown');
        menu.classList.add('show');
        util.triggerEvent(dropdown, 'shown.q.dropdown');
      }
    },
    
    closeAll: function() {
      const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
      
      openDropdowns.forEach(function(menu) {
        const dropdown = menu.closest('.dropdown');
        if (dropdown) {
          util.triggerEvent(dropdown, 'hide.q.dropdown');
          menu.classList.remove('show');
          util.triggerEvent(dropdown, 'hidden.q.dropdown');
        }
      });
    }
  };
  
  /**
   * Modal Component
   * Handles modal dialogs
   */
  Quantum.Modal = {
    init: function() {
      // Open modal
      document.addEventListener('click', function(event) {
        const openBtn = event.target.closest('[data-toggle="modal"]');
        if (openBtn) {
          event.preventDefault();
          const targetId = openBtn.getAttribute('data-target') || openBtn.getAttribute('href');
          const modal = document.querySelector(targetId);
          if (modal) {
            Quantum.Modal.open(modal);
          }
        }
      });
      
      // Close modal with buttons
      document.addEventListener('click', function(event) {
        const closeBtn = event.target.closest('[data-dismiss="modal"]');
        if (closeBtn) {
          event.preventDefault();
          const modal = util.closest(closeBtn, '.modal');
          if (modal) {
            Quantum.Modal.close(modal);
          }
        }
      });
      
      // Close modal by clicking on backdrop
      document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
          Quantum.Modal.close(event.target);
        }
      });
      
      // Close modal with ESC key
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          const openModal = document.querySelector('.modal.show');
          if (openModal) {
            Quantum.Modal.close(openModal);
          }
        }
      });
    },
    
    open: function(modal) {
      if (!modal) return;
      
      // Check if we have other open modals
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        Quantum.Modal.close(openModal);
      }
      
      // Calculate scrollbar width before locking the body
      const scrollbarWidth = util.getScrollbarWidth();
      
      // Fire event
      util.triggerEvent(modal, 'show.q.modal');
      
      // Show the modal
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      
      // Lock body scroll and adjust for scrollbar
      document.body.classList.add('modal-open');
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = scrollbarWidth + 'px';
      }
      
      // Focus the modal for better accessibility
      setTimeout(function() {
        const focusableElement = modal.querySelector('[autofocus]') || 
                                 modal.querySelector('button:not([data-dismiss="modal"])') || 
                                 modal.querySelector('input') || 
                                 modal.querySelector('a');
        if (focusableElement) {
          focusableElement.focus();
        }
        
        util.triggerEvent(modal, 'shown.q.modal');
      }, 300);
    },
    
    close: function(modal) {
      if (!modal) return;
      
      util.triggerEvent(modal, 'hide.q.modal');
      
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      
      // Remove body locks after animation
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        
        util.triggerEvent(modal, 'hidden.q.modal');
      }, 300);
    }
  };
  
  /**
   * Collapse Component
   * Handles collapsible elements like accordions
   */
  Quantum.Collapse = {
    init: function() {
      document.addEventListener('click', function(event) {
        const collapseToggle = event.target.closest('[data-toggle="collapse"]');
        if (collapseToggle) {
          event.preventDefault();
          
          const target = document.querySelector(collapseToggle.getAttribute('data-target') || 
                                               collapseToggle.getAttribute('href'));
          if (target) {
            Quantum.Collapse.toggle(target, collapseToggle);
          }
        }
      });
    },
    
    toggle: function(element, toggler) {
      if (!element) return;
      
      const isExpanded = element.classList.contains('show');
      
      // Check if this is part of an accordion (only one open at a time)
      if (toggler && toggler.hasAttribute('data-parent')) {
        const parent = document.querySelector(toggler.getAttribute('data-parent'));
        if (parent) {
          // Close all other collapses
          const openCollapses = parent.querySelectorAll('.collapse.show');
          openCollapses.forEach(function(collapse) {
            if (collapse !== element) {
              Quantum.Collapse.hide(collapse);
            }
          });
        }
      }
      
      if (isExpanded) {
        Quantum.Collapse.hide(element);
      } else {
        Quantum.Collapse.show(element);
      }
    },
    
    show: function(element) {
      if (element.classList.contains('show')) return;
      
      util.triggerEvent(element, 'show.q.collapse');
      
      // Get natural height of the element
      const startHeight = element.scrollHeight;
      
      // Temporarily disable transitions
      const duration = getComputedStyle(element).transitionDuration;
      element.style.transitionDuration = '0s';
      
      // Set initial height to 0
      element.style.height = '0';
      element.style.display = 'block';
      
      // Force browser reflow
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      
      // Re-enable transitions and animate to full height
      element.style.transitionDuration = duration;
      element.style.height = startHeight + 'px';
      
      element.classList.add('collapsing');
      
      // After transition completes
      const complete = function() {
        element.classList.remove('collapsing');
        element.classList.add('collapse', 'show');
        element.style.height = '';
        element.removeEventListener('transitionend', complete);
        
        util.triggerEvent(element, 'shown.q.collapse');
      };
      
      element.addEventListener('transitionend', complete);
    },
    
    hide: function(element) {
      if (!element.classList.contains('show')) return;
      
      util.triggerEvent(element, 'hide.q.collapse');
      
      // Set explicit height for transition
      element.style.height = element.scrollHeight + 'px';
      
      // Force browser reflow
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      
      element.classList.add('collapsing');
      element.classList.remove('collapse', 'show');
      
      // Transition to zero height
      element.style.height = '0';
      
      // After transition completes
      const complete = function() {
        element.classList.remove('collapsing');
        element.classList.add('collapse');
        element.style.display = 'none';
        element.style.height = '';
        element.removeEventListener('transitionend', complete);
        
        util.triggerEvent(element, 'hidden.q.collapse');
      };
      
      element.addEventListener('transitionend', complete);
    }
  };
  
  /**
   * Tooltip Component
   * Handles tooltips
   */
  Quantum.Tooltip = {
    init: function() {
      // Find all elements with data-toggle="tooltip"
      const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
      
      tooltipElements.forEach(function(element) {
        // Hover events for desktop
        element.addEventListener('mouseenter', function() {
          Quantum.Tooltip.show(element);
        });
        
        element.addEventListener('mouseleave', function() {
          Quantum.Tooltip.hide(element);
        });
        
        // Focus/blur events for accessibility
        element.addEventListener('focus', function() {
          Quantum.Tooltip.show(element);
        });
        
        element.addEventListener('blur', function() {
          Quantum.Tooltip.hide(element);
        });
      });
    },
    
    show: function(element) {
      if (element._tooltip) return;
      
      const title = element.getAttribute('title') || element.getAttribute('data-tooltip');
      if (!title) return;
      
      // Store original title and remove it to prevent default browser tooltip
      element._originalTitle = title;
      element.setAttribute('title', '');
      
      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'q-tooltip';
      tooltip.textContent = title;
      document.body.appendChild(tooltip);
      
      // Store reference to tooltip
      element._tooltip = tooltip;
      
      // Position the tooltip
      this.position(element, tooltip, element.getAttribute('data-placement') || 'top');
      
      // Add show class (for animation)
      setTimeout(function() {
        tooltip.classList.add('show');
      }, 10);
    },
    
    hide: function(element) {
      const tooltip = element._tooltip;
      if (!tooltip) return;
      
      // Trigger hide animation
      tooltip.classList.remove('show');
      
      // Restore original title
      if (element._originalTitle) {
        element.setAttribute('title', element._originalTitle);
        delete element._originalTitle;
      }
      
      // Remove tooltip after animation
      setTimeout(function() {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        delete element._tooltip;
      }, 300);
    },
    
    position: function(element, tooltip, placement) {
      const elementRect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top, left;
      
      switch (placement) {
        case 'top':
          top = elementRect.top + scrollTop - tooltipRect.height - 10;
          left = elementRect.left + scrollLeft + (elementRect.width / 2) - (tooltipRect.width / 2);
          tooltip.classList.add('position-top');
          break;
          
        case 'bottom':
          top = elementRect.bottom + scrollTop + 10;
          left = elementRect.left + scrollLeft + (elementRect.width / 2) - (tooltipRect.width / 2);
          tooltip.classList.add('position-bottom');
          break;
          
        case 'left':
          top = elementRect.top + scrollTop + (elementRect.height / 2) - (tooltipRect.height / 2);
          left = elementRect.left + scrollLeft - tooltipRect.width - 10;
          tooltip.classList.add('position-left');
          break;
          
        case 'right':
          top = elementRect.top + scrollTop + (elementRect.height / 2) - (tooltipRect.height / 2);
          left = elementRect.right + scrollLeft + 10;
          tooltip.classList.add('position-right');
          break;
      }
      
      // Apply position
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
    }
  };
  
  /**
   * Form Validation
   * Handles form validation
   */
  Quantum.FormValidator = {
    init: function() {
      // Find all forms with data-validate attribute
      const forms = document.querySelectorAll('form[data-validate]');
      
      forms.forEach(function(form) {
        // Prevent standard HTML5 validation
        form.setAttribute('novalidate', 'true');
        
        // Add submit handler
        form.addEventListener('submit', function(event) {
          if (!Quantum.FormValidator.validateForm(form)) {
            event.preventDefault();
            event.stopPropagation();
          }
          
          form.classList.add('was-validated');
        });
        
        // Live validation as user types
        if (form.getAttribute('data-validate-live') === 'true') {
          const inputs = form.querySelectorAll('input, select, textarea');
          
          inputs.forEach(function(input) {
            ['input', 'blur'].forEach(function(eventType) {
              input.addEventListener(eventType, function() {
                Quantum.FormValidator.validateInput(input);
              });
            });
          });
        }
      });
    },
    
    validateForm: function(form) {
      let isValid = true;
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(function(input) {
        if (!Quantum.FormValidator.validateInput(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    },
    
    validateInput: function(input) {
      // Skip inputs that are disabled, readonly, or hidden
      if (input.disabled || input.readOnly || input.type === 'hidden') {
        return true;
      }
      
      const validity = input.validity;
      
      // Clear previous validation state
      input.classList.remove('is-valid', 'is-invalid');
      
      // Check validity
      if (validity.valid) {
        input.classList.add('is-valid');
        return true;
      } else {
        input.classList.add('is-invalid');
        
        // Set custom validation message if available
        if (input.dataset.errorMessage) {
          let feedbackElement = input.nextElementSibling;
          
          // Create feedback element if it doesn't exist
          if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'invalid-feedback';
            input.parentNode.insertBefore(feedbackElement, input.nextSibling);
          }
          
          feedbackElement.textContent = input.dataset.errorMessage;
        }
        
        return false;
      }
    }
  };
  
  /**
   * Image Handler Component
   * Handles image loading states, errors, and lazy loading
   */
  Quantum.ImageHandler = {
    init: function() {
      // Handle image loading states
      const images = document.querySelectorAll('img[data-quantum-image]');
      
      images.forEach(img => {
        // Add loading class to container if it exists
        const container = img.closest('.img-container') || img.parentNode;
        if (container) container.classList.add('loading');
        
        // Handle successful load
        img.addEventListener('load', function() {
          if (container) container.classList.remove('loading');
          img.classList.add('loaded');
          util.triggerEvent(img, 'loaded.q.image');
        });
        
        // Handle load errors
        img.addEventListener('error', function() {
          if (container) container.classList.remove('loading');
          img.classList.add('error');
          
          // Try to use data-fallback if specified
          const fallback = img.getAttribute('data-fallback');
          if (fallback && img.src !== fallback) {
            img.src = fallback;
          } else {
            // Apply error styling or placeholder
            img.setAttribute('alt', img.getAttribute('alt') || 'Image failed to load');
          }
          
          util.triggerEvent(img, 'error.q.image');
        });
      });
      
      // Implement lazy loading for images
      this.initLazyLoading();
    },
    
    initLazyLoading: function() {
      // Only run if IntersectionObserver is supported
      if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Set the source from data attributes
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              
              // Remove lazy loading class
              img.classList.remove('lazy');
              
              // Trigger event
              util.triggerEvent(img, 'lazyloaded.q.image');
              
              // Stop observing this image
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px', // Start loading when image is 50px from viewport
          threshold: 0.01 // Trigger when at least 1% of the image is visible
        });
        
        // Start observing each lazy image
        lazyImages.forEach(img => {
          imageObserver.observe(img);
        });
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        // Load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.classList.remove('lazy');
        });
      }
    },
    
    // Manually trigger lazy loading check (useful after dynamic content loading)
    refreshLazyImages: function() {
      if (window.imageObserver) {
        const newLazyImages = document.querySelectorAll('img[data-src]:not(.loaded)');
        newLazyImages.forEach(img => window.imageObserver.observe(img));
      } else {
        this.initLazyLoading();
      }
    }
  };
  
  /**
   * Dark Mode Toggle
   * Handles switching between light and dark mode
   */
  Quantum.DarkMode = {
    init: function() {
      const toggles = document.querySelectorAll('[data-toggle="dark-mode"]');
      
      // Check saved preference or system preference
      const savedTheme = localStorage.getItem('quantum-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Apply theme based on preference
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        Quantum.DarkMode.enable();
      }
      
      // Add event listener to toggle buttons
      toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
          if (document.body.classList.contains('dark-mode')) {
            Quantum.DarkMode.disable();
          } else {
            Quantum.DarkMode.enable();
          }
        });
      });
      
      // Update toggle state
      Quantum.DarkMode.updateToggles();
    },
    
    enable: function() {
      document.body.classList.add('dark-mode');
      localStorage.setItem('quantum-theme', 'dark');
      util.triggerEvent(document, 'darkmode.q.enabled');
      this.updateToggles();
    },
    
    disable: function() {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('quantum-theme', 'light');
      util.triggerEvent(document, 'darkmode.q.disabled');
      this.updateToggles();
    },
    
    updateToggles: function() {
      const toggles = document.querySelectorAll('[data-toggle="dark-mode"]');
      const isDark = document.body.classList.contains('dark-mode');
      
      toggles.forEach(function(toggle) {
        if (toggle.tagName === 'INPUT' && toggle.type === 'checkbox') {
          toggle.checked = isDark;
        }
        
        // Update any icons
        const lightIcon = toggle.querySelector('.light-mode-icon');
        const darkIcon = toggle.querySelector('.dark-mode-icon');
        
        if (lightIcon) lightIcon.style.display = isDark ? 'none' : 'inline-block';
        if (darkIcon) darkIcon.style.display = isDark ? 'inline-block' : 'none';
      });
    }
  };
  
  /**
   * Typewriter Effect 
   * 
   * I built this for my personal site and thought others might like it
   * It's not polished yet but it works for my needs
   * 
   * Usage:
   * <div class="typewriter" data-text="First text,Second text,Third text" data-speed="70"></div>
   */
  Quantum.TypeWriter = {
    // keep track of all instances
    instances: [],
    
    init: function() {
      // Find all typewriter elements
      const elements = document.querySelectorAll('.typewriter');
      
      // Set up each instance
      elements.forEach(element => {
        // Get options
        let textArray = element.dataset.text.split(',');
        let speed = parseInt(element.dataset.speed) || 100; // default to 100ms
        let loop = element.hasAttribute('data-loop'); // should it loop?
        
        // Create a placeholder for the text
        let textSpan = document.createElement('span');
        element.appendChild(textSpan);
        
        // Create cursor element
        let cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.innerHTML = '|';
        cursor.style.animation = 'cursor-blink 1s infinite';
        element.appendChild(cursor);
        
        // Add some basic styling if not already styled
        if (!element.style.position) 
          element.style.position = 'relative';
        
        // Create the typewriter instance
        let instance = {
          element: element,
          textSpan: textSpan,
          textArray: textArray,
          speed: speed,
          loop: loop,
          currentText: '',
          currentIndex: 0,
          isDeleting: false,
          complete: false
        };
        
        // Keep track of this instance
        this.instances.push(instance);
        
        // Start typing for this instance
        this.type(instance);
      });
      
      // Add style for cursor if not present
      if (!document.getElementById('typewriter-style')) {
        const style = document.createElement('style');
        style.id = 'typewriter-style';
        style.innerHTML = `
          @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .typewriter-cursor {
            font-weight: bold;
            margin-left: 2px;
          }
        `;
        document.head.appendChild(style);
      }
    },
    
    // The typing function
    type: function(instance) {
      // Current text being typed
      let fullText = instance.textArray[instance.currentIndex];
      let txt = instance.currentText;
      
      // Set typing speed - faster for deleting
      let typeSpeed = instance.speed;
      if(instance.isDeleting) {
        typeSpeed = instance.speed / 2;
      }
      
      // Check if done typing the full text
      if(!instance.isDeleting && txt === fullText) {
        // Pause at end of typing
        typeSpeed = 1500;
        // Set deleting flag
        instance.isDeleting = true;
      } else if(instance.isDeleting && txt === '') {
        // Reset deleting flag
        instance.isDeleting = false;
        // Move to next text in array
        instance.currentIndex++;
        
        // Check if we've reached the end of the array
        if(instance.currentIndex === instance.textArray.length) {
          if (instance.loop) {
            instance.currentIndex = 0; // Reset to beginning
          } else {
            instance.complete = true;
          }
        }
        
        // Pause before typing next word
        typeSpeed = 500;
      }
      
      // Add or remove characters
      if(!instance.complete) {
        if(instance.isDeleting) {
          // Remove character
          instance.currentText = fullText.substring(0, txt.length - 1);
        } else {
          // Add character
          instance.currentText = fullText.substring(0, txt.length + 1);
        }
        
        // Update the element text
        instance.textSpan.textContent = instance.currentText;
        
        // Schedule next update with dynamic speed
        setTimeout(() => {
          this.type(instance);
        }, typeSpeed);
      }
    }
  };
  
  // Initialize all components
  document.addEventListener('DOMContentLoaded', function() {
    // Core components
    Quantum.Alert.init();
    Quantum.Tab.init();
    Quantum.Dropdown.init();
    Quantum.Modal.init();
    Quantum.Collapse.init();
    Quantum.Tooltip.init();
    Quantum.FormValidator.init();
    Quantum.ImageHandler.init();
    Quantum.DarkMode.init();
    
    // My custom components
    Quantum.TypeWriter.init();
    
    // Fire event when framework is ready
    document.dispatchEvent(new Event('quantum.ready'));
  });
  
})();
