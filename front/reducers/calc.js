export const initialState = {
  calculating: false,
  number: 0
};

const createRequest = request => ([`${request}_REQUEST`, `${request}_SUCCESS`, `${request}_FAILURE`])
export const [ADD_NUMBER_REQUEST, ADD_NUMBER_SUCCESS, ADD_NUMBER_FAILURE] = createRequest('calc/ADD_NUMBER');

export const addNumberAction = () => ({
  type: ADD_NUMBER_REQUEST
});

const calcReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_NUMBER_REQUEST:
      return {
        ...state,
        calculating: true
      }
    case ADD_NUMBER_SUCCESS:
      return {
        ...state,
        calculating: false,
        number: state.number+1,
      }
    case ADD_NUMBER_FAILURE:
      return {
        ...state,
        calculating: false
      }
    default:
      return state;
  }
}

export default calcReducer;
