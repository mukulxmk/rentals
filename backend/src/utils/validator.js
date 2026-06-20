class BaseValidator {
  constructor(type) {
    this.type = type;
    this.rules = [];
  }

  required(message) {
    this.rules.push({
      check: (value) =>
        value !== undefined &&
        value !== null &&
        value !== "",
      message: message || "is required",
    });

    return this;
  }

  custom(fn, message) {
    this.rules.push({
      check: fn,
      message,
    });

    return this;
  }
}

class StringValidator extends BaseValidator {
  constructor() {
    super("string");
  }

  min(length) {
    return this.custom(
      (value) =>
        value === undefined ||
        (typeof value === "string" &&
          value.length >= length),
      `must contain at least ${length} characters`
    );
  }

  max(length) {
    return this.custom(
      (value) =>
        value === undefined ||
        (typeof value === "string" &&
          value.length <= length),
      `must contain at most ${length} characters`
    );
  }

  email() {
    return this.custom(
      (value) =>
        value === undefined ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "must be a valid email"
    );
  }
}

class NumberValidator extends BaseValidator {
  constructor() {
    super("number");
  }

  min(value) {
    return this.custom(
      (v) =>
        v === undefined ||
        Number(v) >= value,
      `must be greater than or equal to ${value}`
    );
  }

  max(value) {
    return this.custom(
      (v) =>
        v === undefined ||
        Number(v) <= value,
      `must be less than or equal to ${value}`
    );
  }
}

class ArrayValidator extends BaseValidator {
  constructor() {
    super("array");
  }

  min(length) {
    return this.custom(
      (v) =>
        v === undefined ||
        v.length >= length,
      `must contain at least ${length} items`
    );
  }
}

class BooleanValidator extends BaseValidator {
  constructor() {
    super("boolean");
  }
}

class ObjectValidator extends BaseValidator {
  constructor(schema = null) {
    super("object");
    this.schema = schema;
  }

  parse(data) {
    const errors = [];

    Object.entries(this.schema).forEach(
      ([field, validator]) => {
        const value = data?.[field];

        if (
          value !== undefined &&
          !isType(value, validator.type)
        ) {
          errors.push({
            field,
            message: `must be ${validator.type}`,
          });

          return;
        }

        validator.rules.forEach((rule) => {
          if (!rule.check(value)) {
            errors.push({
              field,
              message: rule.message,
            });
          }
        });
      }
    );

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

function isType(value, type) {
  switch (type) {
    case "string":
      return typeof value === "string";

    case "number":
      return !isNaN(Number(value));

    case "boolean":
      return typeof value === "boolean";

    case "array":
      return Array.isArray(value);

    case "object":
      return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      );

    default:
      return true;
  }
}

module.exports = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  boolean: () => new BooleanValidator(),
  array: () => new ArrayValidator(),
  object: (schema) => new ObjectValidator(schema),
};