const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Please enter email id"],
        unique: true,
        lowercase: true,
        validate :[isEmail,'please enter a valid email']
    },
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,'Minimum password length is 6 characters']
    },
}, {
    timestamps:true
});


//fire a function after doc saveto db
//post , pre are hook methods
userSchema.post('save', function (doc,next) {
    console.log('New user was created and saved',doc);
    
    next();
})

//fire a function before doc saveto db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('User about to be created and saved',this);
    next();
})
//static mthod to login usesr
userSchema.statics.login = async function (email,password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email')
}
const User = mongoose.model('user', userSchema);
module.exports = User;