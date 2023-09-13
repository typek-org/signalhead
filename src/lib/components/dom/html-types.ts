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

import type { InProp, InOutProp, OutProp } from "../types.ts";

type Booleanish = boolean | "true" | "false";

//
// Event Handler Types
// ----------------------------------------------------------------------

type EventProp<
	E extends Event = Event,
	T extends EventTarget = Element,
> = OutProp<E & { currentTarget: EventTarget & T }>;

export type ClipboardEventSignal<T extends EventTarget> = EventProp<
	ClipboardEvent,
	T
>;
export type CompositionEventSignal<T extends EventTarget> = EventProp<
	CompositionEvent,
	T
>;
export type DragEventSignal<T extends EventTarget> = EventProp<
	DragEvent,
	T
>;
export type FocusEventSignal<T extends EventTarget> = EventProp<
	FocusEvent,
	T
>;
export type FormEventSignal<T extends EventTarget> = EventProp<
	Event,
	T
>;
export type ChangeEventSignal<T extends EventTarget> = EventProp<
	Event,
	T
>;
export type KeyboardEventSignal<T extends EventTarget> = EventProp<
	KeyboardEvent,
	T
>;
export type MouseEventSignal<T extends EventTarget> = EventProp<
	MouseEvent,
	T
>;
export type TouchEventSignal<T extends EventTarget> = EventProp<
	TouchEvent,
	T
>;
export type PointerEventSignal<T extends EventTarget> = EventProp<
	PointerEvent,
	T
>;
export type UIEventSignal<T extends EventTarget> = EventProp<
	UIEvent,
	T
>;
export type WheelEventSignal<T extends EventTarget> = EventProp<
	WheelEvent,
	T
>;
export type AnimationEventSignal<T extends EventTarget> = EventProp<
	AnimationEvent,
	T
>;
export type TransitionEventSignal<T extends EventTarget> = EventProp<
	TransitionEvent,
	T
>;
export type MessageEventSignal<T extends EventTarget> = EventProp<
	MessageEvent,
	T
>;

//
// DOM Attributes
// ----------------------------------------------------------------------

export interface DomAttributes<T extends EventTarget> {
	// Mod Attributes
	self?: OutProp<T>;

	// Clipboard Events
	onCopy?: ClipboardEventSignal<T>;
	onCopyCapture?: ClipboardEventSignal<T>;
	onCut?: ClipboardEventSignal<T>;
	onCutCapture?: ClipboardEventSignal<T>;
	onPaste?: ClipboardEventSignal<T>;
	onPasteCapture?: ClipboardEventSignal<T>;

	// Composition Events
	onCompositionEnd?: CompositionEventSignal<T>;
	onCompositionEndCapture?: CompositionEventSignal<T>;
	onCompositionStart?: CompositionEventSignal<T>;
	onCompositionStartCapture?: CompositionEventSignal<T>;
	onCompositionUpdate?: CompositionEventSignal<T>;
	onCompositionUpdateCapture?: CompositionEventSignal<T>;

	// Focus Events
	onFocus?: FocusEventSignal<T>;
	onFocusCapture?: FocusEventSignal<T>;
	onBlur?: FocusEventSignal<T>;
	onBlurCapture?: FocusEventSignal<T>;

	// Form Events
	onChange?: FormEventSignal<T>;
	onChangeCapture?: FormEventSignal<T>;
	onBeforeInput?: FormEventSignal<T>;
	onBeforeInputCapture?: FormEventSignal<T>;
	onInput?: FormEventSignal<T>;
	onInputCapture?: FormEventSignal<T>;
	onReset?: FormEventSignal<T>;
	onResetCapture?: FormEventSignal<T>;
	onSubmit?: FormEventSignal<T>;
	onSubmitCapture?: FormEventSignal<T>;
	onInvalid?: FormEventSignal<T>;
	onInvalidCapture?: FormEventSignal<T>;

	// Image Events
	onLoad?: EventProp<Event, T>;
	onLoadCapture?: EventProp<Event, T>;
	onError?: EventProp<Event, T>; // also a Media Event
	onErrorCapture?: EventProp<Event, T>; // also a Media Event

	// Keyboard Events
	onKeyDown?: KeyboardEventSignal<T>;
	onKeyDownCapture?: KeyboardEventSignal<T>;
	/** @deprecated */
	onKeyPress?: KeyboardEventSignal<T>;
	/** @deprecated */
	onKeyPressCapture?: KeyboardEventSignal<T>;
	onKeyUp?: KeyboardEventSignal<T>;
	onKeyUpCapture?: KeyboardEventSignal<T>;

	// Media Events
	onAbort?: EventProp<Event, T>;
	onAbortCapture?: EventProp<Event, T>;
	onCanPlay?: EventProp<Event, T>;
	onCanPlayCapture?: EventProp<Event, T>;
	onCanPlayThrough?: EventProp<Event, T>;
	onCanPlayThroughCapture?: EventProp<Event, T>;
	onDurationChange?: EventProp<Event, T>;
	onDurationChangeCapture?: EventProp<Event, T>;
	onEmptied?: EventProp<Event, T>;
	onEmptiedCapture?: EventProp<Event, T>;
	onEncrypted?: EventProp<Event, T>;
	onEncryptedCapture?: EventProp<Event, T>;
	onEnded?: EventProp<Event, T>;
	onEndedCapture?: EventProp<Event, T>;
	onLoadedData?: EventProp<Event, T>;
	onLoadedDataCapture?: EventProp<Event, T>;
	onLoadedMetadata?: EventProp<Event, T>;
	onLoadedMetadataCapture?: EventProp<Event, T>;
	onLoadStart?: EventProp<Event, T>;
	onLoadStartCapture?: EventProp<Event, T>;
	onPause?: EventProp<Event, T>;
	onPauseCapture?: EventProp<Event, T>;
	onPlay?: EventProp<Event, T>;
	onPlayCapture?: EventProp<Event, T>;
	onPlaying?: EventProp<Event, T>;
	onPlayingCapture?: EventProp<Event, T>;
	onProgress?: EventProp<Event, T>;
	onProgressCapture?: EventProp<Event, T>;
	onRateChange?: EventProp<Event, T>;
	onRateChangeCapture?: EventProp<Event, T>;
	onResize?: EventProp<Event, T>;
	onResizeCapture?: EventProp<Event, T>;
	onSeeked?: EventProp<Event, T>;
	onSeekedCapture?: EventProp<Event, T>;
	onSeeking?: EventProp<Event, T>;
	onSeekingCapture?: EventProp<Event, T>;
	onStalled?: EventProp<Event, T>;
	onStalledCapture?: EventProp<Event, T>;
	onSuspend?: EventProp<Event, T>;
	onSuspendCapture?: EventProp<Event, T>;
	onTimeUpdate?: EventProp<Event, T>;
	onTimeUpdateCapture?: EventProp<Event, T>;
	onVolumeChange?: EventProp<Event, T>;
	onVolumeChangeCapture?: EventProp<Event, T>;
	onWaiting?: EventProp<Event, T>;
	onWaitingCapture?: EventProp<Event, T>;

	// MouseEvents
	onAuxClick?: MouseEventSignal<T>;
	onAuxClickCapture?: MouseEventSignal<T>;
	onClick?: MouseEventSignal<T>;
	onClickCapture?: MouseEventSignal<T>;
	onContextMenu?: MouseEventSignal<T>;
	onContextMenuCapture?: MouseEventSignal<T>;
	onDoubleClick?: MouseEventSignal<T>;
	onDoubleClickCapture?: MouseEventSignal<T>;
	onDrag?: DragEventSignal<T>;
	onDragCapture?: DragEventSignal<T>;
	onDragEnd?: DragEventSignal<T>;
	onDragEndCapture?: DragEventSignal<T>;
	onDragEnter?: DragEventSignal<T>;
	onDragEnterCapture?: DragEventSignal<T>;
	onDragExit?: DragEventSignal<T>;
	onDragExitCapture?: DragEventSignal<T>;
	onDragLeave?: DragEventSignal<T>;
	onDragLeaveCapture?: DragEventSignal<T>;
	onDragOver?: DragEventSignal<T>;
	onDragOverCapture?: DragEventSignal<T>;
	onDragStart?: DragEventSignal<T>;
	onDragStartCapture?: DragEventSignal<T>;
	onDrop?: DragEventSignal<T>;
	onDropCapture?: DragEventSignal<T>;
	onMouseDown?: MouseEventSignal<T>;
	onMouseDownCapture?: MouseEventSignal<T>;
	onMouseEnter?: MouseEventSignal<T>;
	onMouseLeave?: MouseEventSignal<T>;
	onMouseMove?: MouseEventSignal<T>;
	onMouseMoveCapture?: MouseEventSignal<T>;
	onMouseOut?: MouseEventSignal<T>;
	onMouseOutCapture?: MouseEventSignal<T>;
	onMouseOver?: MouseEventSignal<T>;
	onMouseOverCapture?: MouseEventSignal<T>;
	onMouseUp?: MouseEventSignal<T>;
	onMouseUpCapture?: MouseEventSignal<T>;

	// Selection Events
	onSelect?: EventProp<Event, T>;
	onSelectCapture?: EventProp<Event, T>;

	// Touch Events
	onTouchCancel?: TouchEventSignal<T>;
	onTouchCancelCapture?: TouchEventSignal<T>;
	onTouchEnd?: TouchEventSignal<T>;
	onTouchEndCapture?: TouchEventSignal<T>;
	onTouchMove?: TouchEventSignal<T>;
	onTouchMoveCapture?: TouchEventSignal<T>;
	onTouchStart?: TouchEventSignal<T>;
	onTouchStartCapture?: TouchEventSignal<T>;

	// Pointer Events
	onPointerDown?: PointerEventSignal<T>;
	onPointerDownCapture?: PointerEventSignal<T>;
	onPointerMove?: PointerEventSignal<T>;
	onPointerMoveCapture?: PointerEventSignal<T>;
	onPointerUp?: PointerEventSignal<T>;
	onPointerUpCapture?: PointerEventSignal<T>;
	onPointerCancel?: PointerEventSignal<T>;
	onPointerCancelCapture?: PointerEventSignal<T>;
	onPointerEnter?: PointerEventSignal<T>;
	onPointerEnterCapture?: PointerEventSignal<T>;
	onPointerLeave?: PointerEventSignal<T>;
	onPointerLeaveCapture?: PointerEventSignal<T>;
	onPointerOver?: PointerEventSignal<T>;
	onPointerOverCapture?: PointerEventSignal<T>;
	onPointerOut?: PointerEventSignal<T>;
	onPointerOutCapture?: PointerEventSignal<T>;
	onGotPointerCapture?: PointerEventSignal<T>;
	onGotPointerCaptureCapture?: PointerEventSignal<T>;
	onLostPointerCapture?: PointerEventSignal<T>;
	onLostPointerCaptureCapture?: PointerEventSignal<T>;

	// UI Events
	onScroll?: UIEventSignal<T>;
	onScrollCapture?: UIEventSignal<T>;

	// Wheel Events
	onWheel?: WheelEventSignal<T>;
	onWheelCapture?: WheelEventSignal<T>;

	// Animation Events
	onAnimationStart?: AnimationEventSignal<T>;
	onAnimationStartCapture?: AnimationEventSignal<T>;
	onAnimationEnd?: AnimationEventSignal<T>;
	onAnimationEndCapture?: AnimationEventSignal<T>;
	onAnimationIteration?: AnimationEventSignal<T>;
	onAnimationIterationCapture?: AnimationEventSignal<T>;

	// Transition Events
	onTransitionEnd?: TransitionEventSignal<T>;
	onTransitionEndCapture?: TransitionEventSignal<T>;
}

export interface StandardHtmlAttributes {
	accessKey?: InProp<string>;
	autoFocus?: InProp<boolean>;
	class?: InProp<string>;
	contentEditable?: InProp<Booleanish | "inherit">;
	contextMenu?: InProp<string>;
	dir?: InProp<string>;
	draggable?: InProp<Booleanish>;
	enterKeyHint?: InProp<
		"enter" | "done" | "go" | "next" | "previous" | "search" | "send"
	>;
	hidden?: InProp<boolean>;
	id?: InProp<string>;
	lang?: InProp<string>;
	part?: InProp<string>;
	nonce?: InProp<string>;
	placeholder?: InProp<string>;
	slot?: InProp<string>;
	spellCheck?: InProp<Booleanish>;
	style?: InProp<string>;
	tabIndex?: InProp<number>;
	title?: InProp<string>;
	translate?: InProp<"yes" | "no">;
	inert?: InProp<boolean>;

	// WAI-ARIA
	role?: InProp<AriaRole>;
}

export interface LivingStandardHtmlAttributes {
	/**
	 * Hints at the type of data that might be entered by the user while editing the element or its contents
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
	 */
	inputMode?: InProp<
		| "none"
		| "text"
		| "tel"
		| "url"
		| "email"
		| "numeric"
		| "decimal"
		| "search"
	>;
	/**
	 * Specify that a standard HTML element should behave like a defined custom built-in element
	 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
	 */
	is?: InProp<string>;
}

export interface NonStandardHtmlAttributes {
	// Non-standard Attributes
	autoCapitalize?: InProp<string>;
	autoCorrect?: InProp<string>;
	autoSave?: InProp<string>;
	color?: InProp<string>;
	itemProp?: InProp<string>;
	itemScope?: InProp<boolean>;
	itemType?: InProp<string>;
	itemId?: InProp<string>;
	itemRef?: InProp<string>;
	results?: InProp<number>;
	security?: InProp<string>;
	unselectable?: InProp<"on" | "off">;
}

export interface AriaAttributes {
	/** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
	"aria-activedescendant"?: InProp<string>;
	/** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
	"aria-atomic"?: InProp<Booleanish>;
	/**
	 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
	 * presented if they are made.
	 */
	"aria-autocomplete"?: InProp<"none" | "inline" | "list" | "both">;
	/** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
	/**
	 * Defines a string value that labels the current element, which is intended to be converted into Braille.
	 * @see aria-label.
	 */
	"aria-braillelabel"?: InProp<string>;
	/**
	 * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
	 * @see aria-roledescription.
	 */
	"aria-brailleroledescription"?: InProp<string>;
	"aria-busy"?: InProp<Booleanish>;
	/**
	 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
	 * @see aria-pressed @see aria-selected.
	 */
	"aria-checked"?: InProp<boolean | "false" | "mixed" | "true">;
	/**
	 * Defines the total number of columns in a table, grid, or treegrid.
	 * @see aria-colindex.
	 */
	"aria-colcount"?: InProp<number>;
	/**
	 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
	 * @see aria-colcount @see aria-colspan.
	 */
	"aria-colindex"?: InProp<number>;
	/**
	 * Defines a human readable text alternative of aria-colindex.
	 * @see aria-rowindextext.
	 */
	"aria-colindextext"?: InProp<string>;
	/**
	 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-colindex @see aria-rowspan.
	 */
	"aria-colspan"?: InProp<number>;
	/**
	 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
	 * @see aria-owns.
	 */
	"aria-controls"?: InProp<string>;
	/** Indicates the element that represents the current item within a container or set of related elements. */
	"aria-current"?: InProp<
		| boolean
		| "false"
		| "true"
		| "page"
		| "step"
		| "location"
		| "date"
		| "time"
	>;
	/**
	 * Identifies the element (or elements) that describes the object.
	 * @see aria-labelledby
	 */
	"aria-describedby"?: InProp<string>;
	/**
	 * Defines a string value that describes or annotates the current element.
	 * @see related aria-describedby.
	 */
	"aria-description"?: InProp<string>;
	/**
	 * Identifies the element that provides a detailed, extended description for the object.
	 * @see aria-describedby.
	 */
	"aria-details"?: InProp<string>;
	/**
	 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
	 * @see aria-hidden @see aria-readonly.
	 */
	"aria-disabled"?: InProp<Booleanish>;
	/**
	 * Indicates what functions can be performed when a dragged object is released on the drop target.
	 * @deprecated in ARIA 1.1
	 */
	"aria-dropeffect"?: InProp<
		"none" | "copy" | "execute" | "link" | "move" | "popup"
	>;
	/**
	 * Identifies the element that provides an error message for the object.
	 * @see aria-invalid @see aria-describedby.
	 */
	"aria-errormessage"?: InProp<string>;
	/** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
	"aria-expanded"?: InProp<Booleanish>;
	/**
	 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
	 * allows assistive technology to override the general default of reading in document source order.
	 */
	"aria-flowto"?: InProp<string>;
	/**
	 * Indicates an element's "grabbed" state in a drag-and-drop operation.
	 * @deprecated in ARIA 1.1
	 */
	"aria-grabbed"?: InProp<Booleanish>;
	/** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
	"aria-haspopup"?: InProp<
		| boolean
		| "false"
		| "true"
		| "menu"
		| "listbox"
		| "tree"
		| "grid"
		| "dialog"
	>;
	/**
	 * Indicates whether the element is exposed to an accessibility API.
	 * @see aria-disabled.
	 */
	"aria-hidden"?: InProp<Booleanish>;
	/**
	 * Indicates the entered value does not conform to the format expected by the application.
	 * @see aria-errormessage.
	 */
	"aria-invalid"?: InProp<
		boolean | "false" | "true" | "grammar" | "spelling"
	>;
	/** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
	"aria-keyshortcuts"?: InProp<string>;
	/**
	 * Defines a string value that labels the current element.
	 * @see aria-labelledby.
	 */
	"aria-label"?: InProp<string>;
	/**
	 * Identifies the element (or elements) that labels the current element.
	 * @see aria-describedby.
	 */
	"aria-labelledby"?: InProp<string>;
	/** Defines the hierarchical level of an element within a structure. */
	"aria-level"?: InProp<number>;
	/** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
	"aria-live"?: InProp<"off" | "assertive" | "polite">;
	/** Indicates whether an element is modal when displayed. */
	"aria-modal"?: InProp<Booleanish>;
	/** Indicates whether a text box accepts multiple lines of input or only a single line. */
	"aria-multiline"?: InProp<Booleanish>;
	/** Indicates that the user may select more than one item from the current selectable descendants. */
	"aria-multiselectable"?: InProp<Booleanish>;
	/** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
	"aria-orientation"?: InProp<"horizontal" | "vertical">;
	/**
	 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
	 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
	 * @see aria-controls.
	 */
	"aria-owns"?: InProp<string>;
	/**
	 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
	 * A hint could be a sample value or a brief description of the expected format.
	 */
	"aria-placeholder"?: InProp<string>;
	/**
	 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-setsize.
	 */
	"aria-posinset"?: InProp<number>;
	/**
	 * Indicates the current "pressed" state of toggle buttons.
	 * @see aria-checked @see aria-selected.
	 */
	"aria-pressed"?: InProp<boolean | "false" | "mixed" | "true">;
	/**
	 * Indicates that the element is not editable, but is otherwise operable.
	 * @see aria-disabled.
	 */
	"aria-readonly"?: InProp<Booleanish>;
	/**
	 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
	 * @see aria-atomic.
	 */
	"aria-relevant"?: InProp<
		| "additions"
		| "additions removals"
		| "additions text"
		| "all"
		| "removals"
		| "removals additions"
		| "removals text"
		| "text"
		| "text additions"
		| "text removals"
	>;
	/** Indicates that user input is required on the element before a form may be submitted. */
	"aria-required"?: InProp<Booleanish>;
	/** Defines a human-readable, author-localized description for the role of an element. */
	"aria-roledescription"?: InProp<string>;
	/**
	 * Defines the total number of rows in a table, grid, or treegrid.
	 * @see aria-rowindex.
	 */
	"aria-rowcount"?: InProp<number>;
	/**
	 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
	 * @see aria-rowcount @see aria-rowspan.
	 */
	"aria-rowindex"?: InProp<number>;
	/**
	 * Defines a human readable text alternative of aria-rowindex.
	 * @see aria-colindextext.
	 */
	"aria-rowindextext"?: InProp<string>;
	/**
	 * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-rowindex @see aria-colspan.
	 */
	"aria-rowspan"?: InProp<number>;
	/**
	 * Indicates the current "selected" state of various widgets.
	 * @see aria-checked @see aria-pressed.
	 */
	"aria-selected"?: InProp<Booleanish>;
	/**
	 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-posinset.
	 */
	"aria-setsize"?: InProp<number>;
	/** Indicates if items in a table or grid are sorted in ascending or descending order. */
	"aria-sort"?: InProp<"none" | "ascending" | "descending" | "other">;
	/** Defines the maximum allowed value for a range widget. */
	"aria-valuemax"?: InProp<number>;
	/** Defines the minimum allowed value for a range widget. */
	"aria-valuemin"?: InProp<number>;
	/**
	 * Defines the current value for a range widget.
	 * @see aria-valuetext.
	 */
	"aria-valuenow"?: InProp<number>;
	/** Defines the human readable text alternative of aria-valuenow for a range widget. */
	"aria-valuetext"?: InProp<string>;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AriaRole =
	| "alert"
	| "alertdialog"
	| "application"
	| "article"
	| "banner"
	| "button"
	| "cell"
	| "checkbox"
	| "columnheader"
	| "combobox"
	| "complementary"
	| "contentinfo"
	| "definition"
	| "dialog"
	| "directory"
	| "document"
	| "feed"
	| "figure"
	| "form"
	| "grid"
	| "gridcell"
	| "group"
	| "heading"
	| "img"
	| "link"
	| "list"
	| "listbox"
	| "listitem"
	| "log"
	| "main"
	| "marquee"
	| "math"
	| "menu"
	| "menubar"
	| "menuitem"
	| "menuitemcheckbox"
	| "menuitemradio"
	| "navigation"
	| "none"
	| "note"
	| "option"
	| "presentation"
	| "progressbar"
	| "radio"
	| "radiogroup"
	| "region"
	| "row"
	| "rowgroup"
	| "rowheader"
	| "scrollbar"
	| "search"
	| "searchbox"
	| "separator"
	| "slider"
	| "spinbutton"
	| "status"
	| "switch"
	| "tab"
	| "table"
	| "tablist"
	| "tabpanel"
	| "term"
	| "textbox"
	| "timer"
	| "toolbar"
	| "tooltip"
	| "tree"
	| "treegrid"
	| "treeitem"
	| (string & {});

export interface RdfaHtmlAttributes {
	/**
	 * A RDFa attribute containing a _URI_ or _CURIE_ used for stating what the data is about (a _subject_ in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-about
	 */
	about?: InProp<string>;
	/**
	 * A RDFa attribute for supplying machine-readable content for a literal (a _literal object_, in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-content
	 */
	content?: InProp<string>;
	/**
	 * A RDFa attribute containing a _term_, a _CURIE_ or an _absolute URI_ describing the data type of a literal.
	 * @see https://www.w3.org/TR/rdfa-core/#A-datatype
	 */
	dataType?: InProp<string>;
	/**
	 * A RDFa attribute used to indicate that the object associated with a `rel` or `property` attribute on the same element is to be added to the list for that predicate.
	 * The value of this attribute is ignored, the presence of this attribute causes a list to be created if it does not already exist.
	 * @see https://www.w3.org/TR/rdfa-core/#A-inlist
	 */
	inlist?: InProp<any>;
	/**
	 * A RDFa attribute containting a white space separated list of prefix-name URI pairs.
	 * @see https://www.w3.org/TR/rdfa-core/#A-prefix
	 */
	prefix?: InProp<string>;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used for expressing
	 * relationships between a subject and either a resource object if given or some literal text, also a _predicate_.
	 * @see https://www.w3.org/TR/rdfa-core/#A-property
	 */
	property?: InProp<string>;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used for expressing
	 * relationships between two resources (_predicates_ in RDF terminology).
	 * @see https://www.w3.org/TR/rdfa-core/#A-rel
	 */
	rel?: InProp<string>;
	/**
	 * A RDFa attribute containing a _URI_ or a _CURIE_ for expressing the partner resource
	 * of a relationship that is not intended to be navigable.
	 * @see https://www.w3.org/TR/rdfa-core/#A-resource
	 */
	resource?: InProp<string>;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_, used
	 * for expressing reverse relationships between two resources, also called _predicates_.
	 * @see https://www.w3.org/TR/rdfa-core/#A-rev
	 */
	rev?: InProp<string>;
	/**
	 * A RDFa attribute containing a white space separated list of _terms_, _CURIEs_ or _absolute URIs_
	 * that indicate the RDF type(s) to associate with a subject.
	 * @see https://www.w3.org/TR/rdfa-core/#A-typeof
	 */
	typeOf?: InProp<string>;
	/**
	 * A RDFa attribute containing an URI that defines the mapping to use when a _term_ is referenced in an attribute value.
	 * @see https://www.w3.org/TR/rdfa-core/#A-vocab
	 */
	vocab?: InProp<string>;
}

export interface HtmlAttributes<T extends EventTarget>
	extends DomAttributes<T>,
		StandardHtmlAttributes,
		LivingStandardHtmlAttributes,
		NonStandardHtmlAttributes,
		AriaAttributes,
		RdfaHtmlAttributes {}

export type HtmlLinkTarget =
	| "_self"
	| "_blank"
	| "_parent"
	| "_top"
	| (string & {});

export type HtmlCrossOriginPolicy =
	| "anonymous"
	| "use-credentials"
	| "";

export interface HtmlAnchorAttributes
	extends HtmlAttributes<HTMLAnchorElement> {
	download?: InProp<any>;
	href?: InProp<string>;
	hrefLang?: InProp<string>;
	media?: InProp<string>;
	ping?: InProp<string>;
	referrerPolicy?: InProp<ReferrerPolicy>;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: InProp<string>;
	target?: InProp<HtmlLinkTarget>;
	type?: InProp<string>;
}

export interface HtmlAudioAttributes
	extends HtmlMediaAttributes<HTMLAudioElement> {}

export interface HTMLAreaAttributes
	extends HtmlAttributes<HTMLAreaElement> {
	alt?: InProp<string>;
	coords?: InProp<string>;
	download?: InProp<any>;
	href?: InProp<string>;
	hrefLang?: InProp<string>;
	media?: InProp<string>;
	ping?: InProp<string>;
	referrerPolicy?: InProp<ReferrerPolicy>;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: InProp<string>;
	shape?: InProp<string>;
	target?: InProp<string>;
}

export interface HtmlBaseAttributes
	extends HtmlAttributes<HTMLBaseElement> {
	href?: InProp<string>;
	target?: InProp<string>;
}

export interface HtmlBlockquoteAttributes
	extends HtmlAttributes<HTMLQuoteElement> {
	cite?: InProp<string>;
}

export interface HtmlButtonAttributes
	extends HtmlAttributes<HTMLButtonElement> {
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	formAction?: InProp<string>;
	formEncType?: InProp<string>;
	formMethod?: InProp<string>;
	formNoValidate?: InProp<boolean>;
	formTarget?: InProp<string>;
	name?: InProp<string>;
	type?: InProp<"submit" | "reset" | "button">;
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlCanvasAttributes
	extends HtmlAttributes<HTMLCanvasElement> {
	height?: InProp<number | string>;
	width?: InProp<number | string>;
}

export interface HtmlColAttributes
	extends HtmlAttributes<HTMLTableColElement> {
	span?: InProp<number>;
	width?: InProp<number | string>;
}

export interface HtmlColGroupAttributes
	extends HtmlAttributes<HTMLTableColElement> {
	span?: InProp<number>;
}

export interface HtmlDataAttributes
	extends HtmlAttributes<HTMLDataElement> {
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlDetailsAttributes
	extends HtmlAttributes<HTMLDetailsElement> {
	open?: InOutProp<boolean>;
}

export interface HtmlDelAttributes
	extends HtmlAttributes<HTMLModElement> {
	cite?: InProp<string>;
	dateTime?: InProp<string>;
}

export interface HtmlDialogAttributes
	extends HtmlAttributes<HTMLDialogElement> {
	// TODO handle cancel & close
	open?: InProp<boolean>;
}

export interface HtmlEmbedAttributes
	extends HtmlAttributes<HTMLEmbedElement> {
	height?: InProp<number | string>;
	src?: InProp<string>;
	type?: InProp<string>;
	width?: InProp<number | string>;
}

export interface HtmlFieldSetAttributes
	extends HtmlAttributes<HTMLFieldSetElement> {
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	name?: InProp<string>;
}

export interface HtmlFormAttributes
	extends HtmlAttributes<HTMLFormElement> {
	acceptCharset?: InProp<string>;
	action?: InProp<string>;
	autoComplete?: InProp<string>;
	encType?: InProp<string>;
	method?: InProp<string>;
	name?: InProp<string>;
	noValidate?: InProp<boolean>;
	target?: InProp<string>;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: InProp<string>;
}

export interface HtmlHtmlAttributes
	extends HtmlAttributes<HTMLHtmlElement> {
	manifest?: InProp<string>;
}

export interface HtmlIFrameAttributes
	extends HtmlAttributes<HTMLIFrameElement> {
	allow?: InProp<string>;
	allowFullScreen?: InProp<boolean>;
	allowTransparency?: InProp<boolean>;
	/** @deprecated */
	frameBorder?: InProp<number | string>;
	height?: InProp<number | string>;
	loading?: InProp<"eager" | "lazy">;
	/** @deprecated */
	marginHeight?: InProp<number>;
	/** @deprecated */
	marginWidth?: InProp<number>;
	name?: InProp<string>;
	referrerPolicy?: InProp<ReferrerPolicy>;
	sandbox?: InProp<string>;
	/** @deprecated */
	scrolling?: InProp<string>;
	seamless?: InProp<boolean>;
	src?: InProp<string>;
	srcDoc?: InProp<string>;
	width?: InProp<number | string>;
}

export interface HtmlImageAttributes
	extends HtmlAttributes<HTMLImageElement> {
	alt?: InProp<string>;
	crossOrigin?: InProp<HtmlCrossOriginPolicy>;
	decoding?: InProp<"async" | "auto" | "sync">;
	height?: InProp<number | string>;
	/** @deprecated For accessibility reasons, you should generally avoid using server-side image maps, as they require the use of a mouse. Use a client-side image map instead. */
	isMap?: InProp<boolean>;
	loading?: InProp<"eager" | "lazy">;
	referrerPolicy?: InProp<ReferrerPolicy>;
	sizes?: InProp<string>;
	src?: InProp<string>;
	srcSet?: InProp<string>;
	useMap?: InProp<string>;
	width?: InProp<number | string>;

	naturalHeight?: OutProp<number>;
	naturalWidth?: OutProp<number>;
}

export interface HtmlInsAttributes
	extends HtmlAttributes<HTMLModElement> {
	cite?: InProp<string>;
	dateTime?: InProp<string>;
}

export type HtmlInputType =
	| "button"
	| "checkbox"
	| "color"
	| "date"
	| "datetime-local"
	| "email"
	| "file"
	| "hidden"
	| "image"
	| "month"
	| "number"
	| "password"
	| "radio"
	| "range"
	| "reset"
	| "search"
	| "submit"
	| "tel"
	| "text"
	| "time"
	| "url"
	| "week"
	| (string & {});

export interface HtmlInputAttributes
	extends HtmlAttributes<HTMLInputElement> {
	accept?: InProp<string>;
	alt?: InProp<string>;
	autoComplete?: InProp<string>;
	capture?: InProp<boolean | "user" | "environment">;
	crossOrigin?: InProp<HtmlCrossOriginPolicy>;
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	formAction?: InProp<string>;
	formEncType?: InProp<string>;
	formMethod?: InProp<string>;
	formNoValidate?: InProp<boolean>;
	formTarget?: InProp<string>;
	height?: InProp<number | string>;
	list?: InProp<string>;
	max?: InProp<number | string>;
	maxLength?: InProp<number>;
	min?: InProp<number | string>;
	minLength?: InProp<number>;
	multiple?: InProp<boolean>;
	name?: InProp<string>;
	pattern?: InProp<string>;
	placeholder?: InProp<string>;
	readOnly?: InProp<boolean>;
	required?: InProp<boolean>;
	size?: InProp<number>;
	src?: InProp<string>;
	step?: InProp<number | string>;
	type?: InProp<HtmlInputType>;
	width?: InProp<number | string>;

	checked?: InOutProp<boolean>;
	value?: InOutProp<string | readonly string[] | number>;

	files?: OutProp<FileList>;
	group?: OutProp<string>;
	indeterminate?: OutProp<boolean>;

	onChange?: ChangeEventSignal<HTMLInputElement>;
}

export interface HtmlKeygenAttributes
	extends HtmlAttributes<HTMLElement> {
	challenge?: InProp<string>;
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	keyType?: InProp<string>;
	keyParams?: InProp<string>;
	name?: InProp<string>;
}

export interface HtmlLabelAttributes
	extends HtmlAttributes<HTMLLabelElement> {
	form?: InProp<string>;
	for?: InProp<string>;
}

export interface HtmlLiAttributes
	extends HtmlAttributes<HTMLLIElement> {
	value?: InProp<string | readonly string[]>;
}

export interface HtmlLinkAttributes
	extends HtmlAttributes<HTMLLinkElement> {
	as?: InProp<string>;
	crossOrigin?: InProp<HtmlCrossOriginPolicy>;
	fetchPriority?: InProp<"high" | "low" | "auto">;
	href?: InProp<string>;
	hrefLang?: InProp<string>;
	integrity?: InProp<string>;
	media?: InProp<string>;
	imageSrcSet?: InProp<string>;
	imageSizes?: InProp<string>;
	referrerPolicy?: InProp<ReferrerPolicy>;
	/**
	 * Defines the relationship between a linked resource and the current document.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: InProp<string>;
	sizes?: InProp<string>;
	type?: InProp<string>;
	charSet?: InProp<string>;
}

export interface HtmlMapAttributes
	extends HtmlAttributes<HTMLMapElement> {
	name?: InProp<string>;
}

export interface HtmlMenuAttributes
	extends HtmlAttributes<HTMLMenuElement> {
	type?: InProp<string>;
}

export interface HtmlMediaAttributes<T extends HTMLMediaElement>
	extends HtmlAttributes<T> {
	autoPlay?: InProp<boolean>;
	controls?: InProp<boolean>;
	controlsList?: InProp<
		| "nodownload"
		| "nofullscreen"
		| "noplaybackrate"
		| "noremoteplayback"
		| (string & {})
	>;
	crossOrigin?: InProp<HtmlCrossOriginPolicy>;
	currentTime?: InProp<number>;
	loop?: InProp<boolean>;
	mediaGroup?: InProp<string>;
	muted?: InProp<boolean>;
	playsInline?: InProp<boolean>;
	preload?: InProp<string>;
	src?: InProp<string>;
	/**
	 * a value between 0 and 1
	 */
	volume?: InProp<number>;

	// TODO lots of stuff to bind here
}

export interface HtmlMetaAttributes
	extends HtmlAttributes<HTMLMetaElement> {
	charSet?: InProp<string>;
	content?: InProp<string>;
	httpEquiv?: InProp<string>;
	name?: InProp<string>;
	media?: InProp<string>;
}

export interface HtmlMeterAttributes
	extends HtmlAttributes<HTMLMeterElement> {
	form?: InProp<string>;
	high?: InProp<number>;
	low?: InProp<number>;
	max?: InProp<number | string>;
	min?: InProp<number | string>;
	optimum?: InProp<number>;
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlQuoteAttributes
	extends HtmlAttributes<HTMLQuoteElement> {
	cite?: InProp<string>;
}

export interface HtmlObjectAttributes
	extends HtmlAttributes<HTMLObjectElement> {
	/** @deprecated */
	classId?: InProp<string>;
	data?: InProp<string>;
	form?: InProp<string>;
	height?: InProp<number | string>;
	name?: InProp<string>;
	type?: InProp<string>;
	useMap?: InProp<string>;
	width?: InProp<number | string>;
}

export interface HtmlOlAttributes
	extends HtmlAttributes<HTMLOListElement> {
	reversed?: InProp<boolean>;
	start?: InProp<number>;
	type?: InProp<"1" | "a" | "A" | "i" | "I">;
}

export interface HtmlOptGroupAttributes
	extends HtmlAttributes<HTMLOptGroupElement> {
	disabled?: InProp<boolean>;
	label?: InProp<string>;
}

export interface HtmlOptionAttributes
	extends HtmlAttributes<HTMLOptionElement> {
	disabled?: InProp<boolean>;
	label?: InProp<string>;
	selected?: InProp<boolean>;
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlOutputAttributes
	extends HtmlAttributes<HTMLOutputElement> {
	form?: InProp<string>;
	for?: InProp<string>;
	name?: InProp<string>;
}

export interface HtmlParamAttributes
	extends HtmlAttributes<HTMLParamElement> {
	name?: InProp<string>;
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlProgressAttributes
	extends HtmlAttributes<HTMLProgressElement> {
	max?: InProp<number | string>;
	value?: InProp<string | readonly string[] | number>;
}

export interface HtmlSlotAttributes
	extends HtmlAttributes<HTMLSlotElement> {
	name?: InProp<string>;
}

export interface HtmlScriptAttributes
	extends HtmlAttributes<HTMLScriptElement> {
	async?: InProp<boolean>;
	/** @deprecated */
	charSet?: InProp<string>;
	crossOrigin?: InProp<HtmlCrossOriginPolicy>;
	defer?: InProp<boolean>;
	integrity?: InProp<string>;
	noModule?: InProp<boolean>;
	referrerPolicy?: InProp<ReferrerPolicy>;
	src?: InProp<string>;
	type?: InProp<string>;
}

export interface HtmlSelectAttributes
	extends HtmlAttributes<HTMLSelectElement> {
	autoComplete?: InProp<string>;
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	multiple?: InProp<boolean>;
	name?: InProp<string>;
	required?: InProp<boolean>;
	size?: InProp<number>;

	value?: InOutProp<string | readonly string[] | number>;

	onChange?: ChangeEventSignal<HTMLSelectElement>;
}

export interface HtmlSourceAttributes
	extends HtmlAttributes<HTMLSourceElement> {
	height?: InProp<number | string>;
	media?: InProp<string>;
	sizes?: InProp<string>;
	src?: InProp<string>;
	srcSet?: InProp<string>;
	type?: InProp<string>;
	width?: InProp<number | string>;
}

export interface HtmlStyleAttributes
	extends HtmlAttributes<HTMLStyleElement> {
	media?: InProp<string>;
	type?: InProp<string>;
}

export interface HtmlTableAttributes
	extends HtmlAttributes<HTMLTableElement> {
	/** @deprecated */
	align?: InProp<"left" | "center" | "right">;
	/** @deprecated */
	bgColor?: InProp<string>;
	/** @deprecated */
	border?: InProp<number>;
	/** @deprecated */
	cellPadding?: InProp<number | string>;
	/** @deprecated */
	cellSpacing?: InProp<number | string>;
	/** @deprecated */
	frame?: InProp<boolean>;
	/** @deprecated */
	rules?: InProp<"none" | "groups" | "rows" | "columns" | "all">;
	/** @deprecated */
	summary?: InProp<string>;
	/** @deprecated */
	width?: InProp<number | string>;
}

export interface HtmlTextAreaAttributes
	extends HtmlAttributes<HTMLTextAreaElement> {
	autoComplete?: InProp<string>;
	cols?: InProp<number>;
	dirName?: InProp<string>;
	disabled?: InProp<boolean>;
	form?: InProp<string>;
	maxLength?: InProp<number>;
	minLength?: InProp<number>;
	name?: InProp<string>;
	placeholder?: InProp<string>;
	readonly?: InProp<boolean>;
	required?: InProp<boolean>;
	rows?: InProp<number>;
	wrap?: InProp<string>;

	value?: InOutProp<string | ReadonlyArray<string> | number>;

	onChange?: ChangeEventSignal<HTMLTextAreaElement>;
}

export interface HtmlTdAttributes
	extends HtmlAttributes<HTMLTableCellElement> {
	/** @deprecated */
	abbr?: InProp<string>;
	/** @deprecated */
	align?: InProp<"left" | "center" | "right" | "justify" | "char">;
	colSpan?: InProp<number>;
	headers?: InProp<string>;
	rowSpan?: InProp<number>;
	/** @deprecated */
	scope?: InProp<string>;
	/** @deprecated */
	height?: InProp<number | string>;
	/** @deprecated */
	width?: InProp<number | string>;
	/** @deprecated */
	valign?: InProp<"top" | "middle" | "bottom" | "baseline">;
}

export interface HtmlThAttributes
	extends HtmlAttributes<HTMLTableCellElement> {
	abbr?: InProp<string>;
	/** @deprecated */
	align?: InProp<"left" | "center" | "right" | "justify" | "char">;
	colSpan?: InProp<number>;
	headers?: InProp<string>;
	rowSpan?: InProp<number>;
	scope?: InProp<string>;
}

export interface HtmlTimeAttributes
	extends HtmlAttributes<HTMLTimeElement> {
	dateTime: string;
}

export interface HtmlTrackAttributes
	extends HtmlAttributes<HTMLTrackElement> {
	default?: InProp<boolean>;
	kind?: InProp<string>;
	label?: InProp<string>;
	src?: InProp<string>;
	srcLang?: InProp<string>;
}

export interface HtmlVideoAttributes
	extends HtmlMediaAttributes<HTMLVideoElement> {
	height?: InProp<number | string>;
	playsInline?: InProp<boolean>;
	poster?: InProp<string>;
	width?: InProp<number | string>;
	disablePictureInPicture?: InProp<boolean>;
	disableRemotePlayback?: InProp<boolean>;

	// TODO bind dimensions
}

// TODO add document and window binds and events

export interface HtmlAttributesTagNameMap {
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
}

export type HtmlTagName = keyof HtmlAttributesTagNameMap;

export interface SVGAttributes<T extends EventTarget>
	extends AriaAttributes,
		DomAttributes<T> {
	// Attributes which also defined in HtmlAttributes
	className?: InProp<string>;
	class?: InProp<string>;
	color?: InProp<string>;
	height?: InProp<number | string>;
	id?: InProp<string>;
	lang?: InProp<string>;
	max?: InProp<number | string>;
	media?: InProp<string>;
	method?: InProp<string>;
	min?: InProp<number | string>;
	name?: InProp<string>;
	style?: InProp<string>;
	target?: InProp<string>;
	type?: InProp<string>;
	width?: InProp<number | string>;

	// Other HTML properties supported by SVG elements in browsers
	role?: InProp<AriaRole>;
	tabindex?: InProp<number>;
	crossorigin?: InProp<"anonymous" | "use-credentials" | "">;

	// SVG Specific attributes
	"accent-height"?: InProp<number | string>;
	accumulate?: InProp<"none" | "sum">;
	additive?: InProp<"replace" | "sum">;
	"alignment-baseline"?:
		| "auto"
		| "baseline"
		| "before-edge"
		| "text-before-edge"
		| "middle"
		| "central"
		| "after-edge"
		| "text-after-edge"
		| "ideographic"
		| "alphabetic"
		| "hanging"
		| "mathematical"
		| "inherit";
	allowReorder?: InProp<"no" | "yes">;
	alphabetic?: InProp<number | string>;
	amplitude?: InProp<number | string>;
	"arabic-form"?: InProp<
		"initial" | "medial" | "terminal" | "isolated"
	>;
	ascent?: InProp<number | string>;
	attributeName?: InProp<string>;
	attributeType?: InProp<string>;
	autoReverse?: InProp<number | string>;
	azimuth?: InProp<number | string>;
	baseFrequency?: InProp<number | string>;
	"baseline-shift"?: InProp<number | string>;
	baseProfile?: InProp<number | string>;
	bbox?: InProp<number | string>;
	begin?: InProp<number | string>;
	bias?: InProp<number | string>;
	by?: InProp<number | string>;
	calcMode?: InProp<number | string>;
	"cap-height"?: InProp<number | string>;
	clip?: InProp<number | string>;
	"clip-path"?: InProp<string>;
	clipPathUnits?: InProp<number | string>;
	"clip-rule"?: InProp<number | string>;
	"color-interpolation"?: InProp<number | string>;
	"color-interpolation-filters"?: InProp<
		"auto" | "sRGB" | "linearRGB" | "inherit"
	>;
	"color-profile"?: InProp<number | string>;
	"color-rendering"?: InProp<number | string>;
	contentScriptType?: InProp<number | string>;
	contentStyleType?: InProp<number | string>;
	cursor?: InProp<number | string>;
	cx?: InProp<number | string>;
	cy?: InProp<number | string>;
	d?: InProp<string>;
	decelerate?: InProp<number | string>;
	descent?: InProp<number | string>;
	diffuseConstant?: InProp<number | string>;
	direction?: InProp<number | string>;
	display?: InProp<number | string>;
	divisor?: InProp<number | string>;
	"dominant-baseline"?: InProp<number | string>;
	dur?: InProp<number | string>;
	dx?: InProp<number | string>;
	dy?: InProp<number | string>;
	edgeMode?: InProp<number | string>;
	elevation?: InProp<number | string>;
	"enable-background"?: InProp<number | string>;
	end?: InProp<number | string>;
	exponent?: InProp<number | string>;
	externalResourcesRequired?: InProp<number | string>;
	fill?: InProp<string>;
	"fill-opacity"?: InProp<number | string>;
	"fill-rule"?: InProp<"nonzero" | "evenodd" | "inherit">;
	filter?: InProp<string>;
	filterRes?: InProp<number | string>;
	filterUnits?: InProp<number | string>;
	"flood-color"?: InProp<number | string>;
	"flood-opacity"?: InProp<number | string>;
	focusable?: InProp<number | string>;
	"font-family"?: InProp<string>;
	"font-size"?: InProp<number | string>;
	"font-size-adjust"?: InProp<number | string>;
	"font-stretch"?: InProp<number | string>;
	"font-style"?: InProp<number | string>;
	"font-variant"?: InProp<number | string>;
	"font-weight"?: InProp<number | string>;
	format?: InProp<number | string>;
	from?: InProp<number | string>;
	fx?: InProp<number | string>;
	fy?: InProp<number | string>;
	g1?: InProp<number | string>;
	g2?: InProp<number | string>;
	"glyph-name"?: InProp<number | string>;
	"glyph-orientation-horizontal"?: InProp<number | string>;
	"glyph-orientation-vertical"?: InProp<number | string>;
	glyphRef?: InProp<number | string>;
	gradientTransform?: InProp<string>;
	gradientUnits?: InProp<string>;
	hanging?: InProp<number | string>;
	href?: InProp<string>;
	"horiz-adv-x"?: InProp<number | string>;
	"horiz-origin-x"?: InProp<number | string>;
	ideographic?: InProp<number | string>;
	"image-rendering"?: InProp<number | string>;
	in2?: InProp<number | string>;
	in?: InProp<string>;
	intercept?: InProp<number | string>;
	k1?: InProp<number | string>;
	k2?: InProp<number | string>;
	k3?: InProp<number | string>;
	k4?: InProp<number | string>;
	k?: InProp<number | string>;
	kernelMatrix?: InProp<number | string>;
	kernelUnitLength?: InProp<number | string>;
	kerning?: InProp<number | string>;
	keyPoints?: InProp<number | string>;
	keySplines?: InProp<number | string>;
	keyTimes?: InProp<number | string>;
	lengthAdjust?: InProp<number | string>;
	"letter-spacing"?: InProp<number | string>;
	"lighting-color"?: InProp<number | string>;
	limitingConeAngle?: InProp<number | string>;
	local?: InProp<number | string>;
	"marker-end"?: InProp<string>;
	markerHeight?: InProp<number | string>;
	"marker-mid"?: InProp<string>;
	"marker-start"?: InProp<string>;
	markerUnits?: InProp<number | string>;
	markerWidth?: InProp<number | string>;
	mask?: InProp<string>;
	maskContentUnits?: InProp<number | string>;
	maskUnits?: InProp<number | string>;
	mathematical?: InProp<number | string>;
	mode?: InProp<number | string>;
	numOctaves?: InProp<number | string>;
	offset?: InProp<number | string>;
	opacity?: InProp<number | string>;
	operator?: InProp<number | string>;
	order?: InProp<number | string>;
	orient?: InProp<number | string>;
	orientation?: InProp<number | string>;
	origin?: InProp<number | string>;
	overflow?: InProp<number | string>;
	"overline-position"?: InProp<number | string>;
	"overline-thickness"?: InProp<number | string>;
	"paint-order"?: InProp<number | string>;
	"panose-1"?: InProp<number | string>;
	path?: InProp<string>;
	pathLength?: InProp<number | string>;
	patternContentUnits?: InProp<string>;
	patternTransform?: InProp<number | string>;
	patternUnits?: InProp<string>;
	"pointer-events"?: InProp<number | string>;
	points?: InProp<string>;
	pointsAtX?: InProp<number | string>;
	pointsAtY?: InProp<number | string>;
	pointsAtZ?: InProp<number | string>;
	preserveAlpha?: InProp<number | string>;
	preserveAspectRatio?: InProp<string>;
	primitiveUnits?: InProp<number | string>;
	r?: InProp<number | string>;
	radius?: InProp<number | string>;
	refX?: InProp<number | string>;
	refY?: InProp<number | string>;
	"rendering-intent"?: InProp<number | string>;
	repeatCount?: InProp<number | string>;
	repeatDur?: InProp<number | string>;
	requiredExtensions?: InProp<number | string>;
	requiredFeatures?: InProp<number | string>;
	restart?: InProp<number | string>;
	result?: InProp<string>;
	rotate?: InProp<number | string>;
	rx?: InProp<number | string>;
	ry?: InProp<number | string>;
	scale?: InProp<number | string>;
	seed?: InProp<number | string>;
	"shape-rendering"?: InProp<number | string>;
	slope?: InProp<number | string>;
	spacing?: InProp<number | string>;
	specularConstant?: InProp<number | string>;
	specularExponent?: InProp<number | string>;
	speed?: InProp<number | string>;
	spreadMethod?: InProp<string>;
	startOffset?: InProp<number | string>;
	stdDeviation?: InProp<number | string>;
	stemh?: InProp<number | string>;
	stemv?: InProp<number | string>;
	stitchTiles?: InProp<number | string>;
	"stop-color"?: InProp<string>;
	"stop-opacity"?: InProp<number | string>;
	"strikethrough-position"?: InProp<number | string>;
	"strikethrough-thickness"?: InProp<number | string>;
	string?: InProp<number | string>;
	stroke?: InProp<string>;
	"stroke-dasharray"?: InProp<string | number>;
	"stroke-dashoffset"?: InProp<string | number>;
	"stroke-linecap"?: InProp<"butt" | "round" | "square" | "inherit">;
	"stroke-linejoin"?: InProp<"miter" | "round" | "bevel" | "inherit">;
	"stroke-miterlimit"?: InProp<string>;
	"stroke-opacity"?: InProp<number | string>;
	"stroke-width"?: InProp<number | string>;
	surfaceScale?: InProp<number | string>;
	systemLanguage?: InProp<number | string>;
	tableValues?: InProp<number | string>;
	targetX?: InProp<number | string>;
	targetY?: InProp<number | string>;
	"text-anchor"?: InProp<string>;
	"text-decoration"?: InProp<number | string>;
	textLength?: InProp<number | string>;
	"text-rendering"?: InProp<number | string>;
	to?: InProp<number | string>;
	transform?: InProp<string>;
	u1?: InProp<number | string>;
	u2?: InProp<number | string>;
	"underline-position"?: InProp<number | string>;
	"underline-thickness"?: InProp<number | string>;
	unicode?: InProp<number | string>;
	"unicode-bidi"?: InProp<number | string>;
	"unicode-range"?: InProp<number | string>;
	"units-per-em"?: InProp<number | string>;
	"v-alphabetic"?: InProp<number | string>;
	values?: InProp<string>;
	"vector-effect"?: InProp<number | string>;
	version?: InProp<string>;
	"vert-adv-y"?: InProp<number | string>;
	"vert-origin-x"?: InProp<number | string>;
	"vert-origin-y"?: InProp<number | string>;
	"v-hanging"?: InProp<number | string>;
	"v-ideographic"?: InProp<number | string>;
	viewBox?: InProp<string>;
	viewTarget?: InProp<number | string>;
	visibility?: InProp<number | string>;
	"v-mathematical"?: InProp<number | string>;
	widths?: InProp<number | string>;
	"word-spacing"?: InProp<number | string>;
	"writing-mode"?: InProp<number | string>;
	x1?: InProp<number | string>;
	x2?: InProp<number | string>;
	x?: InProp<number | string>;
	xChannelSelector?: InProp<string>;
	"x-height"?: InProp<number | string>;
	"xlink:actuate"?: InProp<string>;
	"xlink:arcrole"?: InProp<string>;
	"xlink:href"?: InProp<string>;
	"xlink:role"?: InProp<string>;
	"xlink:show"?: InProp<string>;
	"xlink:title"?: InProp<string>;
	"xlink:type"?: InProp<string>;
	"xml:base"?: InProp<string>;
	"xml:lang"?: InProp<string>;
	xmlns?: InProp<string>;
	"xmlns:xlink"?: InProp<string>;
	"xml:space"?: InProp<string>;
	y1?: InProp<number | string>;
	y2?: InProp<number | string>;
	y?: InProp<number | string>;
	yChannelSelector?: InProp<string>;
	z?: InProp<number | string>;
	zoomAndPan?: InProp<string>;
}

export interface SvgAttributesTagNameMap {
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

export type SvgTagName = keyof SvgAttributesTagNameMap;
