const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let roleValidate = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol válido",
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "el nombre es necesario"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "el correo es necesario"],
    },
    password: {
        type: String,
        required: [true, "la contraseña es obligatoria"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: roleValidate,
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

userSchema.plugin(uniqueValidator, {message: "{PATH} debe ser único"});

module.exports = mongoose.model("User", userSchema);
