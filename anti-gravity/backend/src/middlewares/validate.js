const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { error } = require("../utils/response");

const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });
addFormats(ajv);

/**
 * Middleware factory for JSON Schema validation
 * @param {Object} schema - JSON Schema
 * @param {'body'|'query'|'params'} source - Request property to validate
 */
const validate = (schema, source = "body") => {
  const compiledSchema = ajv.compile(schema);

  return (req, res, next) => {
    const data = req[source];
    const valid = compiledSchema(data);

    if (!valid) {
      const errors = compiledSchema.errors.map((err) => ({
        field: err.instancePath.replace("/", "") || err.params.missingProperty,
        message: err.message,
      }));
      return error(res, "Validasi gagal", 400, errors);
    }

    next();
  };
};

module.exports = validate;
