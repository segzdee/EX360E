// EXTRASTAFF360 Enterprise Form System
// Version: 2.0.0
// Implementation: Production

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form Schemas and Validation Rules
const FORM_SCHEMAS = {
  CLIENT_REGISTRATION: yup.object({
    companyName: yup.string().required().min(2).max(100),
    businessType: yup.string().required(),
    contactPerson: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().matches(/^[0-9\-\+\s]+$/).required(),
    address: yup.object({
      street: yup.string().required(),
      city: yup.string().required(),
      postcode: yup.string().required()
    })
  }),

  STAFF_REGISTRATION: yup.object({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    skills: yup.array().min(1).required(),
    availability: yup.object({
      weekdays: yup.array(),
      weekends: yup.boolean(),
      shiftPreferences: yup.array()
    }),
    certifications: yup.array(),
    experience: yup.object({
      years: yup.number(),
      positions: yup.array()
    })
  }),

  AGENCY_REGISTRATION: yup.object({
    agencyName: yup.string().required(),
    licenseNumber: yup.string().required(),
    contactPerson: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    serviceAreas: yup.array().min(1).required(),
    staffingCapacity: yup.number().required(),
    specializations: yup.array()
  }),

  SHIFT_POSTING: yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    date: yup.date().required(),
    startTime: yup.string().required(),
    endTime: yup.string().required(),
    location: yup.object({
      address: yup.string().required(),
      coordinates: yup.array().of(yup.number())
    }),
    requirements: yup.object({
      skills: yup.array().required(),
      experience: yup.string(),
      certifications: yup.array()
    }),
    compensation: yup.object({
      hourlyRate: yup.number().required(),
      bonuses: yup.array()
    })
  })
};

// Form Component Generator
const FormGenerator = ({ formType, onSubmit, initialData = {} }) => {
  const schema = FORM_SCHEMAS[formType];
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
  });

  const processSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch('/.netlify/functions/form-handler', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Submission failed');

      onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(processSubmit)}
      className="extrastaff360-form"
      data-netlify="true"
      data-form-type={formType}
    >
      {/* Dynamic Form Fields Generation */}
      {Object.keys(schema.fields).map(fieldName => (
        <FormField
          key={fieldName}
          name={fieldName}
          register={register}
          error={errors[fieldName]}
          schema={schema.fields[fieldName]}
        />
      ))}
      
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button type="reset" className="reset-button">
          Reset
        </button>
      </div>
    </form>
  );
};

// Individual Form Field Component
const FormField = ({ name, register, error, schema }) => {
  const getFieldType = (schema) => {
    switch (schema.type) {
      case 'string':
        return 'text';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'array':
        return 'select';
      default:
        return 'text';
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={name}>{name.replace(/([A-Z])/g, ' $1').trim()}</label>
      <input
        type={getFieldType(schema)}
        id={name}
        {...register(name)}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

// Export Form Components
export const Forms = {
  ClientRegistration: (props) => (
    <FormGenerator formType="CLIENT_REGISTRATION" {...props} />
  ),
  StaffRegistration: (props) => (
    <FormGenerator formType="STAFF_REGISTRATION" {...props} />
  ),
  AgencyRegistration: (props) => (
    <FormGenerator formType="AGENCY_REGISTRATION" {...props} />
  ),
  ShiftPosting: (props) => (
    <FormGenerator formType="SHIFT_POSTING" {...props} />
  )
};

export default Forms;