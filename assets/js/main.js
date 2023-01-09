document.addEventListener(
  'DOMContentLoaded',
  function () {
    loadCopyCodeBlockButton();
  },
  false
);

function loadCopyCodeBlockButton() {
  var codeBlocks = document.querySelectorAll('pre.highlight');

  codeBlocks.forEach(function (codeBlock) {
    var copyButton = document.createElement('button');
    copyButton.className = 'copy';
    copyButton.type = 'button';
    copyButton.ariaLabel = 'Copy code to clipboard';
    copyButton.title = 'Copy';
    copyButton.innerText = '';

    var icon = document.createElement('i');
    icon.className = 'icon icon-copy';
    copyButton.append(icon);

    codeBlock.prepend(copyButton);

    copyButton.addEventListener('click', function () {
      var code = codeBlock.querySelector('code').innerText.trim();
      window.navigator.clipboard.writeText(code);

      copyButton.innerText = 'Copied';
      var threeSeconds = 3000;

      setTimeout(function () {
        copyButton.innerText = '';
        copyButton.append(icon);
      }, threeSeconds);
    });
  });
}
