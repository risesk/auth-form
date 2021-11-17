(function () {
    function addGtmMsisdnButtonClick () {
        window.dataLayer.push({
            event: 'addEvents_makeConversions',
            event_id: 'd-v412-e14',
            event_cat: 'МФ+',
            event_name: 'sendInput1',
            event_param: 'Продолжить / Введен номер телефона',
        });
    }

    function addGtmMsisdnError (err) {
        window.dataLayer.push({
            event: 'addEvents_makeConversions',
            event_id: 'd-v412-e15',
            event_cat: 'МФ+',
            event_name: 'sendError1',
            event_param: `Продолжить / ${err}`,
        });
    }

    function addGtmOtpError (err) {
        window.dataLayer.push({
            event: 'addEvents_makeConversions',
            event_id: 'd-v412-e16',
            event_cat: 'МФ+',
            event_name: 'sendError2',
            event_param: `Продолжить / ${err}`,
        });
    }

    function addGtmResetLoginButtonClick () {
        window.dataLayer.push({
            event: 'addEvents_makeConversions',
            event_id: 'd-v412-e17',
            event_cat: 'МФ+',
            event_name: 'clickElement',
            event_param: 'Ввод кода из SMS / Редактировать номер',
        });
    }

    function addGtmOtpButtonClick () {
        window.dataLayer.push({
            event: 'addEvents_makeConversions',
            event_id: 'd-v412-e18',
            event_cat: 'МФ+',
            event_name: 'sendInput2',
            event_param: 'Продолжить / Введен код из смс',
        });
    }

    function initMsisdnPageGtm() {
        var buttonElement = document.querySelector('#kc-login');
        var errorElement = document.querySelector('.kc-feedback-text');

        if (!errorElement) {
            window.dataLayer.push({
                event: 'addEvents_makeConversions',
                event_id: 'd-v412-e13',
                event_cat: 'МФ+',
                event_name: 'checkOut',
                event_param: 'Форма ввода номера телефона',
            });
        }

        if (errorElement) {
            addGtmMsisdnError(errorElement.textContent);
        }

        if (buttonElement) {
            buttonElement.addEventListener('click', addGtmMsisdnButtonClick);
        }
    }

    function initOtpPageGtm() {
        var buttonElement = document.querySelector('#kc-login');
        var errorElement = document.querySelector('.kc-feedback-text');
        var resetElement = document.querySelector('#reset-login');

        if (errorElement) {
            addGtmOtpError(errorElement.textContent);
        }
        
        if (resetElement) {
            resetElement.addEventListener('click', addGtmResetLoginButtonClick);
        }

        if (buttonElement) {
            buttonElement.addEventListener('click', addGtmOtpButtonClick);
        }
    }

    function onDocumentLoadCallback () {
		var msisdnInputElement = document.querySelector('#mobile_number');
		var otpInputElement = document.querySelector('#totp');

		if (msisdnInputElement) {
			initMsisdnPageGtm(msisdnInputElement);
		} else if (otpInputElement) {
			initOtpPageGtm(otpInputElement);
		}

	};

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded', onDocumentLoadCallback);
	} else {
		onDocumentLoadCallback();
	}
    
}());