import "./App.css";

import TaskContextProvider from "./contexts/TaskContext/TaskContext";
import TaskList from "./components/TaskList/TaskList";
import DarkModeToggle from "./components/DarkModeToggle/DarkModeToggle";
import LoginForm from "./components/LoginForm/LoginForm";
import { auth } from "./services/firebase/firebaseConfig";

import { useState, useEffect} from "react";
import { Toaster, toast } from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n-component";
import LanguageSwitch from "./components/LanguageSwitch/LanguageSwitch";

import Button from "./components/Button/Button";

function App() {
  let userLanguage = i18n.language.slice(0, 2);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);

  const handleLanguageChange = (e) => {
    e.preventDefault();

    setSelectedLanguage(e.target.value);
  };

  const { t } = useTranslation();

  const isBrowserDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(
      t("switchTheme", { theme: isDarkMode ? t("lightMode") : t("darkMode") })
    );
    document.body.classList.toggle("dark");
  };

  const handleDarkModeEffect = (browserDarkMode) => {
    if (browserDarkMode) {
      document.body.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const toasterOptions = {
    className: 'w-full max-w-xs overflow-auto break-all dark:text-white dark:bg-gray-700',
  };

  useEffect(() => {
    handleDarkModeEffect(isBrowserDarkMode);
  }, [isBrowserDarkMode]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const signOut = (e) => {
    auth.signOut();
    setCurrentUser(null);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if(user){
        document.getElementById("signout").classList.remove("invisible");
      }else{
        document.getElementById("signout").classList.add("invisible");
      }
    });
    return unsubscribe;
  }, [currentUser]);

  return (
    <I18nextProvider i18n={i18n}>
      <TaskContextProvider>
        <div>
          <header className="flex justify-end items-start pt-3">
            <LanguageSwitch
              language={userLanguage}
              handleLanguageChange={handleLanguageChange}
            />
            <DarkModeToggle
              handleDarkModeToggle={handleDarkModeToggle}
              isDarkMode={isDarkMode}
            />
            <Button id="signout" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 mr-1 rounded" label={t("signoutButton")} callback={signOut} />
          </header>
          {
            currentUser === null ? (
              <LoginForm />
            ) : (
              <main>
                <TaskList />
              </main>
            )
          }
          <Toaster
            toastOptions={toasterOptions}
          />
        </div>
      </TaskContextProvider>
    </I18nextProvider>
  )
}

export default App;
