const Project = require('../models/project.model');
const Connection = require('../models/connection.model');
const Stakeholder = require('../models/stakeholder.model');

class ProjectController {
    async create(req, res, next) {
        try {
            const project = new Project(req.body);
            project.user = req.user._id;
            const newProject = await project.save();
            res.status(201).json(newProject);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        Object.assign(req.project, req.body);
        try {
            const updatedProject = await req.project.save();
            res.json(updatedProject);
        } catch (error) {
            next(error);
        }
    }

    read(req, res) {
        res.json(req.project);
    }

    async list(req, res, next) {
        try {
            const project = await Project.find({user: req.user.id});
            console.log('current_project_id', req.user.current_project_id);
            // let projects = project.map(item => {
            //     return {...item, selected: item._id == req.user.current_project_id};
            // })
            res.json({ list: project, selected_project_id: req.user.current_project_id });
        } catch (error) {
            next(error);
        }
    }

    async remove(req, res, next) {
        try {
            await Connection.deleteMany({ project: req.project._id });
            await Stakeholder.deleteMany({ project: req.project._id });
            await req.project.remove();
            res.json(req.project);
        } catch (error) {
            next(error);
        }
    }

    getProjectByID(req, res, next, id) {
        Project.findById(id)
            .then(project => {
                if (!project) {
                    res.status(404).json({ message: 'The project was not found' });
                    return;
                }

                req.user.current_project_id = project._id;
                req.user.save();
                req.project = project;
                next();
            })
            .catch(next);
    }
}

module.exports = { projectController: new ProjectController() };
