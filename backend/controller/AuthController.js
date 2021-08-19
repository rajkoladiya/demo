'use strict'

const UserModel = require('./../Model/User')
const validate = require('./../Utils/Validation')
const constant = require('./../Constant/index')
const jwt = require('jsonwebtoken')
const mailer = require('./../service/emailservice')
const responseService = require('./../service/responseService')
const bcrypt = require('bcryptjs');

module.exports = {
    register: function (req, res) {
        return new Promise((resolve, reject) => {
            const email = req.body.email ? req.body.email : '';
            if (email && validate.emailIsValid(req.body.email)) {
                if (req.body.password != null && req.body.password != undefined) {
                    let passwordhash = bcrypt.hashSync(req.body.password, 10)
                    UserModel.create({ email: email, password: passwordhash, Verifytoken: Math.random().toString(36).replace('0.', ''), managerName: req.body.managerName }, function (err, users) {
                        if (err) {
                            res.status(404)
                            const response = responseService.error({msg: 'this email already used'})
                            resolve(response);
                        } else if (users == null || users == undefined) {
                            res.status(401)
                            const response = responseService.error({msg: 'user not register'})
                            resolve(response)
                        } else {
                            
                            res.status(201)
                            const response = responseService.success({msg: 'registration successfully'})
                            resolve(response);
                        }
                    })
                } else {
                    const response = responseService.error({msg: 'Please Enter Valid Password'})
                    resolve(response)
                }
                
            } else {
                const response = responseService.error({msg: 'Please Enter Valid Password'})
                resolve(response);
            }
        })

    },
    conformmail: function (req, res) {
        if (req.query.id) {
            UserModel.findOne({ _id: req.query.id }).then(users => {
                users.isverified = true
                users.save().then(data => {
                    res.end("<h1>Email " + users.email + " is been Successfully verified");
                })

            })

        }
        else {
            res.end("<h1>Bad Request</h1>");
        }
    },
    login: function (req, res) {
        return new Promise((resolve, reject) => {
            if (req.body.email != null && req.body.email != undefined && validate.emailIsValid(req.body.email)) {
                UserModel.findOne({ email: req.body.email }, function (err, users) {
                    if (err) {
                        const response = responseService.error({msg: err})
                        resolve(response)
                    } else if (users == null || users == undefined) {
                        const response = responseService.error({msg: 'user not register'})
                        resolve(response)
                    } else {
                        if (bcrypt.compareSync(req.body.password, users.password)) {
                            if (users.isverified == true) {
                                users.password = null
                                let token = jwt.sign({ email: req.body.email, _id: users._id, restaurantId: users.restaurantId }, 'secret', { expiresIn: '24h' }, constant.secret);
                                res.status(200)
                                const response = responseService.success({msg: 'login successfully', payload: users, tokendata: token});
                                resolve(response);
                            } else {
                                const response = responseService.error({msg: 'Please  confirm   Email'})
                                res.status(401)
                                resolve(response);
                            }
                        } else {
                            res.status(401)
                            const response = responseService.error({msg: 'Please Enter correct Password'})
                            resolve(response);
                        }
                    }
                })
            }
        })

    },
    update: function (req, res) {
        return new Promise((resolve, reject) => {
            if (req.body.email != null && req.body.email != undefined && validate.emailIsValid(req.body.email)) {
                UserModel.findOne({ email: req.body.email }, function (err, users) {
                    if (err) {
                        resolve(err)
                    } else if (users == null || users == undefined) {
                        res.status(401)
                        resolve('user not register')
                    }
                    else {
                        if (bcrypt.compareSync(req.body.password, users.password)) {
                            if (req.body.phone != null && req.body.phone != undefined) {
                                if (validate.PhonenumberValidate(req.body.phone)) {
                                    res.status(200)
                                    users.phone = req.body.phone
                                } else {
                                    res.status(401)
                                    resolve('Please Enter Currect Phone No.')
                                }
                            }

                            if (req.body.firstname != null && req.body.firstname != undefined) {
                                users.firstname = req.body.firstname
                            }
                            if (req.body.lastname != null && req.body.lastname != undefined) {
                                users.lastname = req.body.lastname
                            }
                            users.save().then(data => {
                                data.password = null
                                let updateresponce = {
                                    email: users.email,
                                    firstname: users.firstname,
                                    lastname: users.lastname,
                                    phone: users.phone
                                }
                                res.status(200)
                                resolve(updateresponce)
                            })
                        } else {
                            res.status(401)
                            resolve('Please Enter Correct Password')
                        }
                    }
                })
            }
        })
    },
    changepassword: function (req, res) {
        return new Promise((resolve, reject) => {
            if (req.body.email != null && req.body.email != undefined && validate.emailIsValid(req.body.email)) {
                UserModel.findOne({ email: req.body.email }, function (err, users) {
                    if (err) {
                        res.status(401)
                        resolve(err)
                    } else if (users == null || users == undefined) {
                        res.status(401)
                        resolve('user not register')

                    }
                    else {
                        if (bcrypt.compareSync(req.body.oldpassword, users.password)) {
                            users.password = bcrypt.hashSync(req.body.password, 10)
                            users.save().then(data => {
                                data.password = null
                                res.status(200)
                                resolve(data)
                            })
                        } else {
                            res.status(401)
                            resolve('Please Enter Valid Password')
                        }
                    }
                })
            }
        })
    },
    forgotpassword: function (req, res) {
        return new Promise((resolve, reject) => {
            if (req.body.Verifytoken != null && req.body.Verifytoken != undefined) {
                if (req.body.Password != null && req.body.Password != undefined && validate.passwordIsValid(req.body.Password)) {
                    UserModel.findOne({ Verifytoken: req.body.Verifytoken }, function (err, users) {
                        if (err) {
                            res.status(404)
                            resolve(err)
                        } else if (users == null || users == undefined) {
                            res.status(404)
                            resolve('user not register')
                        } else {
                            users.password = bcrypt.hashSync(req.body.Password, 10),
                                users.Verifytoken = Math.random().toString(36).replace('0.', '')
                            users.save()
                            res.status(200)
                            resolve('your password successfully changed')
                        }
                    })
                } else {
                    res.status(401)
                    resolve('Please Enter Valid Password')

                }
            } else {
                res.status(401)
                res.send('somthing went wrong please try again')
            }
        })
    },
    forgotpasswordrequest: function (req, res) {
        return new Promise((resolve, reject) => {
            if (req.body.email != null && req.body.email != undefined && validate.emailIsValid(req.body.email)) {
                UserModel.findOne({ email: req.body.email }, function (err, users) {
                    if (err) {
                        res.status(400)
                        resolve(err)
                    } else if (users == null || users == undefined) {
                        res.status(200)
                        resolve('Please check link')
                    } else {
                        mailer.forgotpasswordmail(users, req.get('host'),  res)
                        res.status(200)
                        resolve('please check mail and click on link')
                    }
                })
            } else {
                res.status(401)
                rresolve('please enter valid password')
            }
        })
    },
    updateCompanyName: function (req, res) {
        return new Promise((resolve, reject) => {
            const { companyName, id } = req.body;
            console.log('@@@companyName', companyName)
            console.log('@@@id', id)
            if (companyName && id) {
                UserModel.updateOne({ _id: id }, {restaurantName: companyName}, function (err, company) {
                    if (err) {
                        res.status(400)
                        const response = responseService.error({msg: err})
                        resolve(response);
                    } else {
                        res.status(200)
                        const response = responseService.success({msg: 'company Name updated', payload: company})
                        resolve(response);
                    }
                })
            } else {
                res.status(401)
                const response = responseService.error({msg: 'Please enter company name'})
                resolve(response);
            }
        })
    },
}

