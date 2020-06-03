const Connection = require('../models/connection.model');

class ConnectionController {
  async create(req, res, next) {
    try {
      const connection = new Connection(req.body);
      connection.user = req.user._id;
      const newConnection = await connection.save();
      const populatedConnection = await Connection.findById(newConnection._id).populate('from to')
      res.status(201).json(populatedConnection);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    Object.assign(req.connection, req.body);
    try {
      const updatedConnection = await req.connection.save();
      const populatedConnection = await Connection.findById(updatedConnection._id).populate('from to')
      res.json(populatedConnection);
    } catch (error) {
      next(error);
    }
  }

  read(req, res) {
    res.json(req.connection);
  }

  async list(req, res, next) {
    try {
      const list = await Connection.find({user: req.user._id})
          .populate('from to')
          .lean();

      res.json({
        list
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await req.connection.remove();
      res.json(req.connection);
    } catch (error) {
      next(error);
    }
  }

  getConnectionByID(req, res, next, id) {
    console.log('here')
    Connection.findById(id)
      .then(connection => {
        if (!connection) {
          res.status(404).json({ message: 'The connection was not found' });
          return;
        }

        req.connection = connection;
        next();
      })
      .catch(next);
  }
}

module.exports = { connectionController: new ConnectionController() };
