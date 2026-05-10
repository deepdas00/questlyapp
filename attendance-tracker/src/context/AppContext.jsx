import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

//attendance page
const [attendance, setAttendance] = useState([]);
const [subjects, setSubjects] = useState([]);
const [routine, setRoutine] = useState([]);
const [semester, setSemester] = useState(null);


//taskify pages
const [tasks, setTasks] = useState(null);

  return (
    <AppContext.Provider
      value={{
        attendance,
        setAttendance,
        subjects,
        setSubjects,
        routine,
        setRoutine,
        semester,
        setSemester,


        tasks,
        setTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);