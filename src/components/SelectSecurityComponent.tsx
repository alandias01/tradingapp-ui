import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { SecurityMasterService, ISecurityMasterService } from '../services/SecurityMasterService';
import { useSelectedSecurityContext } from '../Context/SelectedSecurityContext';

export function SelectSecurityComponent() {

  const { selectedSecurity, setSelectedSecurity } = useSelectedSecurityContext();

  const handleChange = (e: any) => setSelectedSecurity(e.target.value as ISecurityMasterService);

  return (
    <div>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        <InputLabel >Symbol</InputLabel>
        <Select label="Symbol" variant="outlined" value={selectedSecurity} onChange={handleChange} >
          {SecurityMasterService.map(security => (<MenuItem key={security.SYMBOL} value={security as any}> {security.SYMBOL}  </MenuItem>))}
        </Select>
      </FormControl>
    </div>
  );
}
