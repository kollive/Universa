import { createStore, applyMiddleware, compose  } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
//import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

//import { composeWithDevTools } from 'redux-devtools-extension';
export default function configureStore(initialState,sagaMiddleware, routerMiddleware) {
//debugger;
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(
        applyMiddleware(sagaMiddleware,routerMiddleware))        
    );
}
