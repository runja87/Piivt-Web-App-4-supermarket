import './Menu.sass';
import AuthStore from "../../stores/AuthStore";
import { useState } from "react";
import { UserMenu } from "./UserMenu";
import { AdministratorMenu } from "./AdministratorMenu";


export default function Menu() {
  const [role, setRole] = useState<"user" | "administrator">(AuthStore.getState().role);

  AuthStore.subscribe(()=>{
    setRole(AuthStore.getState().role);
  });
  return (
    <>
      {role === "user" && <UserMenu />}
      {role === "administrator" && <AdministratorMenu />}
    
    </>

  );
}
