    var options = {
        title: '&#x1F36A; Accept Cookies & Privacy Policy?',
        message: 'Cookies are used to customize and improve your user experience. Click the <strong>accept</strong> if you are ok with cookies being used. We dont trade or sell your data. ',
        delay: 600,
        expires: 1,
        link: '/privacy',
        onAccept: function(){
            var myPreferences = $.fn.ihavecookies.cookie();
            console.log('Nice, welcome. The following preferences were saved...');
            console.log(myPreferences);
        },
        uncheckBoxes: true,
        acceptBtnLabel: 'Accept Cookies',
        moreInfoLabel: 'More information',
        cookieTypesTitle: 'Select which cookies you want to accept',
        fixedCookieTypeLabel: 'Essential',
        fixedCookieTypeDesc: 'These are essential for the website to work correctly.'
    }
