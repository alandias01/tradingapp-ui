import React, { useState, useContext, createContext } from "react";
import { ISecurityMasterService, SecurityMasterService } from '../services/SecurityMasterService';

const SelectedSecurityContextDefaultValue = {
  selectedSecurity: SecurityMasterService[0],
  setSelectedSecurity: (selectedSecurity: ISecurityMasterService) => { },
};
const SelectedSecurityContext = createContext(
  SelectedSecurityContextDefaultValue
);

export function useSelectedSecurityContext() {
  return useContext(SelectedSecurityContext);
}

export const SelectedSecurityProvider: React.FC<{}> = ({ children }) => {
  const [selectedSecurity, setSelectedSecurity] = useState<ISecurityMasterService>(SelectedSecurityContextDefaultValue.selectedSecurity)
  return (
    <div>
      <SelectedSecurityContext.Provider value={{ selectedSecurity, setSelectedSecurity }}>
        {children}
      </SelectedSecurityContext.Provider>
    </div>);
}
