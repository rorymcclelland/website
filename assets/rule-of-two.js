/* Rule of Two calculator: shared by the Method and Safety pages.
   RuleOfTwo.verdict(data, content, act) returns the classification;
   RuleOfTwo.render(onClass) wires the standard markup (rk-* toggles, r2c-/r2t- Venn ids,
   riskVerdictBadge, riskGuide) and calls onClass(classKey) after each update. */
(function () {
  function verdict(data, content, act) {
    var count = (data ? 1 : 0) + (content ? 1 : 0) + (act ? 1 : 0);
    var classKey = null, guide = '';
    if (!data && !content && !act) {
      guide = 'There is no meaningful exposure from this particular combination, which, admittedly, makes it the less interesting case. Tick a box above to see how that changes.';
    } else if (data && !content && !act) {
      classKey = 'A';
      guide = 'This is Class A: internal only. Private data goes in, the output goes to a person, and nothing comes in from outside. It is reasonable to proceed here, once permissions have been properly tidied up.';
    } else if (!data && content && !act) {
      classKey = 'B';
      guide = 'This is Class B: outside content, but no power to act on it. It is reasonable to proceed once a model with no tools of its own reads the content and passes back labels, never instructions.';
    } else if (data && content && act) {
      classKey = 'C';
      guide = 'This is Class C: all three properties at once, and the one that deserves real caution. Proceed only once containment has been built and properly tested, a human gate has been placed in front of anything irreversible, and the decision to proceed has been made explicitly, not by default.';
    } else if (data && !content && act) {
      guide = 'The system can see private data and act on it, but never reads anything it hasn’t produced itself. It is reasonable to proceed within a clearly defined envelope. However, the moment it starts reading anything external, it should be redesigned as the all-three case above.';
    } else if (!data && content && act) {
      guide = 'Outside content is read and the system can act, but there is no private data on hand to expose. This is reasonably contained, though it still needs testing against prompt injection before any further autonomy is extended.';
    } else if (data && content && !act) {
      guide = 'Private data is read alongside outside material, but no action is taken as a result. It is reasonable to proceed with care once permissions are clean, bearing in mind that adding the ability to act would then be the entire risk.';
    } else {
      guide = 'The system can act, but has no private data to expose and reads nothing it did not write itself, so there is nothing here for an attacker to steer. This shape is unusual in practice, since most systems worth giving the ability to act also need to see data or content to know what to do with it.';
    }
    return {
      count: count,
      classKey: classKey,
      guide: guide,
      badgeClass: count <= 1 ? 'ok' : (count === 2 ? 'mid' : 'hot'),
      badgeText: count <= 1 ? 'Low exposure' : (count === 2 ? 'Elevated: be deliberate' : 'Contained design required')
    };
  }

  function $(id) { return document.getElementById(id); }

  function setVenn(circleId, labelId, on, anyOn) {
    var c = $(circleId), t = $(labelId);
    if (c) { c.classList.toggle('r2-active', on); c.classList.toggle('r2-dim', anyOn && !on); }
    if (t) { t.classList.toggle('r2-active', on); t.classList.toggle('r2-dim', anyOn && !on); }
  }

  function update(onClass) {
    if (!$('rk-data')) return;
    var data = $('rk-data').checked, content = $('rk-content').checked, act = $('rk-act').checked;
    var v = verdict(data, content, act), anyOn = v.count > 0;
    setVenn('r2c-data', 'r2t-data', data, anyOn);
    setVenn('r2c-content', 'r2t-content', content, anyOn);
    setVenn('r2c-act', 'r2t-act', act, anyOn);
    var badge = $('riskVerdictBadge');
    badge.classList.remove('ok', 'mid', 'hot');
    badge.classList.add(v.badgeClass);
    badge.textContent = v.badgeText;
    $('riskGuide').textContent = v.guide;
    if (onClass) onClass(v.classKey);
  }

  function render(onClass) {
    ['rk-data', 'rk-content', 'rk-act'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('change', function () { update(onClass); });
    });
    update(onClass);
    return function () { update(onClass); };
  }

  window.RuleOfTwo = { verdict: verdict, render: render };
})();
