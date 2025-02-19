import type { InlineEditHandle } from '@affine/component';
import { appSidebarFloatingAtom } from '@affine/component/app-sidebar';
import { FavoriteButton } from '@affine/core/components/blocksuite/block-suite-header/favorite';
import { JournalWeekDatePicker } from '@affine/core/components/blocksuite/block-suite-header/journal/date-picker';
import { JournalTodayButton } from '@affine/core/components/blocksuite/block-suite-header/journal/today-button';
import { PageHeaderMenuButton } from '@affine/core/components/blocksuite/block-suite-header/menu';
import { EditorModeSwitch } from '@affine/core/components/blocksuite/block-suite-mode-switch';
import { useJournalInfoHelper } from '@affine/core/hooks/use-journal';
import type { Doc } from '@blocksuite/store';
import type { Workspace } from '@toeverything/infra';
import { useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';

import { SharePageButton } from '../../../components/affine/share-page-modal';
import { BlocksuiteHeaderTitle } from '../../../components/blocksuite/block-suite-header/title/index';
import { HeaderDivider } from '../../../components/pure/header';
import * as styles from './detail-page-header.css';

function Header({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const appSidebarFloating = useAtomValue(appSidebarFloatingAtom);
  return (
    <div
      data-testid="header"
      style={style}
      className={className}
      data-sidebar-floating={appSidebarFloating}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  page: Doc;
  workspace: Workspace;
}
export function JournalPageHeader({ page, workspace }: PageHeaderProps) {
  return (
    <Header className={styles.header}>
      <EditorModeSwitch
        blockSuiteWorkspace={workspace.blockSuiteWorkspace}
        pageId={page?.id}
      />
      <div className={styles.journalWeekPicker}>
        <JournalWeekDatePicker
          workspace={workspace.blockSuiteWorkspace}
          page={page}
        />
      </div>
      <JournalTodayButton workspace={workspace.blockSuiteWorkspace} />
      <HeaderDivider />
      <PageHeaderMenuButton isJournal pageId={page?.id} />
      {page ? (
        <SharePageButton isJournal workspace={workspace} page={page} />
      ) : null}
    </Header>
  );
}

export function NormalPageHeader({ page, workspace }: PageHeaderProps) {
  const titleInputHandleRef = useRef<InlineEditHandle>(null);

  const onRename = useCallback(() => {
    setTimeout(() => titleInputHandleRef.current?.triggerEdit());
  }, []);
  return (
    <Header className={styles.header}>
      <EditorModeSwitch
        blockSuiteWorkspace={workspace.blockSuiteWorkspace}
        pageId={page?.id}
      />
      <BlocksuiteHeaderTitle
        inputHandleRef={titleInputHandleRef}
        pageId={page?.id}
        blockSuiteWorkspace={workspace.blockSuiteWorkspace}
      />
      <PageHeaderMenuButton rename={onRename} pageId={page?.id} />
      <FavoriteButton pageId={page?.id} />
      <div className={styles.spacer} />
      {page ? <SharePageButton workspace={workspace} page={page} /> : null}
    </Header>
  );
}

export function DetailPageHeader(props: PageHeaderProps) {
  const { page } = props;
  const { isJournal } = useJournalInfoHelper(page.workspace, page.id);
  const isInTrash = page.meta?.trash;

  return isJournal && !isInTrash ? (
    <JournalPageHeader {...props} />
  ) : (
    <NormalPageHeader {...props} />
  );
}
