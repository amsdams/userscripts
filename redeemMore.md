
# Backup Code to add to IITC userscript


```javascript
// aware 'Passcode circuitry too hot. Wait for cool down to enter another passcode'
// a setTiemout added, but not tested due to line above

// around line 16000, near 'window.setupRedeem'
window.setupRedeemMore = function() {
    var seconds = 10;
    var eleRedeemMore = $("#redeemmore");
    var eleRedeem = $("#redeem");
    eleRedeemMore.keypress(function(e) {
        if((e.keyCode ? e.keyCode : e.which) !== 13) return;
        var e = jQuery.Event( 'keypress', { keyCode :13} );
        var eleRedeemMoreText = eleRedeemMore.val();
        var lines = eleRedeemMoreText.split('\n');
        for(var i = 0; i < lines.length; i++) {
            var passcode = lines[i];
            console.log('waiting %s seconds with passcode %s', passcode, seconds);
            setTimeout(function() {
                eleRedeem.val(passcode);
                eleRedeem.trigger(e);
            }, seconds * 1000);
        }
    });
};
//around line 92
  + '    <textarea id="redeemmore" rows="4" cols="50"></textarea>'
//around line 1300
window.setupRedeemMore();
```
