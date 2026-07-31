const trim = (value) => String(value ?? "").trim();

export const validators = {
  name: (value, label = "Name") => {
    const v = trim(value);
    if (!v) return `${label} is required`;
    if (v.length < 2) return `${label} must be at least 2 characters`;
    if (!/^[a-zA-Z\s.'-]+$/.test(v)) return `${label} can only contain letters`;
    return "";
  },

  email: (value) => {
    const v = trim(value);
    if (!v) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email";
    return "";
  },

  phone: (value) => {
    const v = trim(value);
    if (!v) return "Phone number is required";
    if (!/^\d{10}$/.test(v)) return "Phone number must be exactly 10 digits";
    return "";
  },

  password: (value, label = "Password") => {
    const v = String(value ?? "");
    if (!v) return `${label} is required`;
    if (v.length < 8) return `${label} must be at least 8 characters`;
    return "";
  },

  confirmPassword: (value, password) => {
    const v = String(value ?? "");
    if (!v) return "Confirm password is required";
    if (v !== String(password ?? "")) return "Passwords do not match";
    return "";
  },

  otp: (value) => {
    const v = trim(value);
    if (!v) return "OTP is required";
    if (!/^\d{6}$/.test(v)) return "OTP must be exactly 6 digits";
    return "";
  },

  zipcode: (value) => {
    const v = trim(value);
    if (!v) return "Zip code is required";
    if (!/^\d{5,6}$/.test(v)) return "Zip code must be 5 or 6 digits";
    return "";
  },

  text: (value, label = "This field", min = 2) => {
    const v = trim(value);
    if (!v) return `${label} is required`;
    if (v.length < min) return `${label} must be at least ${min} characters`;
    return "";
  },

  price: (value) => {
    const v = trim(value);
    if (!v) return "Price is required";
    const num = Number(v);
    if (Number.isNaN(num) || num <= 0) return "Price must be a positive number";
    return "";
  },

  image: (file) => {
    if (!file) return "Image is required";
    if (file.type && !file.type.startsWith("image/")) {
      return "Please upload a valid image file";
    }
    return "";
  },

  promocode: (value) => {
    const v = trim(value);
    if (!v) return "Promo code is required";
    return "";
  },

  select: (value, label = "Selection") => {
    if (!trim(value)) return `${label} is required`;
    return "";
  },
};

export const addressValidators = {
  firstName: (v) => validators.name(v, "First name"),
  lastName: (v) => validators.name(v, "Last name"),
  email: (v) => validators.email(v),
  street: (v) => validators.text(v, "Street"),
  city: (v) => validators.text(v, "City"),
  state: (v) => validators.text(v, "State"),
  zipcode: (v) => validators.zipcode(v),
  country: (v) => validators.text(v, "Country"),
  phone: (v) => validators.phone(v),
};

export const validateFields = (data, schema) => {
  const errors = {};
  Object.keys(schema).forEach((key) => {
    const message = schema[key](data[key], data);
    if (message) errors[key] = message;
  });
  return errors;
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
