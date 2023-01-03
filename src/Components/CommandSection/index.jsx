/* eslint-disable radix */
/* eslint-disable import/no-cycle */
import TagInput from 'Components/TagInput';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles.scss';
import * as api from 'Api/request';
import { Snackbar, defaultSnackbar } from 'Components/Snackbar';
import { commandAction, commandOn } from 'Store/constants/command.constant';
import { NEXT_OBSERVATION, PREVIOUS_OBSERVATION, SET_NEW_COMMAND_SUGGESTIONS } from 'Store/constants/actionTypes';
import { getUsers } from 'Store/actions';
import { useTimer } from 'hooks';
import { commandAddItem, commandAddRemoveItem, commandAddVisitor, commandExitVisitor,
  commandInvalid, commandUnVerifyObservation,
  commandVerifyObservation, resetCommand } from './command.helper';

const checkIsNumber = (value) => {
  const result = parseInt(value);
  const status = result !== 'NaN' && result;
  return { value: result, status: !!status };
};
const getObjectId = async (stringValue, list) => {
  const { status, value } = checkIsNumber(stringValue);
  let result;
  if (status) {
    result = value;
  } else {
    const array = stringValue.split('-');
    const id = array[array.length - 1];
    const { status, value } = checkIsNumber(id);
    if (status) {
      result = value;
    }
  }
  if (result) {
    const objectData = list.find(({ id }) => id === result);
    if (!objectData) {
      return undefined;
    }
    return result;
  }
  return undefined;
};

const initialSettings = {
  blacklist: ['xxx', 'yyy', 'zzz'],
  maxTags: 6,
  placeholder: 'Give Commands',
  dropdown: {
    enabled: 0 // a;ways show suggestions dropdown
  }
};
export const commandTypeList = [
  { value: 'Observation', command: commandOn.observation },
  { value: 'Skip', command: commandAction.skip },
  { value: 'Back', command: commandAction.previous },
  { value: 'Visit', command: commandOn.visit },
  { value: 'Basket', command: commandOn.basket },
];
export const observationList = [
  { value: 'Verify', command: commandAction.verify },
  { value: 'UnVerify', command: commandAction.unVerified },
];
export const submitList = [
  { value: 'Submit', command: commandAction.submit },
  { value: 'Reset', command: commandAction.reset },
];
export const basketList = [
  { value: 'Increase Item', command: commandAction.increase },
  { value: 'Reduce Item', command: commandAction.reduce },
  // { value: 'Remove Item', command: commandAction.remove },
];
export const visitList = [
  { value: 'Enter', command: commandAction.enter },
  { value: 'Exit', command: commandAction.exit },
];
export default function CommandSection() {
  const { pause, reset, running, seconds, start, stop } = useTimer();

  const [snackbar, setSnackbar] = useState(defaultSnackbar);
  const {
    observationReducer: { currentObservation, visits, allDemoVisits },
    authReducer: { user, allUsers },
    commandReducer: { currentSuggestions },
    storeReducer: { items, currentStore },
    demoReducer: { isDemoMode }
  } = useSelector((state) => state);
  const [commands, setCommands] = useState([]);
  const [tagSettings, setTagSettings] = useState(initialSettings);
  const [tagProps, setTagProps] = useState({});
  const dispatch = useDispatch();
  // const [suggestions, setSuggestions] = useState([]);
  const [suggestItems, setSuggestItems] = useState([]);
  const [suggestUsers, setSuggestUsers] = useState([]);
  const [suggestVisits, setSuggestVisits] = useState([]);
  useEffect(async () => {
    if (items?.length >= 1) {
      const itemList = await items.map(({ id, name }) => ({ value: `${name}-${id}`, command: id }));
      setSuggestItems(itemList);
    }
  }, [items]);

  useEffect(async () => {
    if (allUsers?.length >= 1) {
      const users = await allUsers.map(({ id, name }) => ({ value: `${name}-${id}`, command: id }));
      setSuggestUsers(users);
    }
  }, [allUsers]);

  useEffect(async () => {
    if (visits?.length >= 1) {
      const visitors = await visits.map(({ id, user: { name } }) => ({ value: `${name}-${id}`, command: id }));
      setSuggestVisits(visitors);
    }
  },
  [visits]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    setTagProps({ ...tagProps, showFilteredDropdown: false, });
    setTagProps({ ...tagProps, whitelist: currentSuggestions, showFilteredDropdown: true, loading: false });
  }, [currentSuggestions]);

  const handleJump = (type) => {
    dispatch({ type });
    setCommands([]);
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: commandTypeList });
  };
  const handleObservationCommands = async (commandData) => {
    const { inputCommand } = commandData;
    // set suggestions for observation...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: observationList });

    // stop is no second command
    if (!inputCommand.two) return;

    // setSuggestions for third command as second command is available now...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: submitList });

    // return invalid command if match with non of the below condition
    if (inputCommand.two !== commandAction.verify && inputCommand.two !== commandAction.unVerified
    ) return commandInvalid(commandData, undefined);

    // stop is no third command
    if (!inputCommand.three) return;
    if (inputCommand.three === commandAction.submit) {
      const data = { ...commandData, data: { id: currentObservation.id, verified: true } };
      // console.log('commandData-->', commandData);
      // console.log('data-->', data);
      if (inputCommand.two === commandAction.verify) return commandVerifyObservation(data);
      if (inputCommand.two === commandAction.unVerified) return commandUnVerifyObservation(data);
    } else if (inputCommand.three === commandAction.reset) {
      resetCommand(commandData);
      // reset commands hear...
    } else {
      commandInvalid(commandData, submitList);
    }
  };
  const handleVisitCommands = async (commandData) => {
    const { inputCommand } = commandData;
    // set suggestions for visitCommand...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: visitList });

    // stop if not second command
    if (!inputCommand.two) return;
    setTagProps({ ...tagProps, loading: true });

    // return invalid command if match with non of the below condition
    if (inputCommand.two !== commandAction.enter && inputCommand.two !== commandAction.exit) commandInvalid(commandData);

    if (inputCommand.two === commandAction.enter) {
      dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: suggestUsers });
    } else if (inputCommand.two === commandAction.exit) {
      dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: suggestVisits });
    }
    // stop if not second command
    if (!inputCommand.three) return;
    let uid;
    if (inputCommand.two === commandAction.enter) {
      uid = await getObjectId(inputCommand.three, allUsers);
    } else if (inputCommand.two === commandAction.exit) {
      uid = await getObjectId(inputCommand.three, visits);
    } else {
      console.log('inputCommand.two', inputCommand.two, commandAction.enter, commandAction.exit);
      return commandInvalid({ ...commandData, message: 'second Command not matched with (enter||exit)' });
    }
    if (!uid) {
      return commandInvalid({ ...commandData, message: 'Invalid User/Visitor' });
    }

    // setSuggestions for third command as second command is available now...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: submitList });
    // stop is no third command
    if (!inputCommand.four) return;
    if (inputCommand.four === commandAction.submit) {
      // data includes payload and some required value in commandVisitor
      const data = {
        ...commandData,
        data: {
          userId: uid,
          observationId: currentObservation.id,
          storeId: currentStore.id,
        }
      };
      if (inputCommand.two === commandAction.enter) {
        const { name } = allUsers.find(({ id }) => id === uid);
        data.data.userName = name;
        data.data.start = currentObservation.start;
        return commandAddVisitor(data);
      }
      if (inputCommand.two === commandAction.exit) {
        const { user: { name } } = visits.find(({ id }) => id === uid);
        data.data.userName = name;
        data.data.end = currentObservation.end;
        return commandExitVisitor(data);
      }
    } else if (inputCommand.four === commandAction.reset) {
      resetCommand(commandData);
      // reset commands hear...
    } else {
      commandInvalid(commandData, submitList);
    }
  };
  const handleBasketCommands = async (commandData) => {
    const { inputCommand } = commandData;
    // set suggestions for visitCommand...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: basketList });

    // stop if not second command
    if (!inputCommand.two) return;
    // return invalid command if match with non of the below condition
    if (inputCommand.two !== commandAction.increase && inputCommand.two !== commandAction.reduce
      && inputCommand !== commandAction.remove) return commandInvalid(commandData);
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS,
      payload: [
        { value: 'One', command: 1 },
        { value: 'Two', command: 2 },
        { value: 'Three', command: 3 },
      ] });

    // stop if not third command (item counts missing)
    if (!inputCommand.three) return;
    const { status: countStatus, value: countValue } = checkIsNumber(inputCommand.three);
    if (!countStatus) {
      return commandInvalid({ ...commandData, message: 'Invalid Count' });
    }
    // suggest for fourth command to select a item....
    setTagProps({ ...tagProps, loading: true });

    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: suggestItems });

    // stop if not second command
    if (!inputCommand.four) return;
    const itemId = await getObjectId(inputCommand.four, items);
    if (!itemId) {
      return commandInvalid({ ...commandData, message: 'Invalid Item' });
    }
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: suggestVisits });
    // stop is no third command
    if (!inputCommand.five) return;
    const visitId = await getObjectId(inputCommand.five, visits);
    if (!visitId) {
      return commandInvalid({ ...commandData, message: 'Invalid Visitor' });
    }

    // setSuggestions for third command as second command is available now...
    dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: submitList });
    if (!inputCommand.six) return;

    if (inputCommand.six === commandAction.submit) {
      const visitData = visits.find(({ id }) => id === visitId);
      const { basket: { id: basketId, }, user: { name: userName } } = visitData;
      const currentItem = items.find((item) => {
        const { id } = item;
        return id === itemId;
      });

      if (!basketId) return commandInvalid({ ...commandData, message: 'Invalid basketId' });
      const data = { ...commandData,
        userName,
        itemName: currentItem?.name,
        data: {
          basketId,
          visitId,
          itemId,
          remove: countValue,
          add: countValue,
          observationId: currentObservation.id
        } };
      if (inputCommand.two === commandAction.reduce) {
        // alert(`reduce ${inputCommand.three} ${itemId}`);
        data.data.add = undefined;
        commandAddRemoveItem(data);
      } else if (inputCommand.two === commandAction.increase) {
        // alert(`add  ${inputCommand.three} ${itemId}`);
        data.data.remove = undefined;
        commandAddRemoveItem(data);
      } else if (inputCommand.two === commandAction.remove) {
        alert(`remove   ${itemId} from basket`);
      } else {
        alert('No match for Second command');
      }
    } else if (inputCommand.six === commandAction.reset) {
      return resetCommand(commandData);
      // reset commands hear...
    } else {
      return commandInvalid(commandData, submitList);
    }
  };

  const handleCommands = async () => {
    // get all commands
    const inputCommand = {
      one: commands[0]?.command || commands[0]?.value,
      two: commands[1]?.command || commands[1]?.value,
      three: commands[2]?.command || commands[2]?.value,
      four: commands[3]?.command || commands[3]?.value,
      five: commands[4]?.command || commands[4]?.value,
      six: commands[5]?.command || commands[5]?.value,
    };

    // check if skip or previous
    if (inputCommand.one === commandAction.skip) { return handleJump(NEXT_OBSERVATION); }
    if (inputCommand.one === commandAction.previous) return handleJump(PREVIOUS_OBSERVATION);

    // check if commands is empty
    if (!inputCommand.one) {
      dispatch({ type: SET_NEW_COMMAND_SUGGESTIONS, payload: commandTypeList });
      return;
    }

    // prepare some commonly used data
    const actionData = { observationId: currentObservation.id, actionBy: user.id, duration: seconds };
    const data = { };
    const commandData = {
      data,
      isDemoMode,
      dispatch,
      setCommands,
      useSelector: { visits, allDemoVisits, items, currentObservation },
      actionData,
      user,
      setSnackbar,
      commands,
      inputCommand,
      storeData:
      currentStore || { id: 1, message: 'No current store' }
    };
    // check first command belongs to which category...
    // console.log('commondData---9', commandData);
    if (inputCommand.one === commandOn.observation) handleObservationCommands(commandData);
    else if (inputCommand.one === commandOn.basket) handleBasketCommands(commandData);
    else if (inputCommand.one === commandOn.visit) handleVisitCommands(commandData);
    else commandInvalid(commandData);
  };

  useEffect(async () => {
    if (currentObservation?.id) {
      handleCommands();
      // handleAction();
    } else if (commands.length >= 1) {
      setSnackbar({ isVisible: true, type: 'error', message: 'Select any Observation' });
      setCommands([]);
    }
  }, [commands]);
  useEffect(() => {
    reset();
  }, [currentObservation]);
  function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = `0${hours}`; }
    if (minutes < 10) { minutes = `0${minutes}`; }
    if (seconds < 10) { seconds = `0${seconds}`; }
    return `${hours}:${minutes}:${seconds}`; // Return is HH : MM : SS
  }
  return (
    <>
      <div className="main-command-container">
        <div className="timer">

          (
          { `duration: ${convertHMS(seconds)}`}
          )
        </div>
        <div className="heading">
          Command Line
        </div>
        <div className="command-list-scroll">
          <TagInput
            commands={commands}
            setCommands={setCommands}
            // suggestions={suggestions}
            tagSettings={tagSettings}
            tagProps={tagProps}
            verify={() => { console.log('verify observation'); }}
          />
        </div>
      </div>
      <Snackbar
        isVisible={snackbar?.isVisible}
        message={snackbar?.message || ''}
        onClose={() => { setSnackbar(defaultSnackbar); }}
        type={snackbar?.type}
      />
    </>
  );
}
