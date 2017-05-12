export function createConstants (...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer (initialState, fnMap) {
  return (state = initialState, {
    type = null, payload = null
  }) => {
    const handler = fnMap[type];
    return handler ? handler(state, payload) : state;
  };
}

export function fetchComponentsData (dispatch, components, params, query, req) {
  const promises = new Array();
  for (const i in components) {
    if (components[i]) {
      const component = components[i].WrappedComponent ? components[i].WrappedComponent : components[i];
      if (component.fetchData) {
        promises.push(component.fetchData(dispatch, params, query, req));
      }
    }
  }
  return Promise.all(promises);
}
