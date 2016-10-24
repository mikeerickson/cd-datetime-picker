'use strict';

// module.exports = TimeFormatMaskDirective;

/**
 * Time Format Mask
 *
 * @example <input time-format-mask="__:__ am" />
 *
 * @ngInject
 */
function TimeFormatMaskDirective() {
	return {
		restrict: 'A',
		require: '^ngModel',
		scope: {
			enableMask: '=',
			value: '=ngModel'
		},
		link: TimeFormatMaskLinker
	};


	function TimeFormatMaskLinker(scope, element, attrs, ngModel) {
		let defaultMask = 'hh:mm';
		let allowSuffix = (attrs.allowSuffix === 'true');
		let suffixMaskAM = allowSuffix ? ' am' : '';
		let suffixMaskPM = allowSuffix ? ' pm' : '';
		let tmp = [];
		let mask = attrs.timeFormatMask || defaultMask;
		let enableMask = false;

		scope.$watch('enableMask', function (value){
			enableMask = value;
			if (enableMask) {
				scope.value = element[0].value.length > 0 ? element[0].value : mask;
				setPosition(element[0], mask);
			}
		});

		/**
		 * Click event handler
		 * Set the position of the cursor to the end of the user input
		 */
		element[0].addEventListener('click', (e) => {
			if (enableMask) {
				e = e || window.event;
				let source = e.target || e.srcElement;

				if (source.value === mask)
					tmp.length = 0;

				setPosition(source, mask);
			}
		});

		/**
		 * Keyup event
		 * Update ngModel with element value
		 */
		element[0].addEventListener('keyup', _ => {
			ngModel.$setViewValue(element[0].value);
		});

		/**
		 * Keydown event handler
		 * Validtes the character code that the user is trying to enter into the text field
		 */
		element[0].addEventListener('keydown', (e) => {
			e = e || window.event;

			if (enableMask) {
				// prevent angular mgModel binding
				e.preventDefault();
				e.stopPropagation();

				let source = e.target || e.srcElement;

				// The key pressed is not allowed
				if (!isAllowedKeyCode(e.keyCode))
					return false;

				// The current cursor position
				let charPos = source.selectionStart;
				// The character that was pressed
				let charVal = e.key;

				// ArrowLeft/ ArrowRight
				if (e.keyCode === 37 || e.keyCode === 39) {
					let pos = charPos;
					if (e.keyCode === 37) pos--;
					else pos++;

					if (pos >= 0 && pos <= getAvaiablePosition(source, mask))
						source.setSelectionRange(pos, pos);
				}
				// Backspace
				else if (e.keyCode === 8) {
					if (charPos === 1)
						mask = (attrs.timeFormatMask || defaultMask);

					if (tmp[charPos - 1] === ':' || tmp[charPos - 1] === ' ') {
						tmp[charPos - 2] = mask.charAt(charPos - 2);
					}
					tmp[charPos - 1] = mask.charAt(charPos - 1);
				}
				// 0-9
				else if (!isNaN(charVal)) {
					// First Character
					if (charPos === 0) {
						// 2x:xx so remove AM/PM suffix
						if (charVal === '2') {
							tmp[0] = charVal;
							mask = (attrs.timeFormatMask || defaultMask);
						}
						// 0x:xx or 1x:xx so append Am suffix
						else if (charVal === '1' || charVal === '0') {
							tmp[0] = charVal;
							mask = (attrs.timeFormatMask || defaultMask) + suffixMaskAM;
						}
						// 0[3-9]:xx
						else {
							tmp[0] = '0';
							tmp[1] = charVal;
							mask = (attrs.timeFormatMask || defaultMask) + suffixMaskAM;
						}
					}
					// Second Character
					else if (charPos === 1) {
						// Previous character was a zero and this character is less than 4
						if (!(tmp[charPos - 1] === '2' && parseInt(charVal) > 3))
							tmp[charPos] = charVal;

						// Previous character was a zero so add a suffix of AM for over 7 and PM for less
						// 06:xx PM
						// 07:xx AM
						if (tmp[charPos - 1] === '0')
							mask = (attrs.timeFormatMask || defaultMask) + (parseInt(charVal) <= 7 ? suffixMaskPM : suffixMaskAM);
						// Previous character was a 1
						if (tmp[charPos - 1] === '1') {
							// This character is greater than 2 so must be in 24hour format - remove the suffix
							if (parseInt(charVal) > 2)
								mask = (attrs.timeFormatMask || defaultMask);
							// 12:xx PM
							else if (parseInt(charVal) === 2)
								mask = (attrs.timeFormatMask || defaultMask) + suffixMaskPM;
							// otherwise assum AM
							else
								mask = (attrs.timeFormatMask || defaultMask) + suffixMaskAM;
						}
					}
					// Third Character must be 5 or less
					else if (charPos === 3 && parseInt(charVal,10) <= 5) {
						tmp[charPos] = charVal;
					}
					// Forth Character can be 0-9
					else if (charPos === 4) {
						tmp[charPos] = charVal;
					}
				}
				// First/Second character is a colon
				else if (e.keyCode === 186 && charPos <= 1) {
					tmp[1] = charPos === 1 ? tmp[0] : '0';
					tmp[0] = '0';
				}
				// AM/PM suffix
				else if (mask.length > 5 && charPos === 6) {
					if (e.keyCode === 65) {
						tmp[6] = 'a';
						tmp[7] = 'm';
					}
					else if (e.keyCode === 80) {
						tmp[6] = 'p';
						tmp[7] = 'm';
					}
				}


				///////


				// ArrowLeft or ArrowRight keys
				if (e.keyCode === 37 || e.keyCode === 39) {
					return true;
				}
				else {
					let val = [];
					for (let i = 0; i < mask.length; i++) {
						if (tmp.length > i) {
							val[i] = tmp[i];
						}
						else {
							val[i] = mask.charAt(i);
						}
					}

					source.value = val.join('');
					//ngModel.$setViewValue(val.join(''));
					//ngModel.$render();
					setPosition(source, mask);


				}

				return false;
			}
		});

		/**
		 * set the position of the cursor
		 * @param {DomElement} el
		 * @param {string} mask
		 */
		function setPosition(el, mask) {
			let pos = getAvaiablePosition(el, mask);

			if (pos < el.selectionStart)
				el.setSelectionRange(pos, pos);
		}

		/**
		 * get the position of the cursor
		 * @param {DomElement} el
		 * @param {string} mask
		 */
		function getAvaiablePosition(el, mask) {
			let pos = 0;

			for (let i = 0; i <= el.value.length; i++) {
				if (el.value.charAt(i) === mask.charAt(i) && mask.charAt(i) !== ':' && mask.charAt(i) !== ' ' /*&& mask.charAt(i) !== 'm'*/) {
					pos = i;
					break;
				}
				else if (mask.charAt(i) === ':' || mask.charAt(i) === ' ') {
					tmp[i] = mask.charAt(i);
				}
			}

			return pos;
		}


		function isAllowedKeyCode(c) {
			// colon, arrow keys, backspace, a/p, 0-9
			if ((c === 186 || c === 37 || c === 39 || c === 8 || c === 65 || c === 80) || (c >= 48 && c <= 57))
				return true;
			else
				return false;
		}
	}
}
