const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const validationSchema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});

/**
 * Creates a new User
 * @param request
 * @param response
 */
async function create(request, response) {
  const {username, password, objective} = request.body;
  const userCredentials = {
    username,
    password,
  };

  // Validation
  const validation = validationSchema.validate(userCredentials);
  if (validation.error) {
    return response.json({
      error: validation.error.details
    })
  }

  if (await usernameExists(username)) {
    return response.json({
      message: "L'email est déjà utilisé",
    })
  }

  const hashedPassword = await bcrypt.hashSync(password, 8);
  const user = new User({
    username,
    password: hashedPassword,
    objective,
    current: 0,
  });
  try {
    user.save().then((user) => {
      const token = jwt.sign({
          _id: user._id,
        },
        process.env.TOKEN_SECRET
      );
      return response.json({
        user: user._id,
        token,
      })
    })
  } catch (errors) {
    response.json({
      errors
    });
  }
}


/**
 * Attemps to log an user in
 * @param request
 * @param response
 * @return {Promise<any>}
 */
async function login(request, response) {
  const {username, password} = request.body;
  if (await usernameExists(username)) {
    const user = await User.findOne({username});
    if (await isPasswordValid(password, user.password)) {
      const token = jwt.sign({
          _id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      response.header('auth-token', token).json({
        token,
      })
    } else {
      return response.json({
        password: "Le mot de passe n'a pas été trouvé...",
      })
    }
  } else {
    return response.json({
      message: "Nom d'utilisateur non trouvé.",
    })
  }
}

/**
 * Add Carbs to current user score to the connected user
 * @param request
 * @param response
 */
async function addCarb(request, response) {
  const user = await User.findById(request.user._id);
  user.current += request.body.carbs;
  await user.save();
  return response.json({user})
}

/**
 * Returns the connected user info
 * @param request
 * @param response
 * @return {Promise<*>}
 */
async function connectedUser(request, response) {
  const user = await User.findById(request.user._id);
  return response.json({user});
};

/**
 * Resets the current objective, this is a new day !
 * @param request
 * @param response
 * @return {Promise<*>}
 */
async function reset(request, response) {
  const user = await User.findOneAndUpdate({
    id: request.user._id
  }, {
    current: 0,
  });
  return response.json({user});
};


/**
 * Checks if the userName exists in database
 * @param username
 */
function usernameExists(username) {
  return User.findOne({
    username
  });
}

/**
 * Checks if the second parameter matches the first one
 * @param databasePassword
 * @param testedPassword
 */
function isPasswordValid(testedPassword, databasePassword) {
  return bcrypt.compare(testedPassword, databasePassword);
}

module.exports.create = create;
module.exports.login = login;
module.exports.connectedUser = connectedUser;
module.exports.addCarb = addCarb;
module.exports.reset = reset;
