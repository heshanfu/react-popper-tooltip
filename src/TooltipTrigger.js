/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import Tooltip from './Tooltip';
import { callAll } from './utils';

const DEFAULT_MODIFIERS = {
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 0
  }
};

export const TooltipContext = React.createContext({});

export default class TooltipTrigger extends PureComponent {
  static propTypes = {
    /**
     * trigger
     */
    children: T.func.isRequired,
    /**
     * tooltip
     */
    tooltip: T.func.isRequired,
    /**
     * whether tooltip is shown by default
     */
    defaultTooltipShown: T.bool,
    /**
     * use to create controlled tooltip
     */
    tooltipShown: T.bool,
    /**
     * delay in showing the tooltip
     */
    delayShow: T.number,
    /**
     * delay in hiding the tooltip
     */
    delayHide: T.number,
    /**
     * Popper’s placement. Valid placements are:
     *  - auto
     *  - top
     *  - right
     *  - bottom
     *  - left
     * Each placement can have a variation from this list:
     *  -start
     *  -end
     */
    placement: T.string,
    /**
     * the event that triggers the tooltip
     */
    trigger: T.oneOf(['click', 'hover', 'right-click', 'none']),
    /**
     * whether to close the tooltip when it's trigger is out of the boundary
     */
    closeOnOutOfBoundaries: T.bool,
    /**
     * modifiers passed directly to the underlying popper.js instance
     * For more information, refer to Popper.js’ modifier docs:
     * @link https://popper.js.org/popper-documentation.html#modifiers
     */
    modifiers: T.object
  };

  static defaultProps = {
    delayShow: 0,
    delayHide: 0,
    defaultTooltipShown: false,
    placement: 'right',
    trigger: 'hover',
    closeOnOutOfBoundaries: true
  };

  state = {
    tooltipShown: this.props.defaultTooltipShown
  };

  _clearScheduled = () => {
    clearTimeout(this._hideTimeout);
    clearTimeout(this._showTimeout);
  };

  _showTooltip = (delay = this.props.delayShow) => {
    this._clearScheduled();

    this._showTimeout = setTimeout(
      () => this.setState({ tooltipShown: true }),
      delay
    );
  };

  _hideTooltip = (delay = this.props.delayHide) => {
    this._clearScheduled();

    this._hideTimeout = setTimeout(
      () => this.setState({ tooltipShown: false }),
      delay
    );
  };

  _toggleTooltip = delay => {
    const action = this.state.tooltipShown ? '_hideTooltip' : '_showTooltip';
    this[action](delay);
  };

  _contextMenuToggle = event => {
    event.preventDefault();
    this._toggleTooltip();
  };

  static getDerivedStateFromProps(props) {
    const { tooltipShown } = props;
    return tooltipShown != null ? { tooltipShown } : null;
  }

  componentWillUnmount() {
    this._clearScheduled();
  }

  getTriggerProps = (props = {}) => {
    const isClickTriggered = this.props.trigger === 'click';
    const isHoverTriggered = this.props.trigger === 'hover';
    const isRightClickTriggered = this.props.trigger === 'right-click';

    return {
      ...props,
      onClick: callAll(isClickTriggered && this._toggleTooltip, props.onClick),
      onContextMenu: callAll(
        isRightClickTriggered && this._contextMenuToggle,
        props.onContextMenu
      ),
      onMouseEnter: callAll(
        isHoverTriggered && this._showTooltip,
        props.onMouseEnter
      ),
      onMouseLeave: callAll(
        isHoverTriggered && this._hideTooltip,
        props.onMouseLeave
      )
    };
  };

  render() {
    const {
      children,
      tooltip,
      placement,
      trigger,
      modifiers,
      closeOnOutOfBoundaries
    } = this.props;

    return (
      <Manager>
        <Reference>
          {({ ref }) =>
            children({ getTriggerProps: this.getTriggerProps, triggerRef: ref })
          }
        </Reference>
        {this.state.tooltipShown &&
          createPortal(
            <Popper
              placement={placement}
              modifiers={{ ...DEFAULT_MODIFIERS, ...modifiers }}
            >
              {({
                ref,
                style,
                placement,
                arrowProps,
                outOfBoundaries,
                scheduleUpdate
              }) => (
                <TooltipContext.Consumer>
                  {({
                    addParentOutsideClickHandler,
                    removeParentOutsideClickHandler,
                    parentOutsideClickHandler
                  }) => (
                    <Tooltip
                      {...{
                        style,
                        arrowProps,
                        placement,
                        trigger,
                        closeOnOutOfBoundaries,
                        tooltip,
                        addParentOutsideClickHandler,
                        removeParentOutsideClickHandler,
                        parentOutsideClickHandler,
                        outOfBoundaries,
                        scheduleUpdate
                      }}
                      innerRef={ref}
                      hideTooltip={this._hideTooltip}
                      clearScheduled={this._clearScheduled}
                    />
                  )}
                </TooltipContext.Consumer>
              )}
            </Popper>,
            document.body
          )}
      </Manager>
    );
  }
}
