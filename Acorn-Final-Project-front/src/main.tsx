import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';
import { legacy_createStore as createStore, Reducer } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const queryClient = new QueryClient();

const initState: State = {
  userInfo: null,
  isLogin: false
}

interface State {
  userInfo: {
    userId: string;
    userName: string;
    storeName: string;
    cdRole: string;
  } | null;
  isLogin: boolean;
}

type Action = {
  type: 'LOGIN';
  payload: {
    userInfo: {
      userId: string;
      userName: string;
      storeName: string;
      cdRole: string;
    }
  }
}

const reducer: Reducer<State, Action> = (state = initState, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        userInfo: action.payload.userInfo,
        isLogin: true
      };
    default:
      return state;
  }
}
const store = createStore<State, Action>(reducer);

const userStr = localStorage.getItem('user');
if (userStr) {
  const user = JSON.parse(userStr);
  store.dispatch({
    type: 'LOGIN',
    payload: {
      userInfo: {
        userId: user.userId,
        userName: user.userName,
        storeName: user.storeName,
        cdRole: user.cdRole
      }
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <QueryClientProvider client={queryClient}>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  </QueryClientProvider>
);