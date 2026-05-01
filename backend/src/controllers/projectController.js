const Project = require('../models/Project');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  const project = new Project({
    name,
    description,
    members: members || [],
    createdBy: req.user._id,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  let projects;
  if (req.user.role === 'ADMIN') {
    projects = await Project.find({}).populate('members', 'name email');
  } else {
    projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
  }
  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email');

  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

module.exports = { createProject, getProjects, getProjectById };
