import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';
export const workspaceListsWrapper = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 300px)',
});
export const workspaceListWrapper = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '4px',
});
export const workspaceType = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px 12px',
  fontSize: cssVar('fontXs'),
  lineHeight: '20px',
  color: cssVar('textSecondaryColor'),
});
export const scrollbar = style({
  transform: 'translateX(8px)',
  width: '4px',
});
