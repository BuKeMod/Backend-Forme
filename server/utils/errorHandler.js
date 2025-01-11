// errorHandler.js
const handleError = (res, status = 401, customMessage = 'Something went wrong',error = null) => {
    console.log('err', error);
    res.status(status).json({
      msg: customMessage,
      error 
    });
  };
  
export default handleError;
  