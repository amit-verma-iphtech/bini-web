const reducerNewCommandSuggestion = (params) => {
  const { state, action } = params;

  return { ...state, currentSuggestions: action.payload };
};
const reducerTurnOnTypingMode = (params) => {
  const { state, action } = params;

  return { ...state, typingMode: true };
};
const reducerTurnOffTypingMode = (params) => {
  const { state, action } = params;

  return { ...state, typingMode: false };
};

export {
  reducerNewCommandSuggestion,
  reducerTurnOnTypingMode,
  reducerTurnOffTypingMode,
};
