'use strict'

module.exports = {

  emailIsValid: function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  passwordIsValid: function (password) {
    return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password);
  },
  PhonenumberValidate: function (phone) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
  }
}