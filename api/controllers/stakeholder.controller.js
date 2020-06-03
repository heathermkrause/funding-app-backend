// const mongoose = require('mongoose');
const _ = require('lodash');
const Stakeholder = require('../models/stakeholder.model');
const Connection = require('../models/connection.model');

class StakeholderController {
  async create(req, res, next) {
    try {
        const stakeholder = new Stakeholder(req.body);
        stakeholder.user = req.user._id;

        const newStakeholder = await stakeholder.save();
        res.status(201).json(newStakeholder);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    Object.assign(req.stakeholder, req.body);
    try {
        const updatedStakeholder = await req.stakeholder.save();
        res.json(updatedStakeholder);
    } catch (error) {
        next(error);
    }
  }

  read(req, res) {
    res.json(req.stakeholder);
  }

  async list(req, res, next) {
    try {
        const where = { user: req.user._id };
        const [list] = await Promise.all([
          Stakeholder
            .find(where)
            .lean()
        ]);

        res.json({
          list
        });

    } catch (error) {
        next(error);
    }
  }

  async remove(req, res, next) {
    try {
        await req.stakeholder.remove();
        await Connection.deleteMany({ $or: [{from: req.stakeholder._id}, {to: req.stakeholder._id}] });
        res.json(req.stakeholder);
    } catch (error) {
        next(error);
    }
  }

  getStakeholderByID(req, res, next, id) {
    Stakeholder.findById(id)
        .then(stakeholder => {
            if (!stakeholder) {
            res.status(404).json({ message: 'The stakeholder was not found' });
            return;
            }

            req.stakeholder = stakeholder;
            next();
        })
        .catch(next);
  }
}

module.exports = { stakeholderController: new StakeholderController() };
