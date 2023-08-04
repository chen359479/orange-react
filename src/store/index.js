import { createStore , combineReducers  } from 'redux'

import user from './user';

//可以合并多个模块
const Reducer = combineReducers({
    user,
})

const store=createStore(Reducer);

export default store;
