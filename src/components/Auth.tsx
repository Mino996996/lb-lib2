import React, { useContext, useState } from 'react';
import { AppContext } from './state/ConfigProvider';
import { loginType } from './state/authReducer';
// import { signIn } from '../firebase/firebase'

export const Auth: React.FC = () => {
  const { dispatch } = useContext(AppContext);
  const [isJapaneseInput, setIsJapaneseInput] = useState(false);
  const [password, setPassword] = useState('');

  const checkPassword = (password: string, e: string): string => {
    if (!isJapaneseInput && e === 'Enter') {
      const correctPass = process.env.REACT_APP_PASSWORD;
      if (correctPass === password) {
        try {
          // await signIn();
          dispatch({ type: loginType });
          localStorage.setItem('loginState', 'true');
          setPassword('');
        } catch (e) {
          // return e
          return 'DB接続に失敗しました。しばらくして再度ログインしてください';
        }
      } else {
        return 'パスワードが違います';
      }
    }
    return '';
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 py-6 sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-lg overflow-hidden">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* <img */}
            {/*  className="mx-auto h-16 w-auto" */}
            {/*  src={logo} */}
            {/*  alt="Workflow" */}
            {/* /> */}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-green-900">LBの図書館</h2>
          </div>
          <div className="py-8 px-4 sm:px-10 bg-white">
            <div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-green-900">
                  Password
                </label>
                <div
                  className="mt-1"
                  onCompositionStart={(e) => setIsJapaneseInput(true)}
                  onCompositionEnd={(e) => setIsJapaneseInput(false)}
                  onKeyDown={(e) => {
                    const loginResult = checkPassword(password, e.key);
                    if (loginResult !== '') {
                      alert(loginResult);
                    }
                  }}
                >
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={password === ''}
                  className={
                    'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ' +
                    (password === '' ? 'bg-gray-400' : 'hover:bg-green-700 ')
                  }
                  onClick={() => checkPassword(password, 'Enter')}
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
