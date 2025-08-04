import React, { createContext, useContext, useState } from 'react';

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  const applyToJob = (jobId, applicationData) => {
    setAppliedJobs(prev => [...prev, { jobId, ...applicationData }]);
  };

  const hasApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId);
  };

  return (
    <ApplicationsContext.Provider value={{ appliedJobs, applyToJob, hasApplied }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationsContext);
