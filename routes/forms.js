const express = require("express");
const router = express.Router();
const cors = require("cors");

const authorized = require("../middleware/authorized");

const formsValidationSchemas = require("../validation/formsValidationSchemas");

/**
 * @module forms
 *
 * @category Routes
 *
 * @description Express router handling forms related requests
 *
 * @requires express
 */

/**
 * Route serving update form.
 *
 * @name /create-[POST]
 *
 * @function
 *
 * @memberof module:forms
 *
 * @description Create new form for a project
 *
 * @param {string} path - Express path
 * @param {callback} authorized - Authorized middleware
 * @param {callback} middleware - Express middleware

 * @returns {201} In case form was successfully created
 * @returns {400} In case of validation error
 * @returns {404} In case project does not exists
 * @returns {409} In case form with the same name already exists
 * @returns {500} In case of any internal server error
 */
router.post("/", authorized, async (req, res) => {
  const { Project, Form } = require("../models");

  console.log("object");

  const body = {
    name: req.body.name,
    project: req.body.project,
    author: req.user.id,
  };

  const { error, value } = formsValidationSchemas.create.validate(body);

  if (error) {
    console.log(error);

    const validationError = error.details[0];

    return res.status(400).json({
      field: validationError.path[0],
      message: validationError.message,
    });
  }

  try {
    const result = Project.exists({ author: req.user._id, _id: value.project });

    if (!result) throw new Error(404);
  } catch (error) {
    if (error.message === "404") {
      if (!result) return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }

  try {
    const result = await Form.exists({
      author: req.user._id,
      project: value.project,
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
    const form = new Form(value);

    await Project.findByIdAndUpdate(
      form.project,
      { $push: { forms: form._id } },
      { new: true }
    );

    await form.save();

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// TODO: Protect
router.post(
  "/:formId",
  cors({
    origin: ["*"],
  }),
  async (req, res) => {
    console.log(req.body);

    const { Form } = require("../models");

    const { formId, projectId } = req.params;

    try {
      await Form.findOneAndUpdate(
        {
          _id: formId,
          // project: projectId,
        },
        { $push: { inbox: { data: { ...req.body } } } }
      );

      // const projects = result.map((project) => {
      //   project.forms.map((form) => {
      //     console.log(form.id, form.inbox);
      //     // form.count = form.inbox.length;
      //     return form;
      //   });

      //   // console.log(forms[0].inbox);
      // });

      // console.log(projects);

      // console.log(req.params.formId, result);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// TODO: Protect
router.patch(
  "/:formId/open/:messageId",
  cors({
    origin: ["*"],
  }),
  async (req, res) => {
    console.log(req.body);

    const { Form } = require("../models");

    const { formId, messageId } = req.params;

    try {
      // await Form.findOneAndUpdate(
      //   {
      //     _id: formId,
      //     "inbox.id": String(messageId),
      //   },
      //   { $set: { "inbox.$.resolved": String(true) } }
      // ).then((doc) => console.log(doc));

      const form = await Form.findById(formId);

      const message = await form.inbox.id(messageId);

      message.opened = true;

      await form.save();

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// TODO: Protect
router.patch(
  "/:formId/resolve/:messageId",
  cors({
    origin: ["*"],
  }),
  async (req, res) => {
    console.log(req.body);

    const { Form } = require("../models");

    const { formId, messageId } = req.params;

    try {
      // await Form.findOneAndUpdate(
      //   {
      //     _id: formId,
      //     "inbox.id": String(messageId),
      //   },
      //   { $set: { "inbox.$.resolved": String(true) } }
      // ).then((doc) => console.log(doc));

      const form = await Form.findById(formId);

      const message = await form.inbox.id(messageId);

      message.opened = true;
      message.resolved = true;

      console.log(message);

      await form.save();

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// TODO: Protect
router.delete(
  "/:formId/:messageId",
  cors({
    origin: ["*"],
  }),
  async (req, res) => {
    console.log(req.body);

    const { Form } = require("../models");

    const { formId, messageId } = req.params;

    try {
      await Form.findOneAndUpdate(
        {
          _id: formId,
        },
        { $pull: { inbox: { _id: messageId } } }
      ).then((doc) => console.log(doc));

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

router.get("/:projectId/:formId", authorized, async (req, res) => {
  const { Form } = require("../models");

  const { formId, projectId } = req.params;

  try {
    const result = await Form.findOne(
      {
        _id: formId,
        project: projectId,
        author: req.user.id,
      },
      "name project inbox"
    ).populate("project", "name");

    // const result = await Form.findOne(
    //   {
    //     _id: formId,
    //     project: projectId,
    //     author: req.user.id,
    //   },
    //   "name project inbox"
    // );

    // const projects = result.map((project) => {
    //   project.forms.map((form) => {
    //     console.log(form.id, form.inbox);
    //     // form.count = form.inbox.length;
    //     return form;
    //   });

    //   // console.log(forms[0].inbox);
    // });

    // console.log(projects);

    return result ? res.status(200).send(result) : res.sendStatus(404);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
