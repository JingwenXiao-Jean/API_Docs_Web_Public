import * as React from "react";
import { navigate } from "gatsby";
import { IsAuthed } from "../../utilities/general";
import { isWeb } from "../../utilities/platform";
import useStores from "../../hooks/use-stores";


const RouteGuard = ({ children }: { children: any; }) => {
  return (
    <>
      {
        !IsAuthed() && isWeb
          // If not authenticated, go login page.
          // use navigate to the target page and render page element using the component
          ? <>{navigate("/")}</>
          : <>{children}</>
      }
    </>
  );
};

export default RouteGuard;
