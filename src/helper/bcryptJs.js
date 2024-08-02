const {hashSync, compareSync} = require ('bcryptjs')


module.exports = {
    hashPassword : (password) => hashSync(password),
    comparePassword: (input, passwordDb) => compareSync(input, passwordDb)
}