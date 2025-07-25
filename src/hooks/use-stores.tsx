import { useContext } from 'react';
import { StoreContext, stores as rawStores } from '../stores/store-context'; // observableStores

const useStores = () => {
  let stores: typeof rawStores;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stores = useContext(StoreContext);
  } catch {
    // return rawStores for non-hook components / server side
    stores = rawStores;
  }
  if (!stores) {
    throw new Error('The stores have not been initialized.');
  }
  return stores;
};

export default useStores;
