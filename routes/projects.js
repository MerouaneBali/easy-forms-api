const express = require("express");
const router = express.Router();

const authorized = require("../middleware/authorized");

const projectsValidationSchemas = require("../validation/projectsValidationSchemas");

/**
 * @module projects
 *
 * @category Routes
 *
 * @description Express router handling projects related requests
 *
 * @requires express
 */

/**
 * Create new project
 *
 * @name /-[POST]
 *
 * @function
 *
 * @memberof module:projects
 *
 * @description Create new project
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {201} In case project was successfully created
 * @returns {400} In case of validation error
 * @returns {409} In case form with the same name already exists
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.post("/", authorized, async (req, res) => {
  const { Project } = require("../models");

  const body = {
    name: req.body.name,
    author: req.user.id,
  };

  const { error, value } = projectsValidationSchemas.create.validate(body);

  if (error) {
    console.log(error);

    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const result = await Project.exists({
      author: req.user._id,
      name: value.name,
    });

    if (result) throw new Error(409);
  } catch (error) {
    if (error.message === "409") {
      return res.sendStatus(409);
    }

    return res.sendStatus(500);
  }

  try {
    const project = new Project(value);

    await project.save();

    return res.status(201).json({
      id: project.id,
      name: project.name,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * Get all projects
 *
 * @name /-[GET]
 *
 * @function
 *
 * @memberof module:projects
 *
 * @description Get all projects
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {201} In case project was successfully created
 * @returns {400} In case of validation error
 * @returns {409} In case form with the same name already exists
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.get("/", authorized, async (req, res) => {
  const { Project } = require("../models");

  try {
    const result = await Project.find(
      { author: req.user._id },
      "id name forms"
    ).populate("forms");

    // const projects = result.map((project) => {
    //   project.forms.map((form) => {
    //     console.log(form.id, form.inbox);
    //     // form.count = form.inbox.length;
    //     return form;
    //   });

    //   // console.log(forms[0].inbox);
    // });

    // console.log(projects);

    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
});


/**
 * Update project
 *
 * @name /update-[POST]
 *
 * @function
 *
 * @memberof module:projects
 *
 * @description Update project
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {201} In case project was successfully created
 * @returns {400} In case of validation error
 * @returns {409} In case form with the same name already exists
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.post("/update", authorized, async (req, res) => {
  const { Project } = require("../models");

  const body = {
    project: req.body.project,
    name: req.body.name,
  };

  const { error, value } = projectsValidationSchemas.update.validate(body);

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const project = await Project.findByIdAndUpdate(value.project, {
      $set: { name: value.name },
    });

    await project.save();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }

  // try {
  //   const result = await Project.exists({
  //     author: req.user._id,
  //     name: value.name,
  //   });

  //   if (result) throw new Error(409);
  // } catch (error) {
  //   if (error.message === "409") {
  //     return res.sendStatus(409);
  //   }

  //   return res.sendStatus(500);
  // }

  // try {
  //   const project = new Project(value);

  //   await project.save();

  //   return res.status(201).json({
  //     id: project.id,
  //     name: project.name,
  //   });
  // } catch (error) {
  //   return res.sendStatus(500);
  // }
});

/**
 * Delete project
 *
 * @name /-[POST]
 *
 * @function
 *
 * @memberof module:projects
 *
 * @description Delete project
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware
 *
 * @returns {401} In case user in not authenticated - authorized middleware
 * @returns {403} In case user emailVerified property in set to false - authorized middleware
 * @returns {404} In case user does not exist - authorized middleware
 * @returns {500} In case server internal error happends - authorized middleware
 *
 * @returns {201} In case project was successfully created
 * @returns {400} In case of validation error
 * @returns {409} In case form with the same name already exists
 * @returns {409} In case user with the same email already exists
 * @returns {500} In case of any internal server error
 */
router.post("/delete", authorized, async (req, res) => {
  const { Project, Form } = require("../models");

  const body = {
    project: req.body.project,
    author: req.user.id,
  };

  const { error, value } = projectsValidationSchemas.delete.validate(body);

  if (error) {
    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const project = await Project.findById(value.project).populate("forms");

    await project.forms.map(
      async (form) => await Form.findByIdAndDelete(form.id)
    );

    await project.delete();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
