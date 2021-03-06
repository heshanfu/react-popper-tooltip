// Type definitions for react-popper-tooltip > v2.2.1
// Project: https://github.com/mohsinulhaq/react-popper-tooltip
// Definitions by Johan Brook <https://github.com/brookback>

declare module 'react-popper-tooltip' {
  import * as React from 'react';
  import Popper from 'popper.js';

  type GetTriggerProps = (
    props?: {
      onClick?: (evt: React.SyntheticEvent) => void;
      onContextMenu?: (evt: React.SyntheticEvent) => void;
      onMouseEnter?: (evt: React.SyntheticEvent) => void;
      onMouseLeave?: (evt: React.SyntheticEvent) => void;
      [key: string]: any;
    }
  ) => {
    onClick: (evt: React.SyntheticEvent) => void;
    onContextMenu: (evt: React.SyntheticEvent) => void;
    onMouseEnter: (evt: React.SyntheticEvent) => void;
    onMouseLeave: (evt: React.SyntheticEvent) => void;
    [key: string]: any;
  };

  export default class TooltipTrigger extends React.PureComponent<Props, {}> {
    showTooltip(): void;

    hideTooltip(): void;

    toggleTooltip(): void;

    scheduleShow(): void;

    scheduleHide(): void;

    scheduleToggle(): void;

    getTriggerProps: GetTriggerProps;
  }

  interface ChildProps {
    getTriggerProps: GetTriggerProps;
    triggerRef: React.RefObject<any>;
  }

  interface TooltipProps {
    getTooltipProps: (
      props?: {
        style?: React.CSSProperties;
        onMouseLeave?: (evt: React.SyntheticEvent) => void;
        onMouseEnter?: (evt: React.SyntheticEvent) => void;
        [key: string]: any;
      }
    ) => {
      style: React.CSSProperties;
      onMouseEnter: (evt: React.SyntheticEvent) => void;
      onMouseLeave: (evt: React.SyntheticEvent) => void;
      [key: string]: any;
    };
    tooltipRef: React.RefObject<any>;
    getArrowProps: (props?: any) => {
      style: React.CSSProperties;
      [key: string]: any;
    };
    arrowRef: React.RefObject<any>;
    placement: Popper.Placement;
  }

  export interface Props {
    tooltip: (props: TooltipProps) => JSX.Element;
    children: (props: ChildProps) => JSX.Element;
    defaultTooltipShown?: boolean;
    tooltipShown?: boolean;
    delayShow?: number;
    delayHide?: number;
    trigger?: 'click' | 'hover' | 'right-click' | 'none';
    closeOnOutOfBoundaries?: boolean;
    modifiers?: Popper.Modifiers;
    placement?: Popper.Placement;
  }
}
