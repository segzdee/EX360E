// EXTRASTAFF360 Form Processing System
// Version: 2.0.0
// Environment: Production

// Form Configuration Interface
const FORM_CONFIG = {
  CLIENT_REGISTRATION: {
    formName: 'client-registration',
    endpoint: '/.netlify/functions/registration',
    validationRules: {
      companyName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[A-Za-z0-9\s\-\.]+$/
      },
      email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      phone: {
        required: true,
        pattern: /^[0-9\-\+\s]+$/
      }
    }
  }
};

// Form Generator Class
class NetlifyFormGenerator {
  constructor(config) {
    this.config = config;
    this.forms = new Map();
  }

  // Generate Form HTML
  generateFormHTML(formType) {
    const config = this.config[formType];
    return `
      <form 
        name="${config.formName}"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit="handleSubmit(event)"
        class="extrastaff360-form ${config.formName}">
        
        <input type="hidden" name="form-name" value="${config.formName}" />
        <div hidden>
          <input name="bot-field" />
        </div>

        ${this.generateFormFields(config)}

        <div class="form-actions">
          <button type="submit" class="submit-button">Submit</button>
          <button type="reset" class="reset-button">Reset</button>
        </div>
      </form>
    `;
  }

  // Form Field Generator
  generateFormFields(config) {
    // Implementation based on form type
    return '';
  }
}

// Form Validation Handler
class FormValidator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(formData) {
    const errors = new Map();
    
    for (const [field, rules] of Object.entries(this.rules)) {
      const value = formData.get(field);
      
      if (rules.required && !value) {
        errors.set(field, 'This field is required');
        continue;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.set(field, 'Invalid format');
      }

      if (rules.minLength && value.length < rules.minLength) {
        errors.set(field, `Minimum length is ${rules.minLength}`);
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.set(field, `Maximum length is ${rules.maxLength}`);
      }
    }

    return {
      isValid: errors.size === 0,
      errors
    };
  }
}

// Form Submission Handler
class FormSubmissionHandler {
  constructor(config) {
    this.config = config;
    this.validator = new FormValidator(config.validationRules);
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);

    // Validation
    const validation = this.validator.validate(formData);
    if (!validation.isValid) {
      this.displayErrors(validation.errors);
      return;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      this.handleSuccess(form);
    } catch (error) {
      this.handleError(error);
    }
  }

  displayErrors(errors) {
    errors.forEach((message, field) => {
      const element = document.querySelector(`[name="${field}"]`);
      if (element) {
        element.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
      }
    });
  }

  handleSuccess(form) {
    form.reset();
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Form submitted successfully';
    form.appendChild(successMessage);
  }

  handleError(error) {
    console.error('Form submission error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'An error occurred during submission';
    form.appendChild(errorMessage);
  }
}

// CSS Styles Generator
class StylesGenerator {
  generateStyles() {
    return `
      .extrastaff360-form {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }

      .submit-button,
      .reset-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .error-message {
        color: #c62828;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }

      .success-message {
        color: #2e7d32;
        margin-top: 1rem;
        padding: 1rem;
        background-color: #e8f5e9;
        border-radius: 4px;
      }
    `;
  }
}

// Initialize Form System
document.addEventListener('DOMContentLoaded', () => {
  const formGenerator = new NetlifyFormGenerator(FORM_CONFIG);
  const stylesGenerator = new StylesGenerator();

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = stylesGenerator.generateStyles();
  document.head.appendChild(styleSheet);

  // Initialize form handlers
  const forms = document.querySelectorAll('[data-netlify="true"]');
  forms.forEach(form => {
    const formType = form.name;
    const handler = new FormSubmissionHandler(FORM_CONFIG[formType]);
    form.addEventListener('submit', (e) => handler.handleSubmit(e));
  });
});

// Export for module usage
export {
  NetlifyFormGenerator,
  FormValidator,
  FormSubmissionHandler,
  StylesGenerator,
  FORM_CONFIG
};