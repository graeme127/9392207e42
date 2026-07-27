(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.hero');

  if (hero) {
    requestAnimationFrame(function () { hero.classList.add('is-visible'); });

    if (!reduceMotion) {
      var ticking = false;
      function moveHero() {
        var shift = Math.min(44, Math.max(0, window.scrollY * 0.11));
        hero.style.setProperty('--hero-shift', shift + 'px');
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(moveHero);
          ticking = true;
        }
      }, {passive:true});
      moveHero();
    }
  }

  document.querySelectorAll('.mood-card').forEach(function (card) {
    var buttons = Array.prototype.slice.call(card.querySelectorAll('.mood-button'));
    var copies = Array.prototype.slice.call(card.querySelectorAll('[data-mood-copy]'));

    function showMood(mode) {
      card.setAttribute('data-mode', mode);
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-mood') === mode ? 'true' : 'false');
      });
      copies.forEach(function (copy) {
        copy.hidden = copy.getAttribute('data-mood-copy') !== mode;
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () { showMood(button.getAttribute('data-mood')); });
    });
  });

  var shareButton = document.querySelector('.share-button');
  var shareStatus = document.querySelector('.share-status');
  if (shareButton) {
    shareButton.addEventListener('click', function () {
      var shareData = {title:document.title, url:window.location.href.split('#')[0]};
      if (navigator.share) {
        navigator.share(shareData).then(function () {
          if (shareStatus) shareStatus.textContent = 'Thanks for sharing.';
        }).catch(function (error) {
          if (error && error.name !== 'AbortError' && shareStatus) shareStatus.textContent = 'Sharing was not available. Try copying the address from your browser.';
        });
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareData.url).then(function () {
          if (shareStatus) shareStatus.textContent = 'Link copied.';
        }).catch(function () {
          if (shareStatus) shareStatus.textContent = 'Copy the page address from your browser to share it.';
        });
        return;
      }
      if (shareStatus) shareStatus.textContent = 'Copy the page address from your browser to share it.';
    });
  }
}());
