(function () {
	var buttonDisabledClassname = 'btn-primary_disabled';

	/**
	* Edit initial DOM structure for msisdn page(template is not editable)
	* @param {Element} msisdnInputElement msisdn input DOM element .
	* @param {Element} formGroupElement form div DOM element
	* @returns {undefined}
	*/
	function replaceElements(msisdnInputElement, formGroupElement) {
		msisdnInputElement.setAttribute('placeholder', 'Номер телефона');
		// to change input position
		formGroupElement.appendChild(msisdnInputElement);
		// to change HTML elements order
		formGroupElement.appendChild(formGroupElement.firstElementChild);
	}

	/**
	* Edit username field(msisdn) for otp page
	* @param {Element} usernNameElement msisdn input DOM element .
	* @returns {undefined}
	*/
	function editUsernameField(usernNameElement) {
		var msisdn = prettyMsisdn(usernNameElement.innerText);
		if (msisdn) {
			usernNameElement.innerText = msisdn;
		}
	}

	/**
	* Format msisdn from '9991112233' to '+7 999 111 22 33' pattern
	* @param {string} msisdnString msisdn string.
	* @returns {string | null}
	*/
	function prettyMsisdn(msisdnString) {
		var cleaned = msisdnString.replace(/\D/g, '');
		var match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
		if (match) {
			return '+7 ' + match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
		}
		return null;
	}

	/**
	* Clean msisdn to '9991112233' pattern.
	* Will remove first symbols: "8", "7", "+7"
	* @param {string} msisdnString msisdn string.
	* @returns {string}
	*/
	function cleanMsisdn(msisdnString) {
        var digitalValue = msisdnString.replace(/\D/g, '');
        var isPhoneLengthAboveOne = digitalValue.length > 1;
        var firstDigit = digitalValue[0];

        if (isPhoneLengthAboveOne) {
            firstDigit === '8' && (digitalValue = digitalValue.replace('8', ''));
            firstDigit === '7' && (digitalValue = digitalValue.replace('7', ''));
        }

        return digitalValue;
    };

	/**
	* Script for msisdn page(sms-validation-mobile-number.ftl)
	* @param {Element} msisdnInputElement msisdn-input DOM element .
	* @returns {undefined}
	*/
	function editMsisdnPage(msisdnInputElement) {
		var formGroupElement = document.querySelector('.form-group');
		var buttonElement = document.querySelector('.btn-primary');
		var errElement = document.querySelector('.kc-feedback-text');

		var msisdnMaskOptions = {
			mask: '+{7} 000 000 00 00',
			placeholderChar: ' ',
			lazy: true,
		};
		var msisdnValidLength = 11;
		
		if (errElement && errElement.innerText.includes('Invalid mobile number')) {
            errElement.innerText = "Некорректный номер";
        }

		buttonElement && buttonElement.classList.add(buttonDisabledClassname);
		replaceElements(msisdnInputElement, formGroupElement);
		msisdnInputElement.setAttribute('type', 'tel');
		msisdnInputElement.setAttribute('inputmode', 'tel');

		msisdnInputElement.addEventListener('paste', function(event) {
			var pasteData = (event.clipboardData || window.clipboardData).getData('text');
			var cleanedMsisdn = cleanMsisdn(pasteData);

			if (cleanedMsisdn) {
				msisdnInputElement.value = cleanedMsisdn;
			}
		});

		var msisdnMask = IMask(msisdnInputElement, msisdnMaskOptions);
		msisdnMask.on("accept", function () {
			if (msisdnMask.unmaskedValue.length === msisdnValidLength) {
				buttonElement.classList.remove(buttonDisabledClassname);
			} else {
				buttonElement.classList.add(buttonDisabledClassname);
			}
		});
		msisdnInputElement.addEventListener('focus', function() {
			msisdnMask.updateOptions({ lazy: false });
		}, true);
		msisdnInputElement.addEventListener('blur', function() {
			msisdnMask.updateOptions({ lazy: true });
		}, true);
	}

	/**
	* Script for otp page(sms-verify-phone-validation.ftl)
	* @param {Element} otpInputElement otp-input DOM element .
	* @returns {undefined}
	*/
	function editOtpPage(otpInputElement) {
		var buttonElement = document.querySelector('.btn-primary');
		var usernNameElement = document.querySelector('#kc-attempted-username');

		var otpMaskOptions = {
			mask: /^\d+$/,
		};

		editUsernameField(usernNameElement);
		buttonElement && buttonElement.classList.add(buttonDisabledClassname);
		otpInputElement.setAttribute('type', 'tel');
		otpInputElement.setAttribute('inputmode', 'numeric');

		var otpMask =  IMask(otpInputElement, otpMaskOptions);
		otpMask.on("accept", function () {
			if (otpMask.unmaskedValue.length > 0) {
				buttonElement.classList.remove(buttonDisabledClassname);
			} else { 
				buttonElement.classList.add(buttonDisabledClassname);
			}
		});
	}

	/**
	* Script for already logged in user
	* @param {Element} otpInputElement otp-input DOM element .
	* @returns {undefined}
	*/
	function editAlreadyLoggedInPage() {
		var contentWrapperElement = document.querySelector('#kc-content-wrapper');
		var infoMessageElement = contentWrapperElement.querySelector('#kc-info-message');
		var markup = `<a href="https://plus.megafon.ru/" class="btn btn-primary btn-lg">Перейти в аккаунт</a>`

		if (infoMessageElement) {
			infoMessageElement.remove();
		}

		contentWrapperElement.innerHTML = markup;
	}

	function onDocumentLoadCallback () {
		var msisdnInputElement = document.querySelector('#mobile_number');
		var otpInputElement = document.querySelector('#totp');
		var titleElement = document.querySelector('#kc-page-title');

		if (msisdnInputElement) {
			editMsisdnPage(msisdnInputElement);
		} else if (otpInputElement) {
			editOtpPage(otpInputElement);
		} else if (titleElement && titleElement.textContent.includes('Вы уже вошли.')) {
			editAlreadyLoggedInPage();
		}
	};

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded', onDocumentLoadCallback);
	} else {
		onDocumentLoadCallback();
	}
}());
