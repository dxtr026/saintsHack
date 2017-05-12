import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer          from '../reducers';
import thunk                from 'redux-thunk';

export default function configureStore (initialState = {}) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk)

  if (!__SERVER__ && window.devToolsExtension) {
    const devTools            = window.devToolsExtension();
    middleware = compose(middleware, devTools);
  }

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store
}
