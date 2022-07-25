const isEmpty = require('is-empty');
const validator = require('validator');

module.exports.loginValidator = (data) =>{
    const errors = {};

    data.email = !(isEmpty(data.email)) ? data.email: ''
    data.password = !(isEmpty(data.password)) ? data.password: ''
    
    let emailError = validator.isEmpty(data.email) ? 'Email is Required' : (!validator.isEmail(data.email) ? 'Please provide a valid email' : '');
    let passwordError = validator.isEmpty(data.password) ? 'Password is required' : '';

    if(emailError) errors.email = emailError
    if(passwordError) errors.password = passwordError

    return{
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports.registerValidator = (data) =>{
    const errors = {};
    console.log("data from validation",data)

    data.email = !(isEmpty(data.email)) ? data.email: ''
    data.password = !(isEmpty(data.password)) ? data.password: ''
    data.name = !(isEmpty(data.name)) ? data.name: ''
    data.collegename = !(isEmpty(data.collegename)) ? data.collegename: ''

    let emailError = validator.isEmpty(data.email) ? 'Email is requried' : (!validator.isEmail(data.email) ? 'Please provide a valid email': '')
    let passwordError = validator.isEmpty(data.password) ? 'Password is required' : ''
    let nameError = validator.isEmpty(data.name) ? 'Name is required' : ''
    let collegeNameError = validator.isEmpty(data.collegename) ? 'College Name is Required' : ''

    if(emailError) errors.email = emailError
    if(passwordError) errors.password = passwordError
    if(nameError) errors.name = 'Name is Required'
    if(collegeNameError) errors.collegename = 'College Name is Required'

    return{
        errors,
        isValid: isEmpty(errors)
    }
}