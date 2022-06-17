import {useContext} from "react";
import SettingsContext from "./SettingsContext"

function Settings() {
  useContext(SettingsContext);
  // return(
  //   <div style={{textAlign:'left'}}>
  //     <div style={{textAlign:'center', marginTop:'20px'}}>
  //       <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
  //     </div>

  //   </div>
  // );
}

export default Settings;