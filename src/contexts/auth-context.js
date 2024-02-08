import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { signInWithEmailAndPassword , signOut} from 'firebase/auth';
import { auth } from '../../firebase';
import api from "../utils/api";

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const [user, setUser] = useState(null);

  const initialize = () => {
    if (initialized.current) {
      return;
    }
  
    initialized.current = true;
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário está autenticado
        const userData = {
          id: user.uid,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          name: user.displayName,
          email: user.email
        };
  
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: userData
        });
      } else {
        // Usuário não está autenticado
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    });
  };

  useEffect(
    () => {
      initialize();
    },[]);

  const skip = () => {
    try {
      window.localStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
      window.sessionStorage.removeItem('authenticated')
    }

    if (isAuthenticated && user !== null) {
      console.log("🚀 ~ skip ~ user", user)
    const userData = {
      id: user.uid,
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: user.displayName,
      email: user.email
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: userData
    });
  }else{
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("🚀 ~ signIn ~ userCredential:", userCredential)
      const {data} = await api.get(`/user/${userCredential.user.uid}`);
      if(data.role === 'admin'){
        setUser(userCredential.user)
        window.localStorage.setItem('authenticated', 'true');
        const userData = {
          id: user.uid,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          name: user.displayName,
          email: user.email
        };
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: userData
        });
      }else {
        dispatch({
          type: HANDLERS.SIGN_OUT
        });
        throw new Error('Usuario não tem permissão')
      }
    } catch (err) {
      console.log("🚀 ~ signIn ~ err:", err)
      window.sessionStorage.removeItem('authenticated')
      if(err.code === 'auth/invalid-credential'){
        throw new Error('Email e senha incorretos')
      }
      throw new Error(err.message)
    }
  };

  const signUp = async (email, name, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("🚀 ~ signUp ~ userCredential :", userCredential )

      setUser(userCredential.user)
      const userData = {
        id: user.uid,
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: user.displayName,
        email: user.email
      };
  
  
      window.sessionStorage.setItem('authenticated', 'true');
  
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: userData
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to sign up with email and password');
    }
  };

  const logOut = () => {
    signOut(auth).then(() => {
      window.sessionStorage.removeItem('authenticated');
      dispatch({
        type: HANDLERS.SIGN_OUT
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
