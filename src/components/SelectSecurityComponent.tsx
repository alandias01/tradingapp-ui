import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { SecurityMasterService, ISecurityMasterService } from '../services/SecurityMasterService';


export function SelectSecurityComponent() {

  const [selectedSecurity, setSelectedSecurity] = useState<ISecurityMasterService>(SecurityMasterService[0]);

  return (
    <div>
      <Select variant="outlined" value={selectedSecurity} onChange={(e) => setSelectedSecurity(e.target.value as ISecurityMasterService)} style={{ width: "100%" }}>
        {SecurityMasterService.map(security => <MenuItem key={security.SYMBOL} value={security.SYMBOL}> {security.SYMBOL}  </MenuItem>)}
      </Select>
    </div>
  );
}
