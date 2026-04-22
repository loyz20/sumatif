function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : 'general';

      if (!errors[field]) {
        errors[field] = [];
      }

      errors[field].push(issue.message);
    }

    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

module.exports = {
  validate,
};
