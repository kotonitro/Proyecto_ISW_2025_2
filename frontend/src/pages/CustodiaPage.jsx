import React, { useState } from "react";
import CustodiaList from "../components/CustodiaList";
import CustodiaForm from "../components/CustodiaForm";

export default function CustodiaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  function onSuccess() {
    // trigger reload in list by re-mounting
    setRefreshKey(k => k + 1);
  }

  return (
    <div>
      <h2>Custodia</h2>
      <div style={{display:'flex',gap:24}}>
        <div style={{flex:1}}>
          <CustodiaForm onSuccess={onSuccess} />
        </div>
        <div style={{flex:1}} key={refreshKey}>
          <CustodiaList />
        </div>
      </div>
    </div>
  );
}
