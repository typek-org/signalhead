// Type definitions based on JSX React 18 typings and Svelte project typings.
// source: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
// source: https://github.com/sveltejs/svelte/blob/master/packages/svelte/elements.d.ts
//
// Original Project/Authors:
// Type definitions for React 18.2
// Project: https://react.dev/
// Definitions by: Asana <https://asana.com>
//                 AssureSign <http://www.assuresign.com>
//                 Microsoft <https://microsoft.com>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Benoit Benezech <https://github.com/bbenezech>
//                 Patricio Zavolinsky <https://github.com/pzavolinsky>
//                 Eric Anderson <https://github.com/ericanderson>
//                 Dovydas Navickas <https://github.com/DovydasNavickas>
//                 Josh Rutherford <https://github.com/theruther4d>
//                 Guilherme Hübner <https://github.com/guilhermehubner>
//                 Ferdy Budhidharma <https://github.com/ferdaber>
//                 Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
//                 Olivier Pascal <https://github.com/pascaloliv>
//                 Martin Hochel <https://github.com/hotell>
//                 Frank Li <https://github.com/franklixuefei>
//                 Jessica Franco <https://github.com/Jessidhia>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Kyle Scully <https://github.com/zieka>
//                 Cong Zhang <https://github.com/dancerphil>
//                 Dimitri Mitropoulos <https://github.com/dimitropoulos>
//                 JongChan Choi <https://github.com/disjukr>
//                 Victor Magalhães <https://github.com/vhfmag>
//                 Dale Tan <https://github.com/hellatan>
//                 Priyanshu Rav <https://github.com/priyanshurav>
//                 Dmitry Semigradsky <https://github.com/Semigradsky>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import type { MinimalSignal, WriteonlySignal, MinimalWritableSignal } from "../signals";

export type InProp<T> = MinimalSignal<T> | T;
export type OutProp<T> = WriteonlySignal<T>;
export type InOutProp<T> = MinimalWritableSignal<T>;

type Booleanish = boolean | 'true' | 'false';

//
// Event Handler Types
// ----------------------------------------------------------------------

type EventSignal<
	E extends Event = Event,
	T extends EventTarget = Element,
> = WriteonlySignal<E & { currentTarget: EventTarget & T }>;

export type ClipboardEventSignal<T extends EventTarget> = EventSignal<ClipboardEvent, T>;
export type CompositionEventSignal<T extends EventTarget> = EventSignal<CompositionEvent, T>;
export type DragEventSignal<T extends EventTarget> = EventSignal<DragEvent, T>;
export type FocusEventSignal<T extends EventTarget> = EventSignal<FocusEvent, T>;
export type FormEventSignal<T extends EventTarget> = EventSignal<Event, T>;
export type ChangeEventSignal<T extends EventTarget> = EventSignal<Event, T>;
export type KeyboardEventSignal<T extends EventTarget> = EventSignal<KeyboardEvent, T>;
export type MouseEventSignal<T extends EventTarget> = EventSignal<MouseEvent, T>;
export type TouchEventSignal<T extends EventTarget> = EventSignal<TouchEvent, T>;
export type PointerEventSignal<T extends EventTarget> = EventSignal<PointerEvent, T>;
export type UIEventSignal<T extends EventTarget> = EventSignal<UIEvent, T>;
export type WheelEventSignal<T extends EventTarget> = EventSignal<WheelEvent, T>;
export type AnimationEventSignal<T extends EventTarget> = EventSignal<AnimationEvent, T>;
export type TransitionEventSignal<T extends EventTarget> = EventSignal<TransitionEvent, T>;
export type MessageEventSignal<T extends EventTarget> = EventSignal<MessageEvent, T>;

//
// DOM Attributes
// ----------------------------------------------------------------------

export interface DomAttributes<T extends EventTarget> {
	// Mod Attributes
	self?: WriteonlySignal<T>;

	// Clipboard Events
	onCopy?: ClipboardEventSignal<T> | undefined;
	onCopyCapture?: ClipboardEventSignal<T> | undefined;
	onCut?: ClipboardEventSignal<T> | undefined;
	onCutCapture?: ClipboardEventSignal<T> | undefined;
	onPaste?: ClipboardEventSignal<T> | undefined;
	onPasteCapture?: ClipboardEventSignal<T> | undefined;

	// Composition Events
	onCompositionEnd?: CompositionEventSignal<T> | undefined;
	onCompositionEndCapture?: CompositionEventSignal<T> | undefined;
	onCompositionStart?: CompositionEventSignal<T> | undefined;
	onCompositionStartCapture?: CompositionEventSignal<T> | undefined;
	onCompositionUpdate?: CompositionEventSignal<T> | undefined;
	onCompositionUpdateCapture?: CompositionEventSignal<T> | undefined;

	// Focus Events
	onFocus?: FocusEventSignal<T> | undefined;
	onFocusCapture?: FocusEventSignal<T> | undefined;
	onBlur?: FocusEventSignal<T> | undefined;
	onBlurCapture?: FocusEventSignal<T> | undefined;

	// Form Events
	onChange?: FormEventSignal<T> | undefined;
	onChangeCapture?: FormEventSignal<T> | undefined;
	onBeforeInput?: FormEventSignal<T> | undefined;
	onBeforeInputCapture?: FormEventSignal<T> | undefined;
	onInput?: FormEventSignal<T> | undefined;
	onInputCapture?: FormEventSignal<T> | undefined;
	onReset?: FormEventSignal<T> | undefined;
	onResetCapture?: FormEventSignal<T> | undefined;
	onSubmit?: FormEventSignal<T> | undefined;
	onSubmitCapture?: FormEventSignal<T> | undefined;
	onInvalid?: FormEventSignal<T> | undefined;
	onInvalidCapture?: FormEventSignal<T> | undefined;

	// Image Events
	onLoad?: EventSignal<Event, T> | undefined;
	onLoadCapture?: EventSignal<Event, T> | undefined;
	onError?: EventSignal<Event, T> | undefined; // also a Media Event
	onErrorCapture?: EventSignal<Event, T> | undefined; // also a Media Event

	// Keyboard Events
	onKeyDown?: KeyboardEventSignal<T> | undefined;
	onKeyDownCapture?: KeyboardEventSignal<T> | undefined;
	/** @deprecated */
	onKeyPress?: KeyboardEventSignal<T> | undefined;
	/** @deprecated */
	onKeyPressCapture?: KeyboardEventSignal<T> | undefined;
	onKeyUp?: KeyboardEventSignal<T> | undefined;
	onKeyUpCapture?: KeyboardEventSignal<T> | undefined;

	// Media Events
	onAbort?: EventSignal<Event, T> | undefined;
	onAbortCapture?: EventSignal<Event, T> | undefined;
	onCanPlay?: EventSignal<Event, T> | undefined;
	onCanPlayCapture?: EventSignal<Event, T> | undefined;
	onCanPlayThrough?: EventSignal<Event, T> | undefined;
	onCanPlayThroughCapture?: EventSignal<Event, T> | undefined;
	onDurationChange?: EventSignal<Event, T> | undefined;
	onDurationChangeCapture?: EventSignal<Event, T> | undefined;
	onEmptied?: EventSignal<Event, T> | undefined;
	onEmptiedCapture?: EventSignal<Event, T> | undefined;
	onEncrypted?: EventSignal<Event, T> | undefined;
	onEncryptedCapture?: EventSignal<Event, T> | undefined;
	onEnded?: EventSignal<Event, T> | undefined;
	onEndedCapture?: EventSignal<Event, T> | undefined;
	onLoadedData?: EventSignal<Event, T> | undefined;
	onLoadedDataCapture?: EventSignal<Event, T> | undefined;
	onLoadedMetadata?: EventSignal<Event, T> | undefined;
	onLoadedMetadataCapture?: EventSignal<Event, T> | undefined;
	onLoadStart?: EventSignal<Event, T> | undefined;
	onLoadStartCapture?: EventSignal<Event, T> | undefined;
	onPause?: EventSignal<Event, T> | undefined;
	onPauseCapture?: EventSignal<Event, T> | undefined;
	onPlay?: EventSignal<Event, T> | undefined;
	onPlayCapture?: EventSignal<Event, T> | undefined;
	onPlaying?: EventSignal<Event, T> | undefined;
	onPlayingCapture?: EventSignal<Event, T> | undefined;
	onProgress?: EventSignal<Event, T> | undefined;
	onProgressCapture?: EventSignal<Event, T> | undefined;
	onRateChange?: EventSignal<Event, T> | undefined;
	onRateChangeCapture?: EventSignal<Event, T> | undefined;
	onResize?: EventSignal<Event, T> | undefined;
	onResizeCapture?: EventSignal<Event, T> | undefined;
	onSeeked?: EventSignal<Event, T> | undefined;
	onSeekedCapture?: EventSignal<Event, T> | undefined;
	onSeeking?: EventSignal<Event, T> | undefined;
	onSeekingCapture?: EventSignal<Event, T> | undefined;
	onStalled?: EventSignal<Event, T> | undefined;
	onStalledCapture?: EventSignal<Event, T> | undefined;
	onSuspend?: EventSignal<Event, T> | undefined;
	onSuspendCapture?: EventSignal<Event, T> | undefined;
	onTimeUpdate?: EventSignal<Event, T> | undefined;
	onTimeUpdateCapture?: EventSignal<Event, T> | undefined;
	onVolumeChange?: EventSignal<Event, T> | undefined;
	onVolumeChangeCapture?: EventSignal<Event, T> | undefined;
	onWaiting?: EventSignal<Event, T> | undefined;
	onWaitingCapture?: EventSignal<Event, T> | undefined;

	// MouseEvents
	onAuxClick?: MouseEventSignal<T> | undefined;
	onAuxClickCapture?: MouseEventSignal<T> | undefined;
	onClick?: MouseEventSignal<T> | undefined;
	onClickCapture?: MouseEventSignal<T> | undefined;
	onContextMenu?: MouseEventSignal<T> | undefined;
	onContextMenuCapture?: MouseEventSignal<T> | undefined;
	onDoubleClick?: MouseEventSignal<T> | undefined;
	onDoubleClickCapture?: MouseEventSignal<T> | undefined;
	onDrag?: DragEventSignal<T> | undefined;
	onDragCapture?: DragEventSignal<T> | undefined;
	onDragEnd?: DragEventSignal<T> | undefined;
	onDragEndCapture?: DragEventSignal<T> | undefined;
	onDragEnter?: DragEventSignal<T> | undefined;
	onDragEnterCapture?: DragEventSignal<T> | undefined;
	onDragExit?: DragEventSignal<T> | undefined;
	onDragExitCapture?: DragEventSignal<T> | undefined;
	onDragLeave?: DragEventSignal<T> | undefined;
	onDragLeaveCapture?: DragEventSignal<T> | undefined;
	onDragOver?: DragEventSignal<T> | undefined;
	onDragOverCapture?: DragEventSignal<T> | undefined;
	onDragStart?: DragEventSignal<T> | undefined;
	onDragStartCapture?: DragEventSignal<T> | undefined;
	onDrop?: DragEventSignal<T> | undefined;
	onDropCapture?: DragEventSignal<T> | undefined;
	onMouseDown?: MouseEventSignal<T> | undefined;
	onMouseDownCapture?: MouseEventSignal<T> | undefined;
	onMouseEnter?: MouseEventSignal<T> | undefined;
	onMouseLeave?: MouseEventSignal<T> | undefined;
	onMouseMove?: MouseEventSignal<T> | undefined;
	onMouseMoveCapture?: MouseEventSignal<T> | undefined;
	onMouseOut?: MouseEventSignal<T> | undefined;
	onMouseOutCapture?: MouseEventSignal<T> | undefined;
	onMouseOver?: MouseEventSignal<T> | undefined;
	onMouseOverCapture?: MouseEventSignal<T> | undefined;
	onMouseUp?: MouseEventSignal<T> | undefined;
	onMouseUpCapture?: MouseEventSignal<T> | undefined;

	// Selection Events
	onSelect?: EventSignal<Event, T> | undefined;
	onSelectCapture?: EventSignal<Event, T> | undefined;

	// Touch Events
	onTouchCancel?: TouchEventSignal<T> | undefined;
	onTouchCancelCapture?: TouchEventSignal<T> | undefined;
	onTouchEnd?: TouchEventSignal<T> | undefined;
	onTouchEndCapture?: TouchEventSignal<T> | undefined;
	onTouchMove?: TouchEventSignal<T> | undefined;
	onTouchMoveCapture?: TouchEventSignal<T> | undefined;
	onTouchStart?: TouchEventSignal<T> | undefined;
	onTouchStartCapture?: TouchEventSignal<T> | undefined;

	// Pointer Events
	onPointerDown?: PointerEventSignal<T> | undefined;
	onPointerDownCapture?: PointerEventSignal<T> | undefined;
	onPointerMove?: PointerEventSignal<T> | undefined;
	onPointerMoveCapture?: PointerEventSignal<T> | undefined;
	onPointerUp?: PointerEventSignal<T> | undefined;
	onPointerUpCapture?: PointerEventSignal<T> | undefined;
	onPointerCancel?: PointerEventSignal<T> | undefined;
	onPointerCancelCapture?: PointerEventSignal<T> | undefined;
	onPointerEnter?: PointerEventSignal<T> | undefined;
	onPointerEnterCapture?: PointerEventSignal<T> | undefined;
	onPointerLeave?: PointerEventSignal<T> | undefined;
	onPointerLeaveCapture?: PointerEventSignal<T> | undefined;
	onPointerOver?: PointerEventSignal<T> | undefined;
	onPointerOverCapture?: PointerEventSignal<T> | undefined;
	onPointerOut?: PointerEventSignal<T> | undefined;
	onPointerOutCapture?: PointerEventSignal<T> | undefined;
	onGotPointerCapture?: PointerEventSignal<T> | undefined;
	onGotPointerCaptureCapture?: PointerEventSignal<T> | undefined;
	onLostPointerCapture?: PointerEventSignal<T> | undefined;
	onLostPointerCaptureCapture?: PointerEventSignal<T> | undefined;

	// UI Events
	onScroll?: UIEventSignal<T> | undefined;
	onScrollCapture?: UIEventSignal<T> | undefined;

	// Wheel Events
	onWheel?: WheelEventSignal<T> | undefined;
	onWheelCapture?: WheelEventSignal<T> | undefined;

	// Animation Events
	onAnimationStart?: AnimationEventSignal<T> | undefined;
	onAnimationStartCapture?: AnimationEventSignal<T> | undefined;
	onAnimationEnd?: AnimationEventSignal<T> | undefined;
	onAnimationEndCapture?: AnimationEventSignal<T> | undefined;
	onAnimationIteration?: AnimationEventSignal<T> | undefined;
	onAnimationIterationCapture?: AnimationEventSignal<T> | undefined;

	// Transition Events
	onTransitionEnd?: TransitionEventSignal<T> | undefined;
	onTransitionEndCapture?: TransitionEventSignal<T> | undefined;
}


export interface StandardHtmlAttributes {
	accessKey?: string | undefined;
	autoFocus?: boolean | undefined;
	class?: string | undefined;
	contentEditable?: Booleanish | "inherit" | undefined;
	contextMenu?: string | undefined;
	dir?: string | undefined;
	draggable?: Booleanish | undefined;
	enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
	hidden?: boolean | undefined;
	id?: string | undefined;
	lang?: string | undefined;
	part?: string | undefined;
	nonce?: string | undefined;
	placeholder?: string | undefined;
	slot?: string | undefined;
	spellCheck?: Booleanish | undefined;
	style?: string | undefined;
	tabIndex?: number | undefined;
	title?: string | undefined;
	translate?: 'yes' | 'no' | undefined;
	inert?: boolean | undefined;

	// WAI-ARIA
	role?: AriaRole | undefined;
}

export interface LivingStandardHtmlAttributes {
	/**
	 * Hints at the type of data that might be entered by the user while editing the element or its contents
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
	 */
	inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
	/**
	 * Specify that a standard HTML element should behave like a defined custom built-in element
	 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
	 */
	is?: string | undefined;
}

export interface NonStandardHtmlAttributes {
	// Non-standard Attributes
	autoCapitalize?: string | undefined;
	autoCorrect?: string | undefined;
	autoSave?: string | undefined;
	color?: string | undefined;
	itemProp?: string | undefined;
	itemScope?: boolean | undefined;
	itemType?: string | undefined;
	itemId?: string | undefined;
	itemRef?: string | undefined;
	results?: number | undefined;
	security?: string | undefined;
	unselectable?: 'on' | 'off' | undefined;
}

export interface AriaAttributes {
	/** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
	'aria-activedescendant'?: string | undefined;
	/** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
	'aria-atomic'?: Booleanish | undefined;
	/**
	 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
	 * presented if they are made.
	 */
	'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
	/** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
	/**
	 * Defines a string value that labels the current element, which is intended to be converted into Braille.
	 * @see aria-label.
	 */
	'aria-braillelabel'?: string | undefined;
	/**
	 * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
	 * @see aria-roledescription.
	 */
	'aria-brailleroledescription'?: string | undefined;
	'aria-busy'?: Booleanish | undefined;
	/**
	 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
	 * @see aria-pressed @see aria-selected.
	 */
	'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
	/**
	 * Defines the total number of columns in a table, grid, or treegrid.
	 * @see aria-colindex.
	 */
	'aria-colcount'?: number | undefined;
	/**
	 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
	 * @see aria-colcount @see aria-colspan.
	 */
	'aria-colindex'?: number | undefined;
	/**
	 * Defines a human readable text alternative of aria-colindex.
	 * @see aria-rowindextext.
	 */
	'aria-colindextext'?: string | undefined;
	/**
	 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-colindex @see aria-rowspan.
	 */
	'aria-colspan'?: number | undefined;
	/**
	 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
	 * @see aria-owns.
	 */
	'aria-controls'?: string | undefined;
	/** Indicates the element that represents the current item within a container or set of related elements. */
	'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
	/**
	 * Identifies the element (or elements) that describes the object.
	 * @see aria-labelledby
	 */
	'aria-describedby'?: string | undefined;
	/**
	 * Defines a string value that describes or annotates the current element.
	 * @see related aria-describedby.
	 */
	'aria-description'?: string | undefined;
	/**
	 * Identifies the element that provides a detailed, extended description for the object.
	 * @see aria-describedby.
	 */
	'aria-details'?: string | undefined;
	/**
	 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
	 * @see aria-hidden @see aria-readonly.
	 */
	'aria-disabled'?: Booleanish | undefined;
	/**
	 * Indicates what functions can be performed when a dragged object is released on the drop target.
	 * @deprecated in ARIA 1.1
	 */
	'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
	/**
	 * Identifies the element that provides an error message for the object.
	 * @see aria-invalid @see aria-describedby.
	 */
	'aria-errormessage'?: string | undefined;
	/** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
	'aria-expanded'?: Booleanish | undefined;
	/**
	 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
	 * allows assistive technology to override the general default of reading in document source order.
	 */
	'aria-flowto'?: string | undefined;
	/**
	 * Indicates an element's "grabbed" state in a drag-and-drop operation.
	 * @deprecated in ARIA 1.1
	 */
	'aria-grabbed'?: Booleanish | undefined;
	/** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
	'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
	/**
	 * Indicates whether the element is exposed to an accessibility API.
	 * @see aria-disabled.
	 */
	'aria-hidden'?: Booleanish | undefined;
	/**
	 * Indicates the entered value does not conform to the format expected by the application.
	 * @see aria-errormessage.
	 */
	'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
	/** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
	'aria-keyshortcuts'?: string | undefined;
	/**
	 * Defines a string value that labels the current element.
	 * @see aria-labelledby.
	 */
	'aria-label'?: string | undefined;
	/**
	 * Identifies the element (or elements) that labels the current element.
	 * @see aria-describedby.
	 */
	'aria-labelledby'?: string | undefined;
	/** Defines the hierarchical level of an element within a structure. */
	'aria-level'?: number | undefined;
	/** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
	'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
	/** Indicates whether an element is modal when displayed. */
	'aria-modal'?: Booleanish | undefined;
	/** Indicates whether a text box accepts multiple lines of input or only a single line. */
	'aria-multiline'?: Booleanish | undefined;
	/** Indicates that the user may select more than one item from the current selectable descendants. */
	'aria-multiselectable'?: Booleanish | undefined;
	/** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
	'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
	/**
	 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
	 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
	 * @see aria-controls.
	 */
	'aria-owns'?: string | undefined;
	/**
	 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
	 * A hint could be a sample value or a brief description of the expected format.
	 */
	'aria-placeholder'?: string | undefined;
	/**
	 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-setsize.
	 */
	'aria-posinset'?: number | undefined;
	/**
	 * Indicates the current "pressed" state of toggle buttons.
	 * @see aria-checked @see aria-selected.
	 */
	'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
	/**
	 * Indicates that the element is not editable, but is otherwise operable.
	 * @see aria-disabled.
	 */
	'aria-readonly'?: Booleanish | undefined;
	/**
	 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
	 * @see aria-atomic.
	 */
	'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
	/** Indicates that user input is required on the element before a form may be submitted. */
	'aria-required'?: Booleanish | undefined;
	/** Defines a human-readable, author-localized description for the role of an element. */
	'aria-roledescription'?: string | undefined;
	/**
	 * Defines the total number of rows in a table, grid, or treegrid.
	 * @see aria-rowindex.
	 */
	'aria-rowcount'?: number | undefined;
	/**
	 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
	 * @see aria-rowcount @see aria-rowspan.
	 */
	'aria-rowindex'?: number | undefined;
	/**
	 * Defines a human readable text alternative of aria-rowindex.
	 * @see aria-colindextext.
	 */
	'aria-rowindextext'?: string | undefined;
	/**
	 * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-rowindex @see aria-colspan.
	 */
	'aria-rowspan'?: number | undefined;
	/**
	 * Indicates the current "selected" state of various widgets.
	 * @see aria-checked @see aria-pressed.
	 */
	'aria-selected'?: Booleanish | undefined;
	/**
	 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-posinset.
	 */
	'aria-setsize'?: number | undefined;
	/** Indicates if items in a table or grid are sorted in ascending or descending order. */
	'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
	/** Defines the maximum allowed value for a range widget. */
	'aria-valuemax'?: number | undefined;
	/** Defines the minimum allowed value for a range widget. */
	'aria-valuemin'?: number | undefined;
	/**
	 * Defines the current value for a range widget.
	 * @see aria-valuetext.
	 */
	'aria-valuenow'?: number | undefined;
	/** Defines the human readable text alternative of aria-valuenow for a range widget. */
	'aria-valuetext'?: string | undefined;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AriaRole =
	| 'alert'
	| 'alertdialog'
	| 'application'
	| 'article'
	| 'banner'
	| 'button'
	| 'cell'
	| 'checkbox'
	| 'columnheader'
	| 'combobox'
	| 'complementary'
	| 'contentinfo'
	| 'definition'
	| 'dialog'
	| 'directory'
	| 'document'
	| 'feed'
	| 'figure'
	| 'form'
	| 'grid'
	| 'gridcell'
	| 'group'
	| 'heading'
	| 'img'
	| 'link'
	| 'list'
	| 'listbox'
	| 'listitem'
	| 'log'
	| 'main'
	| 'marquee'
	| 'math'
	| 'menu'
	| 'menubar'
	| 'menuitem'
	| 'menuitemcheckbox'
	| 'menuitemradio'
	| 'navigation'
	| 'none'
	| 'note'
	| 'option'
	| 'presentation'
	| 'progressbar'
	| 'radio'
	| 'radiogroup'
	| 'region'
	| 'row'
	| 'rowgroup'
	| 'rowheader'
	| 'scrollbar'
	| 'search'
	| 'searchbox'
	| 'separator'
	| 'slider'
	| 'spinbutton'
	| 'status'
	| 'switch'
	| 'tab'
	| 'table'
	| 'tablist'
	| 'tabpanel'
	| 'term'
	| 'textbox'
	| 'timer'
	| 'toolbar'
	| 'tooltip'
	| 'tree'
	| 'treegrid'
	| 'treeitem'
	| (string & {});

export interface RdfaHtmlAttributes {
	/**
	 * A RDFa attribute containing a _URI_ or _CURIE_ used for stating what the data is about (a _subject_ in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-about
	 */
	about?: string | undefined;
	/**
	 * A RDFa attribute for supplying machine-readable content for a literal (a _literal object_, in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-content
	 */
	content?: string | undefined;
	/**
	 * A RDFa attribute containing a _term_, a _CURIE_ or an _absolute URI_ describing the data type of a literal.
	 * @see https://www.w3.org/TR/rdfa-core/#A-datatype
	 */
	dataType?: string | undefined;
	/**
	 * A RDFa attribute used to indicate that the object associated with a `rel` or `property` attribute on the same element is to be added to the list for that predicate.
	 * The value of this attribute is ignored, the presence of this attribute causes a list to be created if it does not already exist.
	 * @see https://www.w3.org/TR/rdfa-core/#A-inlist
	 */
	inlist?: any;
	/**
	 * A RDFa attribute containting a white space separated list of prefix-name URI pairs.
	 * @see https://www.w3.org/TR/rdfa-core/#A-prefix
	 */
	prefix?: string | undefined;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used for expressing
	 * relationships between a subject and either a resource object if given or some literal text, also a _predicate_.
	 * @see https://www.w3.org/TR/rdfa-core/#A-property
	 */
	property?: string | undefined;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used for expressing
	 * relationships between two resources (_predicates_ in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-rel
	 */
	rel?: string | undefined;
	/**
	 * A RDFa attribute containing a _URI_ or a _CURIE_ for expressing the partner resource
	 * of a relationship that is not intended to be navigable.
	 * @see https://www.w3.org/TR/rdfa-core/#A-resource
	 */
	resource?: string | undefined;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used
	 * for expressing reverse relationships between two resources, also called _predicates_.
	 * @see https://www.w3.org/TR/rdfa-core/#A-rev
	 */
	rev?: string | undefined;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_
	 * that indicate the RDF type(s) to associate with a subject.
	 * @see https://www.w3.org/TR/rdfa-core/#A-typeof
	 */
	typeOf?: string | undefined;
	/**
	 * A RDFa attribute containing an URI that defines the mapping to use when a _term_ is referenced in an attribute value.
	 * @see https://www.w3.org/TR/rdfa-core/#A-vocab
	 */
	vocab?: string | undefined;
}

export interface HtmlAttributes<T extends EventTarget>
extends
	DomAttributes<T>,
	StandardHtmlAttributes,
	LivingStandardHtmlAttributes,
	NonStandardHtmlAttributes,
	AriaAttributes,
	RdfaHtmlAttributes {}

export type HtmlLinkTarget =
	| '_self'
	| '_blank'
	| '_parent'
	| '_top'
	| (string & {});

export type HtmlCrossOriginPolicy =
 	| 'anonymous'
	| 'use-credentials'
	| '';

export interface HtmlAnchorAttributes extends HtmlAttributes<HTMLAnchorElement> {
	download?: any;
	href?: string | undefined;
	hrefLang?: string | undefined;
	media?: string | undefined;
	ping?: string | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: string | undefined;
	target?: HtmlLinkTarget | undefined;
	type?: string | undefined;
}

export interface HtmlAudioAttributes extends HtmlMediaAttributes<HTMLAudioElement> {}

export interface HTMLAreaAttributes extends HtmlAttributes<HTMLAreaElement> {
	alt?: string | undefined;
	coords?: string | undefined;
	download?: any;
	href?: string | undefined;
	hrefLang?: string | undefined;
	media?: string | undefined;
	ping?: string | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: string | undefined;
	shape?: string | undefined;
	target?: string | undefined;
}

export interface HtmlBaseAttributes extends HtmlAttributes<HTMLBaseElement> {
	href?: string | undefined;
	target?: string | undefined;
}

export interface HtmlBlockquoteAttributes extends HtmlAttributes<HTMLQuoteElement> {
	cite?: string | undefined;
}

export interface HtmlButtonAttributes extends HtmlAttributes<HTMLButtonElement> {
	disabled?: boolean | undefined;
	form?: string | undefined;
	formAction?: string | undefined;
	formEncType?: string | undefined;
	formMethod?: string | undefined;
	formNoValidate?: boolean | undefined;
	formTarget?: string | undefined;
	name?: string | undefined;
	type?: 'submit' | 'reset' | 'button' | undefined;
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlCanvasAttributes extends HtmlAttributes<HTMLCanvasElement> {
	height?: number | string | undefined;
	width?: number | string | undefined;
}

export interface HtmlColAttributes extends HtmlAttributes<HTMLTableColElement> {
	span?: number | undefined;
	width?: number | string | undefined;
}

export interface HtmlColGroupAttributes extends HtmlAttributes<HTMLTableColElement> {
	span?: number | undefined;
}

export interface HtmlDataAttributes extends HtmlAttributes<HTMLDataElement> {
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlDetailsAttributes extends HtmlAttributes<HTMLDetailsElement> {
	// TODO should be a bind prop
	open?: boolean | undefined;
}

export interface HtmlDelAttributes extends HtmlAttributes<HTMLModElement> {
	cite?: string | undefined;
	dateTime?: string | undefined;
}

export interface HtmlDialogAttributes extends HtmlAttributes<HTMLDialogElement> {
	// TODO handle cancel & close
	open?: boolean | undefined;
}

export interface HtmlEmbedAttributes extends HtmlAttributes<HTMLEmbedElement> {
	height?: number | string | undefined;
	src?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;
}

export interface HtmlFieldSetAttributes extends HtmlAttributes<HTMLFieldSetElement> {
	disabled?: boolean | undefined;
	form?: string | undefined;
	name?: string | undefined;
}

export interface HtmlFormAttributes extends HtmlAttributes<HTMLFormElement> {
	acceptCharset?: string | undefined;
	action?: string | undefined;
	autoComplete?: string | undefined;
	encType?: string | undefined;
	method?: string | undefined;
	name?: string | undefined;
	noValidate?: boolean | undefined;
	target?: string | undefined;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: string | undefined;
}

export interface HtmlHtmlAttributes extends HtmlAttributes<HTMLHtmlElement> {
	manifest?: string | undefined;
}

export interface HtmlIFrameAttributes extends HtmlAttributes<HTMLIFrameElement>{
	allow?: string | undefined;
	allowFullScreen?: boolean | undefined;
	allowTransparency?: boolean | undefined;
	/** @deprecated */
	frameBorder?: number | string | undefined;
	height?: number | string | undefined;
	loading?: "eager" | "lazy" | undefined;
	/** @deprecated */
	marginHeight?: number | undefined;
	/** @deprecated */
	marginWidth?: number | undefined;
	name?: string | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	sandbox?: string | undefined;
	/** @deprecated */
	scrolling?: string | undefined;
	seamless?: boolean | undefined;
	src?: string | undefined;
	srcDoc?: string | undefined;
	width?: number | string | undefined;
}

export interface HtmlImageAttributes extends HtmlAttributes<HTMLImageElement> {
	alt?: string | undefined;
	crossOrigin?: HtmlCrossOriginPolicy | undefined;
	decoding?: "async" | "auto" | "sync" | undefined;
	height?: number | string | undefined;
	/** @deprecated For accessibility reasons, you should generally avoid using server-side image maps, as they require the use of a mouse. Use a client-side image map instead. */
	isMap?: boolean | undefined;
	loading?: "eager" | "lazy" | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	sizes?: string | undefined;
	src?: string | undefined;
	srcSet?: string | undefined;
	useMap?: string | undefined;
	width?: number | string | undefined;

	// TODO add naturalWidth and naturalHeight props
}

export interface HtmlInsAttributes extends HtmlAttributes<HTMLModElement> {
	cite?: string | undefined;
	dateTime?: string | undefined;
}

export type HtmlInputType =
	| 'button'
	| 'checkbox'
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'hidden'
	| 'image'
	| 'month'
	| 'number'
	| 'password'
	| 'radio'
	| 'range'
	| 'reset'
	| 'search'
	| 'submit'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week'
	| (string & {});

export interface HtmlInputAttributes extends HtmlAttributes<HTMLInputElement> {
	accept?: string | undefined;
	alt?: string | undefined;
	autoComplete?: string | undefined;
	capture?: boolean | 'user' | 'environment' | undefined;
	checked?: boolean | undefined;
	crossOrigin?: HtmlCrossOriginPolicy | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	formAction?: string | undefined;
	formEncType?: string | undefined;
	formMethod?: string | undefined;
	formNoValidate?: boolean | undefined;
	formTarget?: string | undefined;
	height?: number | string | undefined;
	list?: string | undefined;
	max?: number | string | undefined;
	maxLength?: number | undefined;
	min?: number | string | undefined;
	minLength?: number | undefined;
	multiple?: boolean | undefined;
	name?: string | undefined;
	pattern?: string | undefined;
	placeholder?: string | undefined;
	readOnly?: boolean | undefined;
	required?: boolean | undefined;
	size?: number | undefined;
	src?: string | undefined;
	step?: number | string | undefined;
	type?: HtmlInputType | undefined;
	value?: string | readonly string[] | number | undefined;
	width?: number | string | undefined;

	onChange?: ChangeEventSignal<HTMLInputElement> | undefined;

	// TODO add binds for checked, value, group, files, indeterminate
}

export interface HtmlKeygenAttributes extends HtmlAttributes<HTMLElement> {
	challenge?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	keyType?: string | undefined;
	keyParams?: string | undefined;
	name?: string | undefined;
}

export interface HtmlLabelAttributes extends HtmlAttributes<HTMLLabelElement> {
	form?: string | undefined;
	for?: string | undefined;
}

export interface HtmlLiAttributes extends HtmlAttributes<HTMLLIElement> {
	value?: string | readonly string[] | undefined;
}

export interface HtmlLinkAttributes extends HtmlAttributes<HTMLLinkElement> {
	as?: string | undefined;
	crossOrigin?: HtmlCrossOriginPolicy | undefined;
	fetchPriority?: "high" | "low" | "auto";
	href?: string | undefined;
	hrefLang?: string | undefined;
	integrity?: string | undefined;
	media?: string | undefined;
	imageSrcSet?: string | undefined;
	imageSizes?: string | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: string | undefined;
	sizes?: string | undefined;
	type?: string | undefined;
	charSet?: string | undefined;
}

export interface HtmlMapAttributes extends HtmlAttributes<HTMLMapElement> {
	name?: string | undefined;
}

export interface HtmlMenuAttributes extends HtmlAttributes<HTMLMenuElement> {
	type?: string | undefined;
}

export interface HtmlMediaAttributes<T extends HTMLMediaElement> extends HtmlAttributes<T> {
	autoPlay?: boolean | undefined;
	controls?: boolean | undefined;
	controlsList?: 'nodownload' | 'nofullscreen' | 'noplaybackrate' | 'noremoteplayback' | (string & {}) | undefined;
	crossOrigin?: HtmlCrossOriginPolicy;
	currentTime?: number | undefined;
	loop?: boolean | undefined;
	mediaGroup?: string | undefined;
	muted?: boolean | undefined;
	playsInline?: boolean | undefined;
	preload?: string | undefined;
	src?: string | undefined;
	/**
	 * a value between 0 and 1
	 */
	volume?: number | undefined;

	// TODO lots of stuff to bind here
}

export interface HtmlMetaAttributes extends HtmlAttributes<HTMLMetaElement> {
	charSet?: string | undefined;
	content?: string | undefined;
	httpEquiv?: string | undefined;
	name?: string | undefined;
	media?: string | undefined;
}

export interface HtmlMeterAttributes extends HtmlAttributes<HTMLMeterElement> {
	form?: string | undefined;
	high?: number | undefined;
	low?: number | undefined;
	max?: number | string | undefined;
	min?: number | string | undefined;
	optimum?: number | undefined;
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlQuoteAttributes extends HtmlAttributes<HTMLQuoteElement> {
	cite?: string | undefined;
}

export interface HtmlObjectAttributes extends HtmlAttributes<HTMLObjectElement> {
	/** @deprecated */
	classId?: string | undefined;
	data?: string | undefined;
	form?: string | undefined;
	height?: number | string | undefined;
	name?: string | undefined;
	type?: string | undefined;
	useMap?: string | undefined;
	width?: number | string | undefined;
}

export interface HtmlOlAttributes extends HtmlAttributes<HTMLOListElement> {
	reversed?: boolean | undefined;
	start?: number | undefined;
	type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

export interface HtmlOptGroupAttributes extends HtmlAttributes<HTMLOptGroupElement> {
	disabled?: boolean | undefined;
	label?: string | undefined;
}

export interface HtmlOptionAttributes extends HtmlAttributes<HTMLOptionElement> {
	disabled?: boolean | undefined;
	label?: string | undefined;
	selected?: boolean | undefined;
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlOutputAttributes extends HtmlAttributes<HTMLOutputElement> {
	form?: string | undefined;
	for?: string | undefined;
	name?: string | undefined;
}

export interface HtmlParamAttributes extends HtmlAttributes<HTMLParamElement> {
	name?: string | undefined;
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlProgressAttributes extends HtmlAttributes<HTMLProgressElement> {
	max?: number | string | undefined;
	value?: string | readonly string[] | number | undefined;
}

export interface HtmlSlotAttributes extends HtmlAttributes<HTMLSlotElement> {
	name?: string | undefined;
}

export interface HtmlScriptAttributes extends HtmlAttributes<HTMLScriptElement> {
	async?: boolean | undefined;
	/** @deprecated */
	charSet?: string | undefined;
	crossOrigin?: HtmlCrossOriginPolicy;
	defer?: boolean | undefined;
	integrity?: string | undefined;
	noModule?: boolean | undefined;
	referrerPolicy?: ReferrerPolicy | undefined;
	src?: string | undefined;
	type?: string | undefined;
}

export interface HtmlSelectAttributes extends HtmlAttributes<HTMLSelectElement> {
	autoComplete?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	multiple?: boolean | undefined;
	name?: string | undefined;
	required?: boolean | undefined;
	size?: number | undefined;
	value?: string | readonly string[] | number | undefined;

	// TODO bind value
	onChange?: ChangeEventSignal<HTMLSelectElement> | undefined;
}

export interface HtmlSourceAttributes extends HtmlAttributes<HTMLSourceElement> {
	height?: number | string | undefined;
	media?: string | undefined;
	sizes?: string | undefined;
	src?: string | undefined;
	srcSet?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;
}

export interface HtmlStyleAttributes extends HtmlAttributes<HTMLStyleElement> {
	media?: string | undefined;
	type?: string | undefined;
}

export interface HtmlTableAttributes extends HtmlAttributes<HTMLTableElement> {
	/** @deprecated */
	align?: "left" | "center" | "right" | undefined;
	/** @deprecated */
	bgColor?: string | undefined;
	/** @deprecated */
	border?: number | undefined;
	/** @deprecated */
	cellPadding?: number | string | undefined;
	/** @deprecated */
	cellSpacing?: number | string | undefined;
	/** @deprecated */
	frame?: boolean | undefined;
	/** @deprecated */
	rules?: "none" | "groups" | "rows" | "columns" | "all" | undefined;
	/** @deprecated */
	summary?: string | undefined;
	/** @deprecated */
	width?: number | string | undefined;
}

export interface HtmlTextAreaAttributes extends HtmlAttributes<HTMLTextAreaElement> {
	autoComplete?: string | undefined;
	cols?: number | undefined;
	dirName?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	maxLength?: number | undefined;
	minLength?: number | undefined;
	name?: string | undefined;
	placeholder?: string | undefined;
	readonly?: boolean | undefined;
	required?: boolean | undefined;
	rows?: number | undefined;
	value?: string | ReadonlyArray<string> | number | undefined;
	wrap?: string | undefined;

	// TODO bind value
	onChange?: ChangeEventSignal<HTMLTextAreaElement> | undefined;
}

export interface HtmlTdAttributes extends HtmlAttributes<HTMLTableCellElement> {
	/** @deprecated */
	abbr?: string | undefined;
	/** @deprecated */
	align?: "left" | "center" | "right" | "justify" | "char" | undefined;
	colSpan?: number | undefined;
	headers?: string | undefined;
	rowSpan?: number | undefined;
	/** @deprecated */
	scope?: string | undefined;
	/** @deprecated */
	height?: number | string | undefined;
	/** @deprecated */
	width?: number | string | undefined;
	/** @deprecated */
	valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
}

export interface HtmlThAttributes extends HtmlAttributes<HTMLTableCellElement> {
	abbr?: string | undefined;
	/** @deprecated */
	align?: "left" | "center" | "right" | "justify" | "char" | undefined;
	colSpan?: number | undefined;
	headers?: string | undefined;
	rowSpan?: number | undefined;
	scope?: string | undefined;
}

export interface HtmlTimeAttributes extends HtmlAttributes<HTMLTimeElement> {
	dateTime: string | undefined;
}

export interface HtmlTrackAttributes extends HtmlAttributes<HTMLTrackElement> {
	default?: boolean | undefined;
	kind?: string | undefined;
	label?: string | undefined;
	src?: string | undefined;
	srcLang?: string | undefined;
}

export interface HtmlVideoAttributes extends HtmlMediaAttributes<HTMLVideoElement> {
	height?: number | string | undefined;
	playsInline?: boolean | undefined;
	poster?: string | undefined;
	width?: number | string | undefined;
	disablePictureInPicture?: boolean | undefined;
	disableRemotePlayback?: boolean | undefined;

	// TODO bind dimensions
}

// TODO add document and window binds and events

export interface SVGAttributes<T extends EventTarget> extends AriaAttributes, DomAttributes<T> {
	// Attributes which also defined in HtmlAttributes
	className?: string | undefined;
	class?: string | undefined;
	color?: string | undefined;
	height?: number | string | undefined;
	id?: string | undefined;
	lang?: string | undefined;
	max?: number | string | undefined;
	media?: string | undefined;
	method?: string | undefined;
	min?: number | string | undefined;
	name?: string | undefined;
	style?: string | undefined;
	target?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;

	// Other HTML properties supported by SVG elements in browsers
	role?: AriaRole | undefined;
	tabindex?: number | undefined;
	crossorigin?: 'anonymous' | 'use-credentials' | '' | undefined;

	// SVG Specific attributes
	'accent-height'?: number | string | undefined;
	accumulate?: 'none' | 'sum' | undefined;
	additive?: 'replace' | 'sum' | undefined;
	'alignment-baseline'?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' |
	  'central' | 'after-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' |
	  'mathematical' | 'inherit' | undefined;
	allowReorder?: 'no' | 'yes' | undefined;
	alphabetic?: number | string | undefined;
	amplitude?: number | string | undefined;
	'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
	ascent?: number | string | undefined;
	attributeName?: string | undefined;
	attributeType?: string | undefined;
	autoReverse?: number | string | undefined;
	azimuth?: number | string | undefined;
	baseFrequency?: number | string | undefined;
	'baseline-shift'?: number | string | undefined;
	baseProfile?: number | string | undefined;
	bbox?: number | string | undefined;
	begin?: number | string | undefined;
	bias?: number | string | undefined;
	by?: number | string | undefined;
	calcMode?: number | string | undefined;
	'cap-height'?: number | string | undefined;
	clip?: number | string | undefined;
	'clip-path'?: string | undefined;
	clipPathUnits?: number | string | undefined;
	'clip-rule'?: number | string | undefined;
	'color-interpolation'?: number | string | undefined;
	'color-interpolation-filters'?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined;
	'color-profile'?: number | string | undefined;
	'color-rendering'?: number | string | undefined;
	contentScriptType?: number | string | undefined;
	contentStyleType?: number | string | undefined;
	cursor?: number | string | undefined;
	cx?: number | string | undefined;
	cy?: number | string | undefined;
	d?: string | undefined;
	decelerate?: number | string | undefined;
	descent?: number | string | undefined;
	diffuseConstant?: number | string | undefined;
	direction?: number | string | undefined;
	display?: number | string | undefined;
	divisor?: number | string | undefined;
	'dominant-baseline'?: number | string | undefined;
	dur?: number | string | undefined;
	dx?: number | string | undefined;
	dy?: number | string | undefined;
	edgeMode?: number | string | undefined;
	elevation?: number | string | undefined;
	'enable-background'?: number | string | undefined;
	end?: number | string | undefined;
	exponent?: number | string | undefined;
	externalResourcesRequired?: number | string | undefined;
	fill?: string | undefined;
	'fill-opacity'?: number | string | undefined;
	'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
	filter?: string | undefined;
	filterRes?: number | string | undefined;
	filterUnits?: number | string | undefined;
	'flood-color'?: number | string | undefined;
	'flood-opacity'?: number | string | undefined;
	focusable?: number | string | undefined;
	'font-family'?: string | undefined;
	'font-size'?: number | string | undefined;
	'font-size-adjust'?: number | string | undefined;
	'font-stretch'?: number | string | undefined;
	'font-style'?: number | string | undefined;
	'font-variant'?: number | string | undefined;
	'font-weight'?: number | string | undefined;
	format?: number | string | undefined;
	from?: number | string | undefined;
	fx?: number | string | undefined;
	fy?: number | string | undefined;
	g1?: number | string | undefined;
	g2?: number | string | undefined;
	'glyph-name'?: number | string | undefined;
	'glyph-orientation-horizontal'?: number | string | undefined;
	'glyph-orientation-vertical'?: number | string | undefined;
	glyphRef?: number | string | undefined;
	gradientTransform?: string | undefined;
	gradientUnits?: string | undefined;
	hanging?: number | string | undefined;
	href?: string | undefined;
	'horiz-adv-x'?: number | string | undefined;
	'horiz-origin-x'?: number | string | undefined;
	ideographic?: number | string | undefined;
	'image-rendering'?: number | string | undefined;
	in2?: number | string | undefined;
	in?: string | undefined;
	intercept?: number | string | undefined;
	k1?: number | string | undefined;
	k2?: number | string | undefined;
	k3?: number | string | undefined;
	k4?: number | string | undefined;
	k?: number | string | undefined;
	kernelMatrix?: number | string | undefined;
	kernelUnitLength?: number | string | undefined;
	kerning?: number | string | undefined;
	keyPoints?: number | string | undefined;
	keySplines?: number | string | undefined;
	keyTimes?: number | string | undefined;
	lengthAdjust?: number | string | undefined;
	'letter-spacing'?: number | string | undefined;
	'lighting-color'?: number | string | undefined;
	limitingConeAngle?: number | string | undefined;
	local?: number | string | undefined;
	'marker-end'?: string | undefined;
	markerHeight?: number | string | undefined;
	'marker-mid'?: string | undefined;
	'marker-start'?: string | undefined;
	markerUnits?: number | string | undefined;
	markerWidth?: number | string | undefined;
	mask?: string | undefined;
	maskContentUnits?: number | string | undefined;
	maskUnits?: number | string | undefined;
	mathematical?: number | string | undefined;
	mode?: number | string | undefined;
	numOctaves?: number | string | undefined;
	offset?: number | string | undefined;
	opacity?: number | string | undefined;
	operator?: number | string | undefined;
	order?: number | string | undefined;
	orient?: number | string | undefined;
	orientation?: number | string | undefined;
	origin?: number | string | undefined;
	overflow?: number | string | undefined;
	'overline-position'?: number | string | undefined;
	'overline-thickness'?: number | string | undefined;
	'paint-order'?: number | string | undefined;
	'panose-1'?: number | string | undefined;
	path?: string | undefined;
	pathLength?: number | string | undefined;
	patternContentUnits?: string | undefined;
	patternTransform?: number | string | undefined;
	patternUnits?: string | undefined;
	'pointer-events'?: number | string | undefined;
	points?: string | undefined;
	pointsAtX?: number | string | undefined;
	pointsAtY?: number | string | undefined;
	pointsAtZ?: number | string | undefined;
	preserveAlpha?: number | string | undefined;
	preserveAspectRatio?: string | undefined;
	primitiveUnits?: number | string | undefined;
	r?: number | string | undefined;
	radius?: number | string | undefined;
	refX?: number | string | undefined;
	refY?: number | string | undefined;
	'rendering-intent'?: number | string | undefined;
	repeatCount?: number | string | undefined;
	repeatDur?: number | string | undefined;
	requiredExtensions?: number | string | undefined;
	requiredFeatures?: number | string | undefined;
	restart?: number | string | undefined;
	result?: string | undefined;
	rotate?: number | string | undefined;
	rx?: number | string | undefined;
	ry?: number | string | undefined;
	scale?: number | string | undefined;
	seed?: number | string | undefined;
	'shape-rendering'?: number | string | undefined;
	slope?: number | string | undefined;
	spacing?: number | string | undefined;
	specularConstant?: number | string | undefined;
	specularExponent?: number | string | undefined;
	speed?: number | string | undefined;
	spreadMethod?: string | undefined;
	startOffset?: number | string | undefined;
	stdDeviation?: number | string | undefined;
	stemh?: number | string | undefined;
	stemv?: number | string | undefined;
	stitchTiles?: number | string | undefined;
	'stop-color'?: string | undefined;
	'stop-opacity'?: number | string | undefined;
	'strikethrough-position'?: number | string | undefined;
	'strikethrough-thickness'?: number | string | undefined;
	string?: number | string | undefined;
	stroke?: string | undefined;
	'stroke-dasharray'?: string | number | undefined;
	'stroke-dashoffset'?: string | number | undefined;
	'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
	'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
	'stroke-miterlimit'?: string | undefined;
	'stroke-opacity'?: number | string | undefined;
	'stroke-width'?: number | string | undefined;
	surfaceScale?: number | string | undefined;
	systemLanguage?: number | string | undefined;
	tableValues?: number | string | undefined;
	targetX?: number | string | undefined;
	targetY?: number | string | undefined;
	'text-anchor'?: string | undefined;
	'text-decoration'?: number | string | undefined;
	textLength?: number | string | undefined;
	'text-rendering'?: number | string | undefined;
	to?: number | string | undefined;
	transform?: string | undefined;
	u1?: number | string | undefined;
	u2?: number | string | undefined;
	'underline-position'?: number | string | undefined;
	'underline-thickness'?: number | string | undefined;
	unicode?: number | string | undefined;
	'unicode-bidi'?: number | string | undefined;
	'unicode-range'?: number | string | undefined;
	'units-per-em'?: number | string | undefined;
	'v-alphabetic'?: number | string | undefined;
	values?: string | undefined;
	'vector-effect'?: number | string | undefined;
	version?: string | undefined;
	'vert-adv-y'?: number | string | undefined;
	'vert-origin-x'?: number | string | undefined;
	'vert-origin-y'?: number | string | undefined;
	'v-hanging'?: number | string | undefined;
	'v-ideographic'?: number | string | undefined;
	viewBox?: string | undefined;
	viewTarget?: number | string | undefined;
	visibility?: number | string | undefined;
	'v-mathematical'?: number | string | undefined;
	widths?: number | string | undefined;
	'word-spacing'?: number | string | undefined;
	'writing-mode'?: number | string | undefined;
	x1?: number | string | undefined;
	x2?: number | string | undefined;
	x?: number | string | undefined;
	xChannelSelector?: string | undefined;
	'x-height'?: number | string | undefined;
	'xlink:actuate'?: string | undefined;
	'xlink:arcrole'?: string | undefined;
	'xlink:href'?: string | undefined;
	'xlink:role'?: string | undefined;
	'xlink:show'?: string | undefined;
	'xlink:title'?: string | undefined;
	'xlink:type'?: string | undefined;
	'xml:base'?: string | undefined;
	'xml:lang'?: string | undefined;
	xmlns?: string | undefined;
	'xmlns:xlink'?: string | undefined;
	'xml:space'?: string | undefined;
	y1?: number | string | undefined;
	y2?: number | string | undefined;
	y?: number | string | undefined;
	yChannelSelector?: string | undefined;
	z?: number | string | undefined;
	zoomAndPan?: string | undefined;
}

export type ElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;
export type TagName = keyof ElementTagNameMap;
export type HtmlSvgAmbiguousTagName = keyof HTMLElementTagNameMap & keyof SVGElementTagNameMap;

export interface AttributesTagNameMap {
	a: HtmlAnchorAttributes;
	abbr: HtmlAttributes<HTMLElement>;
	address: HtmlAttributes<HTMLElement>;
	area: HTMLAreaAttributes;
	article: HtmlAttributes<HTMLElement>;
	aside: HtmlAttributes<HTMLElement>;
	audio: HtmlAudioAttributes;
	b: HtmlAttributes<HTMLElement>;
	base: HtmlBaseAttributes;
	bdi: HtmlAttributes<HTMLElement>;
	bdo: HtmlAttributes<HTMLElement>;
	big: HtmlAttributes<HTMLElement>;
	blockquote: HtmlBlockquoteAttributes;
	body: HtmlAttributes<HTMLBodyElement>;
	br: HtmlAttributes<HTMLBRElement>;
	button: HtmlButtonAttributes;
	canvas: HtmlCanvasAttributes;
	caption: HtmlAttributes<HTMLElement>;
	cite: HtmlAttributes<HTMLElement>;
	code: HtmlAttributes<HTMLElement>;
	col: HtmlColAttributes;
	colgroup: HtmlColGroupAttributes;
	data: HtmlDataAttributes;
	datalist: HtmlAttributes<HTMLDataListElement>;
	dd: HtmlAttributes<HTMLElement>;
	del: HtmlDelAttributes;
	details: HtmlDetailsAttributes;
	dfn: HtmlAttributes<HTMLElement>;
	dialog: HtmlDialogAttributes;	
	div: HtmlAttributes<HTMLDivElement>;
	dl: HtmlAttributes<HTMLDListElement>;
	dt: HtmlAttributes<HTMLElement>;
	em: HtmlAttributes<HTMLElement>;
	embed: HtmlEmbedAttributes;
	fieldset: HtmlFieldSetAttributes;
	figcaption: HtmlAttributes<HTMLElement>;
	figure: HtmlAttributes<HTMLElement>;
	footer: HtmlAttributes<HTMLElement>;
	form: HtmlFormAttributes;
	h1: HtmlAttributes<HTMLHeadingElement>;
	h2: HtmlAttributes<HTMLHeadingElement>;
	h3: HtmlAttributes<HTMLHeadingElement>;
	h4: HtmlAttributes<HTMLHeadingElement>;
	h5: HtmlAttributes<HTMLHeadingElement>;
	h6: HtmlAttributes<HTMLHeadingElement>;
	head: HtmlAttributes<HTMLElement>;
	header: HtmlAttributes<HTMLElement>;
	hgroup: HtmlAttributes<HTMLElement>;
	hr: HtmlAttributes<HTMLHRElement>;
	html: HtmlHtmlAttributes;
	i: HtmlAttributes<HTMLElement>;
	iframe: HtmlIFrameAttributes;
	img: HtmlImageAttributes;
	input: HtmlInputAttributes;
	ins: HtmlInsAttributes;
	kbd: HtmlAttributes<HTMLElement>;
	keygen: HtmlKeygenAttributes;
	label: HtmlLabelAttributes;
	legend: HtmlAttributes<HTMLLegendElement>;
	li: HtmlLiAttributes;
	link: HtmlLinkAttributes;
	main: HtmlAttributes<HTMLElement>;
	map: HtmlMapAttributes;
	mark: HtmlAttributes<HTMLElement>;
	menu: HtmlMenuAttributes;
	menuitem: HtmlAttributes<HTMLElement>;
	meta: HtmlMetaAttributes;
	meter: HtmlMeterAttributes;
	nav: HtmlAttributes<HTMLElement>;
	noscript: HtmlAttributes<HTMLElement>;
	object: HtmlObjectAttributes;
	ol: HtmlOlAttributes;
	optgroup: HtmlOptGroupAttributes;
	option: HtmlOptionAttributes;
	output: HtmlOutputAttributes;
	p: HtmlAttributes<HTMLParagraphElement>;
	param: HtmlParamAttributes;
	picture: HtmlAttributes<HTMLElement>;
	pre: HtmlAttributes<HTMLPreElement>;
	progress: HtmlProgressAttributes;
	q: HtmlQuoteAttributes;
	rp: HtmlAttributes<HTMLElement>;
	rt: HtmlAttributes<HTMLElement>;
	ruby: HtmlAttributes<HTMLElement>;
	s: HtmlAttributes<HTMLElement>;
	samp: HtmlAttributes<HTMLElement>;
	slot: HtmlSlotAttributes;
	script: HtmlScriptAttributes;
	section: HtmlAttributes<HTMLElement>;
	select: HtmlSelectAttributes;
	small: HtmlAttributes<HTMLElement>;
	source: HtmlSourceAttributes;
	span: HtmlAttributes<HTMLSpanElement>;
	strong: HtmlAttributes<HTMLElement>;
	style: HtmlStyleAttributes;
	sub: HtmlAttributes<HTMLElement>;
	summary: HtmlAttributes<HTMLElement>;
	sup: HtmlAttributes<HTMLElement>;
	table: HtmlTableAttributes;
	template: HtmlAttributes<HTMLTemplateElement>;
	tbody: HtmlAttributes<HTMLTableSectionElement>;
	td: HtmlTdAttributes;
	textarea: HtmlTextAreaAttributes;
	tfoot: HtmlAttributes<HTMLTableSectionElement>;
	th: HtmlThAttributes;
	thead: HtmlAttributes<HTMLTableSectionElement>;
	time: HtmlTimeAttributes;
	title: HtmlAttributes<HTMLTitleElement>;
	tr: HtmlAttributes<HTMLTableRowElement>;
	track: HtmlTrackAttributes;
	u: HtmlAttributes<HTMLElement>;
	ul: HtmlAttributes<HTMLUListElement>;
	var: HtmlAttributes<HTMLElement>;
	video: HtmlVideoAttributes;
	wbr: HtmlAttributes<HTMLElement>;

	// SVG
	svg: SVGAttributes<SVGSVGElement>;
	animate: SVGAttributes<SVGAnimateElement>;
	animateMotion: SVGAttributes<SVGElement>;
	animateTransform: SVGAttributes<SVGAnimateTransformElement>;
	circle: SVGAttributes<SVGCircleElement>;
	clipPath: SVGAttributes<SVGClipPathElement>;
	defs: SVGAttributes<SVGDefsElement>;
	desc: SVGAttributes<SVGDescElement>;
	ellipse: SVGAttributes<SVGEllipseElement>;
	feBlend: SVGAttributes<SVGFEBlendElement>;
	feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>;
	feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>;
	feComposite: SVGAttributes<SVGFECompositeElement>;
	feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>;
	feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>;
	feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>;
	feDistantLight: SVGAttributes<SVGFEDistantLightElement>;
	feDropShadow: SVGAttributes<SVGFEDropShadowElement>;
	feFlood: SVGAttributes<SVGFEFloodElement>;
	feFuncA: SVGAttributes<SVGFEFuncAElement>;
	feFuncB: SVGAttributes<SVGFEFuncBElement>;
	feFuncG: SVGAttributes<SVGFEFuncGElement>;
	feFuncR: SVGAttributes<SVGFEFuncRElement>;
	feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>;
	feImage: SVGAttributes<SVGFEImageElement>;
	feMerge: SVGAttributes<SVGFEMergeElement>;
	feMergeNode: SVGAttributes<SVGFEMergeNodeElement>;
	feMorphology: SVGAttributes<SVGFEMorphologyElement>;
	feOffset: SVGAttributes<SVGFEOffsetElement>;
	fePointLight: SVGAttributes<SVGFEPointLightElement>;
	feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>;
	feSpotLight: SVGAttributes<SVGFESpotLightElement>;
	feTile: SVGAttributes<SVGFETileElement>;
	feTurbulence: SVGAttributes<SVGFETurbulenceElement>;
	filter: SVGAttributes<SVGFilterElement>;
	foreignObject: SVGAttributes<SVGForeignObjectElement>;
	g: SVGAttributes<SVGGElement>;
	image: SVGAttributes<SVGImageElement>;
	line: SVGAttributes<SVGLineElement>;
	linearGradient: SVGAttributes<SVGLinearGradientElement>;
	marker: SVGAttributes<SVGMarkerElement>;
	mask: SVGAttributes<SVGMaskElement>;
	metadata: SVGAttributes<SVGMetadataElement>;
	mpath: SVGAttributes<SVGElement>;
	path: SVGAttributes<SVGPathElement>;
	pattern: SVGAttributes<SVGPatternElement>;
	polygon: SVGAttributes<SVGPolygonElement>;
	polyline: SVGAttributes<SVGPolylineElement>;
	radialGradient: SVGAttributes<SVGRadialGradientElement>;
	rect: SVGAttributes<SVGRectElement>;
	stop: SVGAttributes<SVGStopElement>;
	switch: SVGAttributes<SVGSwitchElement>;
	symbol: SVGAttributes<SVGSymbolElement>;
	text: SVGAttributes<SVGTextElement>;
	textPath: SVGAttributes<SVGTextPathElement>;
	tspan: SVGAttributes<SVGTSpanElement>;
	use: SVGAttributes<SVGUseElement>;
	view: SVGAttributes<SVGViewElement>;

	[name: string]: { [name: string]: any };
}
