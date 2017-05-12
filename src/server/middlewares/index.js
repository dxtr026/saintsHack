/*
    Middleware Attachment
*/

export function registerMiddlewares (app){
  console.log('[info] Registering middlewares');
  function useMiddlewareModule (middleware){
      if(middleware instanceof Function){
          return app.use(middleware());
      }
      else{
          return app.use(require(`./${middleware}`).default);
      }
  }

  try{
      const filesList = [
          // 'end_callbacks_trigger',
          // 'datadog_request_tracker',
          // 'datadog_response_tracker'
          // 'content_security_policy'
      ];

      filesList.forEach(useMiddlewareModule);

  } catch (error){
      console.error(error)
  }
}
