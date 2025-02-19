import { FlexWrapper, toast } from '@affine/component';
import { SettingRow } from '@affine/component/setting-components';
import { Button } from '@affine/component/ui/button';
import { Tooltip } from '@affine/component/ui/tooltip';
import { apis, events } from '@affine/electron-api';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import type { WorkspaceMetadata } from '@toeverything/infra';
import { useMemo } from 'react';
import { useCallback, useEffect, useState } from 'react';

const useDBFileSecondaryPath = (workspaceId: string) => {
  const [path, setPath] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (apis && events && environment.isDesktop) {
      apis?.workspace
        .getMeta(workspaceId)
        .then(meta => {
          setPath(meta.secondaryDBPath);
        })
        .catch(err => {
          console.error(err);
        });
      return events.workspace.onMetaChange((newMeta: any) => {
        if (newMeta.workspaceId === workspaceId) {
          const meta = newMeta.meta;
          setPath(meta.secondaryDBPath);
        }
      });
    }
    return;
  }, [workspaceId]);
  return path;
};

interface StoragePanelProps {
  workspaceMetadata: WorkspaceMetadata;
}

export const StoragePanel = ({ workspaceMetadata }: StoragePanelProps) => {
  const workspaceId = workspaceMetadata.id;
  const t = useAFFiNEI18N();
  const secondaryPath = useDBFileSecondaryPath(workspaceId);

  const [moveToInProgress, setMoveToInProgress] = useState<boolean>(false);
  const onRevealDBFile = useCallback(() => {
    apis?.dialog.revealDBFile(workspaceId).catch(err => {
      console.error(err);
    });
  }, [workspaceId]);

  const handleMoveTo = useCallback(() => {
    if (moveToInProgress) {
      return;
    }
    setMoveToInProgress(true);
    apis?.dialog
      .moveDBFile(workspaceId)
      .then(result => {
        if (!result?.error && !result?.canceled) {
          toast(t['Move folder success']());
        } else if (result?.error) {
          toast(t[result.error]());
        }
      })
      .catch(() => {
        toast(t['UNKNOWN_ERROR']());
      })
      .finally(() => {
        setMoveToInProgress(false);
      });
  }, [moveToInProgress, t, workspaceId]);

  const rowContent = useMemo(
    () =>
      secondaryPath ? (
        <FlexWrapper justifyContent="space-between">
          <Tooltip
            content={t['com.affine.settings.storage.db-location.change-hint']()}
            side="top"
            align="start"
          >
            <Button
              data-testid="move-folder"
              // className={style.urlButton}
              size="large"
              onClick={handleMoveTo}
            >
              {secondaryPath}
            </Button>
          </Tooltip>
          <Button
            data-testid="reveal-folder"
            data-disabled={moveToInProgress}
            onClick={onRevealDBFile}
          >
            {t['Open folder']()}
          </Button>
        </FlexWrapper>
      ) : (
        <Button
          data-testid="move-folder"
          data-disabled={moveToInProgress}
          onClick={handleMoveTo}
        >
          {t['Move folder']()}
        </Button>
      ),
    [handleMoveTo, moveToInProgress, onRevealDBFile, secondaryPath, t]
  );

  return (
    <SettingRow
      name={t['Storage']()}
      desc={t[
        secondaryPath
          ? 'com.affine.settings.storage.description-alt'
          : 'com.affine.settings.storage.description'
      ]()}
      spreadCol={!secondaryPath}
    >
      {rowContent}
    </SettingRow>
  );
};
