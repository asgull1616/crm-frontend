// src/components/customersCreate/validateCustomerForm.js

export const validateCustomerForm = (form) => {
  const errors = {};

  if (!form.fullName?.trim()) {
    errors.fullName = "İsim soyisim zorunludur";
  } else if (form.fullName.length > 160) {
    errors.fullName = "İsim soyisim en fazla 160 karakter olabilir";
  }

  if (!form.email?.trim()) {
    errors.email = "Email zorunludur";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Geçerli bir email adresi giriniz";
  }

  if (form.phone && !/^\+?[1-9]\d{7,14}$/.test(form.phone)) {
    errors.phone = "Telefon numarası geçerli bir formatta değil";
  }

  if (form.vatNumber && !/^\d{10,11}$/.test(form.vatNumber)) {
    errors.vatNumber = "Vergi numarası 10 veya 11 haneli olmalıdır";
  }

  if (
    form.website &&
    !/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(form.website)
  ) {
    errors.website = "Website geçerli bir domain formatında olmalıdır";
  }

  return errors;
};
