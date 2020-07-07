const User = require('../models/user.model');
const ROLES = require('../constants/roles');
const { restaurantService } = require('../services/restaurant.service');
const APIError = require('../utils/api-error');

class ProfileController {
  
  async update(req, res, next) {
    try {
      const { firstName, lastName, email, password = null } = req.body;
      Object.assign(req.userModel, {
        firstName,
        lastName,
        email
      });

      if (!!password) {
        await req.userModel.setPassword(password);
      }

      if (req.body.role) {
        req.userModel.role = req.body.role;
      }

      const updatedUser = await req.userModel.save();
      if (updatedUser.role !== ROLES.OWNER) {
        await restaurantService.removeRestaurantsByUser(updatedUser);
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  read(req, res) {
    res.json(req.userModel);
  }


  async remove(req, res, next) {
    try {
      await req.userModel.remove();
      if (req.userModel.role === ROLES.OWNER) {
        await restaurantService.removeRestaurantsByUser(req.userModel);
      }
      res
        .status(200)
        .json(req.userModel)
        .end();
    } catch (err) {
      next(err);
    }
  }

  getUserByID(req, res, next, id) {
    User.findById(id)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'The user was not found' });
          return;
        }

        req.userModel = user;
        next();
      })
      .catch(next);
  }
}

module.exports = { profileController: new ProfileController() };
