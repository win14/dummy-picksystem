export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEalry: true });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "fail",
        errors: errorMessages,
      });
    }
    req.body = value;
    next();
  };
}
