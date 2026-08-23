const customRequestHandler = (func) => {
  return async (req, res, next) => {
    try {
      return await func(req, res, next);
    } catch (error) {
      console.log("Error handler error : ", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong!",
      });
    }
  };
};

export default customRequestHandler;
