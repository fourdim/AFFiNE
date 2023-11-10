import { useAtomValue } from 'jotai';
import { type ReactElement, useEffect, useState } from 'react';

import { Loading } from '../../ui/loading';
import * as styles from './index.css';
import { globalLoadingEventsAtom } from './index.jotai';

export {
  type GlobalLoadingEvent,
  pushGlobalLoadingEventAtom,
  resolveGlobalLoadingEventAtom,
} from './index.jotai';

export function GlobalLoading(): ReactElement {
  const globalLoadingEvents = useAtomValue(globalLoadingEventsAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (globalLoadingEvents.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [globalLoadingEvents]);

  if (!globalLoadingEvents.length) {
    return <></>;
  }
  return (
    <div className={styles.globalLoadingWrapperStyle} data-loading={loading}>
      <Loading size={20} />
    </div>
  );
}
