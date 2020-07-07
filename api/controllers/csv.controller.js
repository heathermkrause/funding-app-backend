const Connection = require('../models/connection.model');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

class CSVController {

    async export (req, res, next) {

        try {
            const connections = await Connection.find({ project: req.query.project_id })
                .populate('from to')
                .lean();

            const doc = connections.map((con, index) => ({
                connection: `#${index+1}`,
                type: con.type,
                from: con.from.name,
                to: con.to.name,
                note: con.note
            }))
            
            console.log(connections);
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(doc); 
            console.log(csv);
            res.json({data:csv});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { csvController: new CSVController() };
