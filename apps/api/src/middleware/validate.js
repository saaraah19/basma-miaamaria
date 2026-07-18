/**
 * Wraps a zod schema as Express middleware. On success, req.body is
 * REPLACED with the parsed (and coerced/trimmed) data — so controllers
 * always work with clean data and never touch req.body raw.
 *
 * Usage:
 *   router.post("/", protect, validate(projectCreateSchema), createProject);
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // z.treeifyError / issues shape varies by zod version; flatten to a
    // simple { field: message } map that's easy for the admin UI to render.
    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_root";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return res.status(400).json({
      error: "Données invalides.",
      fields: fieldErrors,
    });
  }

  req.body = result.data;
  next();
};
